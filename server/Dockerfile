#server/Dockerfile

FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY mongodb ./mongodb

ENV PORT=4000
EXPOSE 4000

USER node

CMD ["node", "src/index.js"]