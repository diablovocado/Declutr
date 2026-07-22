package middleware

import (
	"context"
	"net/http"
)

type tenantContextKey string

const OrganizationIDKey tenantContextKey = "organization_id"

// TenantMiddleware extracts organization context for multi-tenant request isolation.
func TenantMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		orgID := r.Header.Get("X-Organization-ID")

		ctx := r.Context()
		if orgID != "" {
			ctx = context.WithValue(ctx, OrganizationIDKey, orgID)
		}

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetOrganizationIDFromContext retrieves Organization ID from request context.
func GetOrganizationIDFromContext(ctx context.Context) (string, bool) {
	if ctx == nil {
		return "", false
	}
	orgID, ok := ctx.Value(OrganizationIDKey).(string)
	return orgID, ok && orgID != ""
}
