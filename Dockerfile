FROM node:lts-alpine AS builder
RUN apk add --no-cache git gettext

WORKDIR /app

COPY . .

RUN npm install && npm run build --prod

FROM nginx:alpine
COPY --from=builder app/dist/* /usr/share/nginx/html
COPY .docker/nginx_default.conf /etc/nginx/conf.d/default.conf

ENV NISQ_ANALYZER_HOST_NAME localhost
ENV NISQ_ANALYZER_PORT 5010

WORKDIR /app

RUN apk add --no-cache jq bash \
    && mkdir -p /opt/init-config.d \
    && wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/bin/wait-for-it \
    && chmod +x /usr/bin/wait-for-it \
    && chmod +x config-init.sh

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "/app/config-init.sh && envsubst < /usr/share/nginx/html/assets/env.js.template > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
