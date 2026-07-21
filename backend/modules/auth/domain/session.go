package domain

import "time"

type UserSession struct {
	SessionID        string    `json:"sessionId"`
	UserID           string    `json:"userId"`
	RefreshTokenHash string    `json:"refreshTokenHash"`
	DeviceName       string    `json:"deviceName"`
	IPAddress        string    `json:"ipAddress"`
	UserAgent        string    `json:"userAgent"`
	ExpiresAt        time.Time `json:"expiresAt"`
	CreatedAt        time.Time `json:"createdAt"`
	LastSeenAt       time.Time `json:"lastSeenAt"`
	RevokedAt        *time.Time `json:"revokedAt,omitempty"`
}

func (s *UserSession) IsActive() bool {
	if s.RevokedAt != nil {
		return false
	}
	return time.Now().Before(s.ExpiresAt)
}
