FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache protoc

COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
COPY apps/subscription/package*.json apps/subscription/
RUN npm ci

COPY webpack.config.base.js ./
COPY apps ./apps
COPY libs ./libs

RUN npx prisma generate --schema=apps/subscription/prisma/schema.prisma
RUN npm run proto:generate

RUN npm run build:subscription

FROM node:22-alpine AS production
WORKDIR /app

COPY package*.json ./
COPY apps/subscription/package*.json apps/subscription/
RUN npm ci --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/apps/subscription/prisma ./apps/subscription/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

COPY --from=builder /app/apps/subscription/dist ./dist
COPY --from=builder /app/libs/proto ./libs/proto

COPY apps/subscription/wait-for-it.sh ./wait-for-it.sh
RUN chmod +x wait-for-it.sh

ENV NODE_ENV=production
EXPOSE 3002

CMD ["./wait-for-it.sh", "postgres", "5432", "--", "npm", "run", "start:prod"]