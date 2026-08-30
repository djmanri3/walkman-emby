#!/bin/sh
set -e

# Renderiza config.js a partir de las variables de entorno (con defaults de .env)
render_config() {
  envsubst \
    '${DEFAULT_LANGUAGE} ${DEFAULT_SERVER_TYPE} ${DEFAULT_SERVER_URL}' \
    < /usr/share/nginx/html/config.js.template \
    > /usr/share/nginx/html/config.js
}

# Carga los defaults de .env solo si la variable no está definida en el entorno,
# para que `docker run -e` / docker-compose `environment` tengan prioridad.
ENV_FILE=/usr/share/nginx/html/.env
if [ -f "$ENV_FILE" ]; then
  for _var in DEFAULT_LANGUAGE DEFAULT_SERVER_TYPE DEFAULT_SERVER_URL; do
    if ! eval "test -n \"\$$_var\""; then
      _val=$(grep "^${_var}=" "$ENV_FILE" 2>/dev/null | head -n1 | cut -d= -f2-)
      case "$_val" in
        \"*\") _val=${_val#\"}; _val=${_val%\"} ;;
      esac
      if [ -n "$_val" ]; then
        eval "export $_var=\"\$_val\""
      fi
    fi
  done
  unset _var _val
fi

render_config

exec "$@"