#!/usr/bin/env bash
# ------------------------------------------------------------------
# smoke-test.sh
# Prueba de humo POST-DESPLIEGUE: verifica que el entorno de
# despliegue (GitHub Pages) está realmente arriba y sirviendo la app.
#
# Uso:
#   ./scripts/smoke-test.sh [url]
# ------------------------------------------------------------------
set -euo pipefail

URL="${1:-https://benher908.github.io/tinehnemi-cicd/}"
MAX_RETRIES=10
WAIT_SECONDS=15

echo "==> [smoke-test] Verificando disponibilidad de: ${URL}"

for i in $(seq 1 "${MAX_RETRIES}"); do
  HTTP_CODE="$(curl -s -o /tmp/smoke_body.html -w '%{http_code}' "${URL}" || echo "000")"
  if [ "${HTTP_CODE}" = "200" ]; then
    echo "==> [smoke-test] Intento ${i}/${MAX_RETRIES}: HTTP ${HTTP_CODE} (OK)"
    break
  fi
  echo "==> [smoke-test] Intento ${i}/${MAX_RETRIES}: HTTP ${HTTP_CODE}, reintentando en ${WAIT_SECONDS}s..."
  sleep "${WAIT_SECONDS}"
done

if [ "${HTTP_CODE}" != "200" ]; then
  echo "ERROR: el entorno de despliegue no respondió 200 tras ${MAX_RETRIES} intentos (último: ${HTTP_CODE})." >&2
  exit 1
fi

if grep -qi "Tinehnemi" /tmp/smoke_body.html; then
  echo "==> [smoke-test] Contenido esperado encontrado en la respuesta (marca 'Tinehnemi')."
else
  echo "ERROR: la respuesta no contiene el contenido esperado de la aplicación." >&2
  exit 1
fi

echo "==> [smoke-test] RESULTADO: el entorno de despliegue está disponible y sirviendo la app correctamente."
