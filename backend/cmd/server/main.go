package main

import (
	"log"
	"net/http"

	"github.com/diablovocado/declutr/modules/auth/application"
	"github.com/diablovocado/declutr/modules/auth/repository"
	"github.com/diablovocado/declutr/modules/auth/transport"
	contextApp "github.com/diablovocado/declutr/modules/context/application"
	contextRepository "github.com/diablovocado/declutr/modules/context/repository"
	contextTransport "github.com/diablovocado/declutr/modules/context/transport"
	personaApp "github.com/diablovocado/declutr/modules/persona/application"
	personaRepository "github.com/diablovocado/declutr/modules/persona/repository"
	personaTransport "github.com/diablovocado/declutr/modules/persona/transport"
	"github.com/diablovocado/declutr/pkg/health"
	"github.com/diablovocado/declutr/shared/database"
	"github.com/diablovocado/declutr/shared/middleware"
)

func main() {
	db := database.Connect()

	userRepo := &repository.PostgresUserRepository{
		DB: db,
	}

	authService := &application.Service{
		UserRepo:   userRepo,
		Challenges: application.NewChallengeStore(),
		SRP:        application.NewEngine(),
	}

	http.HandleFunc("/health", health.Handler)

	http.HandleFunc(
		"/api/v1/auth/register",
		transport.RegisterHandler(authService),
	)

	http.HandleFunc(
		"/api/v1/auth/login/start",
		transport.LoginStartHandler(authService),
	)
	http.Handle(
		"/api/v1/me",
		middleware.Auth(userRepo)(transport.MeHandler()),
	)

	http.HandleFunc(
		"/api/v1/auth/login/finish",
		transport.LoginFinishHandler(authService),
	)

	// Context & Intent Engine Module initialization
	contextRepo := contextRepository.NewInMemoryContextRepository()
	contextService := contextApp.NewContextService(contextRepo, nil)
	contextAPI := contextTransport.NewAPI(contextService)

	http.HandleFunc("/api/v1/context", contextAPI.GetContextsHandler)
	http.HandleFunc("/api/v1/context/details", contextAPI.GetContextDetailHandler)
	http.HandleFunc("/api/v1/context/refresh", contextAPI.RefreshContextHandler)
	http.HandleFunc("/api/v1/context/intent", contextAPI.GetIntentHandler)
	http.HandleFunc("/api/v1/context/stats", contextAPI.GetStatsHandler)

	// Reverse Persona Engine Module initialization
	personaRepo := personaRepository.NewInMemoryPersonaRepository()
	personaSvc := personaApp.NewPersonaService(personaRepo)
	personaEngine := personaApp.NewPersonaEngine(personaSvc)
	_ = personaEngine // available for worker dispatch
	personaAPI := personaTransport.NewPersonaAPI(personaSvc)

	http.HandleFunc("/api/v1/persona", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodDelete {
			personaAPI.DeletePersona(w, r)
		} else {
			personaAPI.GetPersona(w, r)
		}
	})
	http.HandleFunc("/api/v1/persona/recommendations", personaAPI.GetRecommendations)
	http.HandleFunc("/api/v1/persona/settings", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPut {
			personaAPI.UpdateSettings(w, r)
		} else {
			personaAPI.GetSettings(w, r)
		}
	})
	http.HandleFunc("/api/v1/persona/reset", personaAPI.ResetPersona)
	http.HandleFunc("/api/v1/persona/export", personaAPI.ExportPersona)
	http.HandleFunc("/api/v1/persona/signal", personaAPI.RecordSignal)
	http.HandleFunc("/api/v1/persona/history", personaAPI.GetHistory)

	log.Println("Declutr Backend Running on :8080")

	log.Fatal(http.ListenAndServe(":8080", nil))
}
