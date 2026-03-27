FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
RUN npm install

COPY . .
RUN npm run build -w client

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY server/package*.json ./server/
RUN npm install --omit=dev --prefix ./server

COPY --from=build /app/server ./server
COPY --from=build /app/client/dist ./client/dist

EXPOSE 3001
CMD ["node", "server/index.js"]
