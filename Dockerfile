FROM node:22-alpine AS builder
RUN apk add --no-cache protoc
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
COPY ./src/public ./src/public
RUN npx prisma generate
RUN npm run proto:generate
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/email/templates ./email/templates
COPY --from=builder /app/src/public ./src/public

COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

ENV NODE_ENV=production
EXPOSE 3000

CMD ["./wait-for-it.sh", "postgres", "5432", "--", "npm", "run", "start:prod"]