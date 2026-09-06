# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Source has to be in place before generate: Prisma 7 reads tsconfig.json to
# decide which extension its own imports use, and gets it wrong without one.
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Dev dependencies are kept because the container runs `prisma migrate deploy`
# on start, and the Prisma CLI lives there.
COPY package*.json ./
RUN npm ci

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY prisma7.config.ts ./

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
