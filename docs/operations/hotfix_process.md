# Declutr Emergency Hotfix & Patch Release Process

Standard operating procedures for authoring, verifying, tagging, and deploying emergency hotfixes.

## Hotfix Pipeline

1. **Branch Creation**: Create branch `hotfix/v1.0.x-issue-description` from `main` or release tag.
2. **Patch Authoring & Unit Testing**: Implement fix, preserve docstrings/comments, and add unit regression tests in `backend/tests/`.
3. **Emergency QA Verification**: Trigger fast CI pipeline (`.github/workflows/hotfix.yml`).
4. **Tag & Deploy**: Tag patch release `v1.0.1` and deploy directly via automated Canary deployment pipeline.
