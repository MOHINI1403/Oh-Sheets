FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000 4000

CMD ["node", "server.js"]
