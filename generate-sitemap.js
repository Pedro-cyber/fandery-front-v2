import { SitemapStream, streamToPromise } from 'sitemap'
import { createWriteStream, mkdirSync } from 'fs'
import { MongoClient } from 'mongodb'
import { resolve, dirname } from 'path'
import dotenv from 'dotenv'
dotenv.config()

const mongoUri = process.env.MONGO_URI
const hostname = process.env.BASE_URL

// Rutas estáticas
const staticRoutes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/product-list', changefreq: 'weekly', priority: 0.8 },
  { url: '/about-us', changefreq: 'monthly', priority: 0.5 },
  { url: '/ofertas', changefreq: 'daily', priority: 0.9 },
  { url: '/categorias', changefreq: 'weekly', priority: 0.7 },
  { url: '/promociones', changefreq: 'weekly', priority: 0.7 },
  { url: '/novedades', changefreq: 'weekly', priority: 0.8 }
]

// Función slugify
function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Recuperar productos de MongoDB
async function getDynamicRoutes() {
  const client = new MongoClient(mongoUri)
  try {
    await client.connect()
    const db = client.db('scraping')
    const collection = db.collection('productos_comparables')

    const productos = await collection.find(
      {},
      { projection: { legoId: 1, name: 1, name_es: 1 } }
    ).toArray()

    return productos.map(p => {
      const name = p.name_es || p.name
      const slug = slugify(name)
      return {
        url: `/sets/${slug}-${p.legoId}`,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: new Date().toISOString()
      }
    })
  } finally {
    await client.close()
  }
}

// Recuperar categorías únicas desde MongoDB
async function getCategoryRoutes() {
  const client = new MongoClient(mongoUri)
  try {
    await client.connect()
    const db = client.db('scraping')
    const collection = db.collection('productos_comparables')

    const themes = await collection.distinct("theme")

    return themes
      .filter(Boolean)
      .map(theme => ({
        url: `/product-list?theme=${encodeURIComponent(theme)}`,
        changefreq: 'weekly',
        priority: 0.7
      }))
  } catch (err) {
    console.error('❌ Error obteniendo categorías:', err)
    return []
  } finally {
    await client.close()
  }
}

// Generar sitemap
async function generateSitemap() {
  console.log('🚀 Generando sitemap...')

  const dynamicRoutes = await getDynamicRoutes()
  const categoryRoutes = await getCategoryRoutes()
  const allRoutes = [...staticRoutes, ...dynamicRoutes, ...categoryRoutes]

  const sitemapStream = new SitemapStream({ hostname })
  const writeStream = createWriteStream('./dist/fandery/sitemap.xml')
  sitemapStream.pipe(writeStream)

  allRoutes.forEach(route => sitemapStream.write(route))
  sitemapStream.end()

  const xmlData = await streamToPromise(sitemapStream)
  console.log('✅ Sitemap generado con éxito')
  console.log(`📄 Total de URLs: ${allRoutes.length}`)
}

generateSitemap()
