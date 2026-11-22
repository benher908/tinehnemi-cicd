#!/usr/bin/env bash
# ------------------------------------------------------------------
# build-release.sh
# Genera el ENTORNO DE LIBERACIÓN (release) de Tinehnemi:
# un build web estático y reproducible, listo para pruebas y despliegue.
#
# Uso:
#   ./scripts/build-release.sh [directorio_salida]
#
# Variables de entorno opcionales:
#   NODE_ENV=production   (por defecto)
# ------------------------------------------------------------------
set -euo pipefail

OUTPUT_DIR="${1:-dist}"
export NODE_ENV="${NODE_ENV:-production}"

echo "==> [build-release] Instalando dependencias (npm ci)..."
npm ci

echo "==> [build-release] Generando export web estático (expo export)..."
npx expo export --platform web --output-dir "${OUTPUT_DIR}"

if [ ! -f "${OUTPUT_DIR}/index.html" ]; then
  echo "ERROR: no se generó ${OUTPUT_DIR}/index.html. El build de liberación falló." >&2
  exit 1
fi

# GitHub Pages no soporta enrutamiento del lado del cliente de forma nativa:
# servir index.html tambien como 404.html permite que expo-router (SPA)
# resuelva las rutas internas tras un refresh o enlace directo.
cp "${OUTPUT_DIR}/index.html" "${OUTPUT_DIR}/404.html"

echo "==> [build-release] Entorno de liberación generado en: ${OUTPUT_DIR}"
du -sh "${OUTPUT_DIR}"
