const { registerPlugin, log } = require('@scullyio/scully');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

// --- helper slugify ---
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD") // quita acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const dataPluginCategories = async (route, config) => {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db('scraping');
    const collection = db.collection('productos_comparables');

    const themes = await collection.distinct('theme');
    const validThemes = themes.filter(Boolean);

    log(`🧱 Encontradas ${validThemes.length} categorías para rutas dinámicas`);

    return validThemes.map(theme => {
      const slug = slugify(theme);
      return {
        route: `/product-list/theme/${slug}`
      };
    });
  } catch (err) {
    log(`❌ Error en dataPluginCategories: ${err.message}`);
    return [];
  } finally {
    await client.close();
  }
};

registerPlugin('router', 'dataCategories', dataPluginCategories);
