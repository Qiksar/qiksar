FROM node:16.10.0-bullseye as development

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install
RUN yarn add @nestjs/cli

COPY . .
RUN yarn build


EXPOSE 3000
CMD ["node", "dist/main"]
#CMD ["yarn", "start:dev"]