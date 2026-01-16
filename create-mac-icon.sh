#!/bin/bash

# Script pour créer l'icône macOS depuis logo_app.png
# Assurez-vous que ImageMagick (convert) ou sips est installé

INPUT_FILE="logo_app.png"
OUTPUT_FILE="logo_app.icns"

if [ ! -f "$INPUT_FILE" ]; then
  echo "Erreur: $INPUT_FILE non trouvé"
  exit 1
fi

# Créer le dossier temporaire pour les icônes
mkdir -p logo_app.iconset

# Créer les différentes tailles avec sips (natif macOS)
sips -z 16 16     "$INPUT_FILE" --out logo_app.iconset/icon_16x16.png
sips -z 32 32     "$INPUT_FILE" --out logo_app.iconset/icon_16x16@2x.png
sips -z 32 32     "$INPUT_FILE" --out logo_app.iconset/icon_32x32.png
sips -z 64 64     "$INPUT_FILE" --out logo_app.iconset/icon_32x32@2x.png
sips -z 128 128   "$INPUT_FILE" --out logo_app.iconset/icon_128x128.png
sips -z 256 256   "$INPUT_FILE" --out logo_app.iconset/icon_128x128@2x.png
sips -z 256 256   "$INPUT_FILE" --out logo_app.iconset/icon_256x256.png
sips -z 512 512   "$INPUT_FILE" --out logo_app.iconset/icon_256x256@2x.png
sips -z 512 512   "$INPUT_FILE" --out logo_app.iconset/icon_512x512.png
cp "$INPUT_FILE" logo_app.iconset/icon_512x512@2x.png

# Convertir iconset en icns
iconutil -c icns logo_app.iconset -o "$OUTPUT_FILE"

# Nettoyer
rm -rf logo_app.iconset

echo "✅ Icône créée: $OUTPUT_FILE"
