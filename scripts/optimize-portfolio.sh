#!/usr/bin/env bash
# Genera versiones web (WebP) de las fotos originales del portafolio.
# Originales: src/assets/img/portafolio/<Categoría>/*.jpg (no se suben al repo)
# Salida:     public/portafolio/<categoria>/<foto>-thumb.webp  (grilla)
#             public/portafolio/<categoria>/<foto>.webp        (visor)
# Requiere cwebp (brew install webp).
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=src/assets/img/portafolio
OUT=public/portafolio

slug() {
  python3 -c 'import re,sys,unicodedata as u; s=u.normalize("NFKD",sys.argv[1]).encode("ascii","ignore").decode().lower(); print(re.sub(r"[^a-z0-9]+","-",s).strip("-"))' "$1"
}

find "$SRC" -type f -iname '*.jpg' | while read -r f; do
  cat=$(slug "$(basename "$(dirname "$f")")")
  name=$(slug "$(basename "${f%.*}")")
  mkdir -p "$OUT/$cat"
  # Las panorámicas conservan más resolución para apreciar los rostros
  if [ "$cat" = panoramicas ]; then full=4000; thumb=1600; else full=2400; thumb=1200; fi
  [ -f "$OUT/$cat/$name.webp" ] || cwebp -quiet -q 80 -metadata none -resize "$full" 0 "$f" -o "$OUT/$cat/$name.webp"
  [ -f "$OUT/$cat/$name-thumb.webp" ] || cwebp -quiet -q 72 -metadata none -resize "$thumb" 0 "$f" -o "$OUT/$cat/$name-thumb.webp"
  echo "$cat/$name"
done
