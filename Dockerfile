FROM node:20.9.0-alpine

WORKDIR /srv/spice-up-api

COPY package.json package-lock.json ./
RUN npm ci
COPY ./ /srv/spice-up-api

CMD ["npm","start"]