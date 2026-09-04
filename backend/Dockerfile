# Multi-stage Dockerfile for Aptus AI Backend
FROM node:20-alpine AS base

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
