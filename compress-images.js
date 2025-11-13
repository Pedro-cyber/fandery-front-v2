const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'src/assets');
const outputDir = path.join(__dirname, 'src/assets-optimized');
const MAX_WIDTH = 1920; // ancho máximo para redimensionar

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function processDir(dir, outDir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    const outPath = path.join(outDir, file);

    if (stat.isDirectory()) {
      if (!fs.existsSync(outPath)) fs.mkdirSync(outPath);
      processDir(fullPath, outPath);
    } else if (/\.(jpe?g)$/i.test(file)) {
      // Comprimir y redimensionar JPG
      sharp(fullPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: 75, progressive: true })
        .toFile(outPath)
        .catch(err => console.error(err));

      // Generar WebP
      sharp(fullPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(outPath.replace(/\.(jpe?g)$/i, '.webp'))
        .catch(err => console.error(err));
    } else if (/\.png$/i.test(file)) {
      // Comprimir y redimensionar PNG
      sharp(fullPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(outPath)
        .catch(err => console.error(err));

      // Generar WebP
      sharp(fullPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(outPath.replace(/\.png$/i, '.webp'))
        .catch(err => console.error(err));
    } else {
      // Copiar otros archivos (SVG, GIF, etc)
      fs.copyFileSync(fullPath, outPath);
    }
  });
}

processDir(inputDir, outputDir);
console.log('✅ Todas las imágenes han sido comprimidas, redimensionadas y se han generado WebP en src/assets-optimized/');
