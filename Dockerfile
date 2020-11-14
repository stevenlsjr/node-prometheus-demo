FROM node:lts-alpine AS build
RUN adduser -u 1003  appuser -D && \
  mkdir -p /app && \
  chown 1003:1003 /app

USER 1003
WORKDIR /app
ADD --chown=1003:1003 package.json yarn.lock /app/
ENV NODE_ENV=development
RUN yarn install --non-interactive --frozen-lockfile
ADD --chown=1003:1003 . /app

FROM build AS release
ENV NODE_ENV=production
RUN yarn install --non-interactive --frozen-lockfile && \
 yarn cache clean
CMD [ "yarn", "start" ]