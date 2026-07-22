# Declutr Maintenance Window & Infrastructure Schedule

Policy guidelines for zero-downtime maintenance and scheduled maintenance windows.

## Maintenance Policy

- **Zero-Downtime Releases**: Database schema updates are strictly additive (`CREATE TABLE IF NOT EXISTS`, non-blocking column additions) allowing zero-downtime rolling updates.
- **Scheduled Maintenance Window**: Sundays 02:00 UTC to 04:00 UTC (if major PostgreSQL engine upgrades or network re-routing is required).
- **Public Notification**: Scheduled maintenance is posted to `/status` at least 72 hours in advance.
