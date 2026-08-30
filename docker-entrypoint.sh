#!/bin/sh
set -e

# Renderiza config.js a partir de las variables de entorno (con defaults de .env)
render_config() {
  envsubst \
    '${DEFAULT_LANGUAGE} ${DEFAULT_SERVER_TYPE} ${DEFAULT_SERVER_URL}' \
    < /usr/share/nginx/html/config.js.template \
    > /usr/share/nginx/html/config.js
}

render_config

exec "$@"