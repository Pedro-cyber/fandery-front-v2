// scully/plugins/dataPlugin.js
/* eslint-disable @typescript-eslint/no-var-requires */
const { registerPlugin } = require('@scullyio/scully');
const { MongoClient } = require('mongodb');
require('dotenv').config();

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function dataPlugin(route, config) {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('⚠️ MONGO_URI no está definido en el entorno.');
    return [];
  }

  const client = new MongoClient(mongoUri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db('scraping');
    const collection = db.collection('productos_comparables');

    const productos = await collection
      .find({}, { projection: { legoId: 1, name: 1, name_es: 1 } })
      .toArray();

    return productos.map(p => {
      const name = p.name_es || p.name || '';
      const slug = slugify(name);
      return { route: `/sets/${slug}-${p.legoId}` };
    });
  } catch (err) {
    console.error('❌ Error en el plugin dataPlugin:', err);
    return [];
  } finally {
    await client.close();
  }
}

// Registramos el plugin como tipo "data"
registerPlugin('router', 'data', dataPlugin);

module.exports = { dataPlugin };
