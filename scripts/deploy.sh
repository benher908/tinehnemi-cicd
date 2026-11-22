#!/usr/bin/env bash
# ------------------------------------------------------------------
# deploy.sh
# GENERACIÓN DEL DESPLIEGUE: publica el artefacto de liberación
# (ya construido y probado) en GitHub Pages, usando la rama gh-pages
# como entorno de despliegue.
#
# Puede ejecutarse tanto en GitHub Actions como localmente (requiere
# permisos de escritura sobre el remoto "origin").
#
# Uso:
#   ./scripts/deploy.sh [directorio_build] [rama_destino]
#
# Variables de entorno opcionales:
#   GIT_USER_NAME, GIT_USER_EMAIL  -> identidad del commit de despliegue
# ------------------------------------------------------------------
set -euo pipefail

BUILD_DIR="${1:-dist}"
DEPLOY_BRANCH="${2:-gh-pages}"
GIT_USER_NAME="${GIT_USER_NAME:-tinehnemi-ci-bot}"
GIT_USER_EMAIL="${GIT_USER_EMAIL:-ci@tinehnemi.local}"

if [ ! -d "${BUILD_DIR}" ]; then
  echo "ERROR: no existe el directorio de build '${BUILD_DIR}'. Ejecuta build-release.sh primero." >&2
  exit 1
fi

echo "==> [deploy] Publicando '${BUILD_DIR}' en la rama '${DEPLOY_BRANCH}'..."

WORKTREE_DIR="$(mktemp -d)"
trap 'rm -rf "${WORKTREE_DIR}"' EXIT

REMOTE_URL="$(git config --get remote.origin.url)"

# Si la rama de despliegue ya existe remotamente, la usamos como base;
# si no, creamos una rama huérfana (historial propio del entorno de despliegue).
if git ls-remote --exit-code --heads origin "${DEPLOY_BRANCH}" >/dev/null 2>&1; then
  git worktree add --detach "${WORKTREE_DIR}" "origin/${DEPLOY_BRANCH}"
  (cd "${WORKTREE_DIR}" && git checkout -B "${DEPLOY_BRANCH}")
else
  git worktree add --detach "${WORKTREE_DIR}" main 2>/dev/null || git worktree add --detach "${WORKTREE_DIR}" HEAD
  (cd "${WORKTREE_DIR}" && git checkout --orphan "${DEPLOY_BRANCH}" && git rm -rf . >/dev/null 2>&1 || true)
fi

# Limpiar el worktree y copiar el nuevo artefacto
find "${WORKTREE_DIR}" -mindepth 1 -maxdepth 1 ! -name ".git" -exec rm -rf {} +
cp -r "${BUILD_DIR}/." "${WORKTREE_DIR}/"
touch "${WORKTREE_DIR}/.nojekyll"   # evita que GitHub Pages ignore carpetas que empiezan con "_"

cd "${WORKTREE_DIR}"
git config user.name "${GIT_USER_NAME}"
git config user.email "${GIT_USER_EMAIL}"
git add -A

if git diff --cached --quiet; then
  echo "==> [deploy] Sin cambios respecto al despliegue anterior; nada que publicar."
else
  git commit -q -m "deploy: publicar release $(date -u +'%Y-%m-%dT%H:%M:%SZ') [skip ci]"
  git push "${REMOTE_URL}" "HEAD:${DEPLOY_BRANCH}" --force
  echo "==> [deploy] Despliegue publicado en la rama '${DEPLOY_BRANCH}'."
fi

cd - >/dev/null
git worktree remove --force "${WORKTREE_DIR}" 2>/dev/null || true
