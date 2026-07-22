# Declutr On-Call Rotation & Escalation Schedule

Guidance for on-call engineers managing production reliability and site availability.

## Rotation Structure

- **Primary On-Call**: 7-day shift (Monday 09:00 UTC to Monday 09:00 UTC). Responsible for first-responder PagerDuty alerts.
- **Secondary On-Call**: Backup responder if Primary fails to acknowledge alert within 15 minutes.
- **Handover Protocol**: Weekly handover meeting every Monday at 09:00 UTC to review open incidents, telemetry trends, and operational tasks.
