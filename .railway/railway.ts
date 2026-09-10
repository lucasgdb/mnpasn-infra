import { defineRailway, github, postgres, preserve, project, service, volume } from "railway/iac";

export default defineRailway(() => {
  const PostgresV2 = postgres("Postgres-v2", { region: "us-east4-eqdc4a" });

  const postgresV2Volume = volume("postgres-volume-gj03", {
    alerts: {
      usage: {
        "100": {},
        "80": {},
        "95": {},
      },
    },
    allowOnlineResize: true,
    region: "us-east4-eqdc4a",
    sizeMB: 5000,
  });

  const mnpasnBot = service("mnpasn-bot", {
    source: github("lucasgdb/mnpasn-bot", { checkSuites: false }),
    start: "",
    replicas: {
      "us-east4-eqdc4a": 1,
    },
    deploy: {
      healthcheckPath: "/health",
      preDeployCommand: ["./node_modules/.bin/prisma migrate deploy"],
    },
    env: {
      APP_URL: preserve(),
      ASAAS_API_KEY: preserve(),
      ASAAS_BASE_URL: preserve(),
      ASAAS_WEBHOOK_TOKEN: preserve(),
      CAMPAIGN_BATCH_SIZE: preserve(),
      CAMPAIGN_CRON: preserve(),
      CAMPAIGN_ENABLED: preserve(),
      CAMPAIGN_INTERVAL_HOURS: preserve(),
      CAMPAIGN_MAX_MESSAGES: preserve(),
      CAMPAIGN_SEND_INTERVAL_MS: preserve(),
      CHANNEL_INVITE_EXPIRATION_MINUTES: preserve(),
      DATABASE_URL: preserve(),
      INSTANCE_ADMIN_TOKEN: preserve(),
      LOG_LEVEL: preserve(),
      LOG_PRETTY: preserve(),
      NODE_ENV: preserve(),
      PAYMENT_HTTP_TIMEOUT_MS: preserve(),
      PAYMENT_PROVIDER: preserve(),
      POSTHOG_API_KEY: preserve(),
      POSTHOG_ENABLED: preserve(),
      POSTHOG_HOST: preserve(),
      SENTRY_DSN: preserve(),
      SENTRY_ENABLED: preserve(),
      SENTRY_ENVIRONMENT: preserve(),
      SENTRY_RELEASE: preserve(),
      WEBHOOK_SECRET: preserve(),
    },
  });

  const mnpasnAdmin = service("mnpasn-admin", {
    source: github("lucasgdb/mnpasn-admin", { checkSuites: false }),
    build: "pnpm build",
    start: "pnpm start",
    replicas: {
      "us-east4-eqdc4a": 1,
    },
    deploy: {
      healthcheckPath: "/health",
    },
    env: {
      DATABASE_URL: PostgresV2.env.DATABASE_URL,
      HOSTNAME: "0.0.0.0",
      NEXT_TELEMETRY_DISABLED: "1",
      NODE_ENV: "production",
      RAILPACK_NODE_VERSION: "24",
    },
  });

  return project("mnpasn-bot", {
    resources: [mnpasnBot, mnpasnAdmin, PostgresV2, postgresV2Volume],
  });
});
