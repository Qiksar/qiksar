FROM node:16.10.0-bullseye 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY ./dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"] 
