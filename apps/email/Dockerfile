FROM node:22-alpine AS builder

RUN apk add --no-cache protoc

WORKDIR /app

COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
COPY apps/email/package*.json apps/email/

RUN npm ci

COPY webpack.config.base.js ./
COPY apps ./apps
COPY libs ./libs

RUN npm run proto:generate

RUN npm run build:email

FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY apps/email/package*.json apps/email/

COPY --from=builder /app/apps/email/dist/ ./dist/
COPY --from=builder /app/libs/proto ./libs/proto
COPY --from=builder /app/apps/email/templates ./apps/email/templates

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/main.js"]
