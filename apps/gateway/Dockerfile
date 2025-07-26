FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache protoc

COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
COPY apps/gateway/package*.json apps/gateway/
RUN npm ci

COPY webpack.config.base.js ./
COPY apps ./apps
COPY libs ./libs

RUN npm run proto:generate
RUN npm run build:gateway

FROM node:22-alpine AS production
WORKDIR /app

COPY package*.json ./
COPY apps/gateway/package*.json apps/gateway/

COPY --from=builder /app/apps/gateway/dist ./dist
COPY --from=builder /app/libs/proto ./libs/proto

ENV NODE_ENV=production
EXPOSE 3006

CMD ["node", "dist/main.js"]