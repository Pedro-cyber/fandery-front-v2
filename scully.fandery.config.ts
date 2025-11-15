import { ScullyConfig } from '@scullyio/scully';
import './scully/plugins/addCanonical';
import './scully/plugins/dataPlugin';
import './scully/plugins/dataPluginCategories';

export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'fandery',
  distFolder: './dist/fandery', // output directory of your Angular build artifacts
  outDir: './dist/static', // directory for scully build artifacts
  defaultPostRenderers: ['addCanonical'],
  maxRenderThreads: 4,
  routes: {
   '/sets/:slug': {
      type: 'data',
      waitForSelector: '.product-detail-container .product-detail-description',
    },
    '/product-list/theme/:theme': {
      type: 'dataCategories',
      waitForSelector: '.card',
    },
  }
};

