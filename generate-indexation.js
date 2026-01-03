const fs = require('fs');
const path = require('path');

const filename = '4f6a71caac7eeb503d279f96cbbd277ce85d80608290eb28465f19036c6c2ce8.txt';
const content = '4f6a71caac7eeb503d279f96cbbd277ce85d80608290eb28465f19036c6c2ce8';

const outputDir = path.resolve(__dirname, './dist/fandery');
const outputPath = path.join(outputDir, filename);

// Crear carpeta si no existe
fs.mkdirSync(outputDir, { recursive: true });

// Escribir archivo
fs.writeFileSync(outputPath, content, 'utf8');

