# Platform

Platform is an independent polyrepo of shared libraries and event contracts. It has no HTTP server, worker, database, or runtime container.

## Contents

- `contracts/events`: versioned event payloads and type guards.
- `packages/config`: environment parsing helpers.
- `packages/http-common`: shared HTTP response/error formatting.
- `packages/logger`: structured logging.
- `packages/security-sdk`: JWT/security helpers.
- `packages/event-bus`: event publishing helpers.
- `packages/cache`: cache helpers.
- `packages/tracing`: OpenTelemetry setup.

## Publish

Packages are published independently through `.github/workflows/release-platform-packages.yml` to GitHub Packages. Consumers install them as `@daccuong-uit/*` packages. The registry token belongs in GitHub Actions secrets, never in a committed file.

The platform repository does not need `.env`, Docker Compose, or a Dockerfile because it does not run a process. Local package tests/builds may be run in CI; application services consume published versions.

## Change flow

```powershell
git checkout -b feat/my-platform-change
# edit package or contract
git add .
git commit -m "feat(platform): describe change"
git push -u origin feat/my-platform-change
```

Open a pull request, merge to `main`, and publish a new package version. Services must then update their dependency version and rebuild their own Docker image.
