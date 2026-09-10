# MNPASN infrastructure

Shared Railway infrastructure for `mnpasn-bot`, `mnpasn-admin`, `Postgres-v2`,
and its volume. The existing Railway project remains named `mnpasn-bot`.

## Setup

Install Node.js 24, pnpm 11.25.0, and the Railway CLI, then run:

```bash
pnpm install
railway login
railway link --project 0d4d12a8-7ca1-483b-bd8a-d276c0527611 --environment production
railway status
pnpm plan
```

Verify the linked project and environment before planning or applying.

## Infrastructure changes

Edit `.railway/railway.ts`, run `pnpm plan`, and review the complete diff.
Run `pnpm apply` to apply the reviewed changes. Moving the file here does not
require applying infrastructure changes.

Keep every managed resource in this single configuration. Removing a resource
can schedule its deletion. Do not duplicate this configuration in application repositories.
Keep secrets as `preserve()` and shared values as resource references such as
`PostgresV2.env.DATABASE_URL`. Never commit secrets or saved plan artifacts.

## Application deployments

Bot and admin code stays in their respective repositories. Each Railway service
uses its own GitHub source, so application pushes deploy independently.
Infrastructure changes are applied from this directory; pushing this directory
alone does not apply them. Database migrations remain the bot pre-deploy step.

This separation does not create a Railway project or redeploy applications.
