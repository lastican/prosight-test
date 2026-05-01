FROM node:24.15-alpine3.22 AS builder
WORKDIR /app

COPY package*.json .
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build



FROM node:24.15-alpine3.22
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json .
RUN npm ci --omit=dev

COPY --from=builder /app/dist/ .

CMD ["node", "src/main"]