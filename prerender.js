const { execSync } = require('child_process');

const partial = process.env.PARTIAL_BUILD === 'true';

if (partial) {
  console.log('🚀 Generando solo la Home...');
  execSync('npx scully --routeFilter ^/$', { stdio: 'inherit' });
} else {
  console.log('🔁 Generando TODAS las rutas...');
  execSync('npx scully', { stdio: 'inherit' });
}
