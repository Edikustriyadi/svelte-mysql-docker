FROM node:23-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

ARG NODE_ENV
RUN if ["$NODE_ENV" = "development"];\
    then npm install;\
    else npm install --only=production;\
    fi

RUN npm install
COPY . ./
ENV PORT 3000
EXPOSE $PORT

CMD [ "npm","run","dev" ]