# Script pour installer les dépendances macOS requises sur Windows
# À exécuter sur macOS lors du build

Write-Host "⚠️  Configuration macOS détectée" -ForegroundColor Yellow
Write-Host ""
Write-Host "Pour créer l'icône macOS (.icns) depuis logo_app.png sur macOS:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Copier votre logo_app.png dans le dossier electron/"
Write-Host ""
Write-Host "2. Sur macOS, exécuter:"
Write-Host "   chmod +x create-mac-icon.sh"
Write-Host "   ./create-mac-icon.sh"
Write-Host ""
Write-Host "3. Cela créera automatiquement logo_app.icns"
Write-Host ""
Write-Host "ALTERNATIVE (si ImageMagick est installé):" -ForegroundColor Green
Write-Host "   convert logo_app.png -define icon:auto-resize=256,128,96,64,48,32,16 logo_app.icns"
Write-Host ""
Write-Host "ALTERNATIVE (avec npm packages):" -ForegroundColor Green
Write-Host "   npm install --save-dev electron-icon-builder"
Write-Host "   npx electron-icon-builder --input=logo_app.png --output=. --flatten"
Write-Host ""
Write-Host "Configuration complète pour macOS:" -ForegroundColor Cyan
Write-Host "✅ entitlements.mac.plist créé"
Write-Host "✅ package.json configuré pour DMG + ZIP"
Write-Host "✅ Support ARM64 et x64"
Write-Host ""
