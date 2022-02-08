FROM node:16.10.0-bullseye as development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=development

COPY . .

RUN npm run build
EXPOSE 3000

FROM node:16.10.0-bullseye as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]