package main

import (
	"log"
	"os"
	"os/exec"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Launching Declutr Main Server on port %s...", port)
	cmd := exec.Command("go", "run", "cmd/main.go")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Env = os.Environ()
	if err := cmd.Run(); err != nil {
		log.Fatalf("Failed to run cmd/main.go: %v", err)
	}
}
