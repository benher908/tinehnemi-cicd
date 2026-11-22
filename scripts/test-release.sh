#!/usr/bin/env bash
# ------------------------------------------------------------------
# test-release.sh
# PRUEBAS SOBRE EL ENTORNO DE LIBERACIÓN (release/staging):
# valida, antes de desplegar, que el artefacto generado por
# build-release.sh es correcto, completo y seguro de publicar.
#
# Uso:
#   ./scripts/test-release.sh [directorio_build]
# ------------------------------------------------------------------
set -euo pipefail

BUILD_DIR="${1:-dist}"
FAIL=0

check() {
  local desc="$1"; shift
  if "$@"; then
    echo "  [OK]   ${desc}"
  else
    echo "  [FAIL] ${desc}"
    FAIL=1
  fi
}

echo "==> [test-release] Validando calidad de código (ESLint)..."
if npm run lint; then
  echo "  [OK]   Lint sin errores bloqueantes"
else
  echo "  [FAIL] Lint reportó errores"
  FAIL=1
fi

echo "==> [test-release] Validando artefacto de build en: ${BUILD_DIR}"
check "existe ${BUILD_DIR}/index.html"        bash -c "[ -f '${BUILD_DIR}/index.html' ]"
check "existe carpeta de assets _expo/static"  bash -c "[ -d '${BUILD_DIR}/_expo' ] || [ -d '${BUILD_DIR}/assets' ]"
check "index.html no está vacío"               bash -c "[ -s '${BUILD_DIR}/index.html' ]"
check "no se filtraron archivos .env"          bash -c "[ ! -f '${BUILD_DIR}/.env' ]"
check "no se filtraron node_modules"           bash -c "[ ! -d '${BUILD_DIR}/node_modules' ]"

TOTAL_FILES=$(find "${BUILD_DIR}" -type f | wc -l)
echo "==> [test-release] Archivos totales en el artefacto: ${TOTAL_FILES}"
check "el artefacto no está vacío (>3 archivos)" bash -c "[ ${TOTAL_FILES} -gt 3 ]"

if [ "${FAIL}" -ne 0 ]; then
  echo "==> [test-release] RESULTADO: FALLÓ. No se procede al despliegue." >&2
  exit 1
fi

echo "==> [test-release] RESULTADO: El entorno de liberación pasó todas las pruebas. Apto para desplegar."
