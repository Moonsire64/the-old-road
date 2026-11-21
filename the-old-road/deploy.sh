#!/usr/bin/env bash
# Puts the current build into docs/, which GitHub Pages serves as the test site (main branch, /docs folder).
set -e
cd "$(dirname "$0")"
bash build.sh
cp dist/index.html site/* docs/
touch docs/.nojekyll
echo "docs/ ready"
