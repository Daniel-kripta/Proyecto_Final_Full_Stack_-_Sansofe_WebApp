FROM node:24-alpine
WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install --frozen-lockfile

RUN cd apps/api && DATABASE_URL=postgresql://x:x@localhost/x npx prisma generate

RUN cd apps/api && pnpm run build

CMD ["node", "apps/api/dist/index.js"]
