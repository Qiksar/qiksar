FROM node:16.10.0-bullseye 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
COPY . .

RUN yarn -D add @nestjs/cli
RUN yarn install 

EXPOSE 3000

RUN yarn build

CMD ["node", "dist/main"] 
