FROM keymetrics/pm2:10-alpine

RUN apk update && apk upgrade && \
  apk add --no-cache \
    bash \
    git \
    curl \
    openssh

MAINTAINER Arief Ditia Faltah
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ARG MONGO
ARG JWT_SECRET
ARG DEBUG
ENV MONGO ${MONGO}
ENV JWT_SECRET ${JWT_SECRET}
ENV DEBUG ${DEBUG}
COPY package*.json ./
RUN echo "MONGO=${MONGO}" >> /usr/src/app/.env
RUN echo "JWT_SECRET=${JWT_SECRET}" >> /usr/src/app/.env
RUN echo "DEBUG=${DEBUG}" >> /usr/src/app/.env
RUN npm cache clean --force
RUN npm install
COPY . .

EXPOSE 3010

CMD [ "pm2-runtime", "start", "pm2.json", "--env", "production"]
