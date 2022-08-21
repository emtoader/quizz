FROM node:16-alpine as development

WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]