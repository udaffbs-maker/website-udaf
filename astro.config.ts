import path from 'path';
import { fileURLToPath } from 'url';
import type { IncomingMessage, ServerResponse } from 'http';
import type { ViteDevServer } from 'vite';
import { loadEnv } from 'vite';
import { createMediaHandler } from 'next-tinacms-cloudinary/dist/handlers';

import { defineConfig } from 'astro/config';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;

const cloudinaryPlugin = () => ({
  name: 'cloudinary-proxy',
  configureServer(server: ViteDevServer) {
    const handler = createMediaHandler({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      authorized: async () => true,
    });

    server.middlewares.use(
      (req: IncomingMessage & { query?: Record<string, unknown> }, res: ServerResponse, next: () => void) => {
        if (req.url && req.url.startsWith('/api/cloudinary/media')) {
          const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
          const query: Record<string, unknown> = {};
          for (const [key, value] of url.searchParams.entries()) {
            query[key] = value;
          }

          const pathname = url.pathname;
          const prefix = '/api/cloudinary/media';
          if (pathname.startsWith(prefix)) {
            const remaining = pathname.slice(prefix.length).replace(/^\//, '');
            if (remaining) {
              query.media = ['media', ...remaining.split('/')];
            }
          }

          req.query = query;

          // Decorate response object to support Express-like helpers used by next-tinacms-cloudinary
          const decoratedRes = res as ServerResponse & {
            status: (code: number) => typeof decoratedRes;
            json: (data: unknown) => void;
          };

          decoratedRes.status = (code: number) => {
            decoratedRes.statusCode = code;
            return decoratedRes;
          };

          decoratedRes.json = (data: unknown) => {
            decoratedRes.setHeader('Content-Type', 'application/json');
            decoratedRes.end(JSON.stringify(data));
          };

          handler(req, decoratedRes);
        } else {
          next();
        }
      }
    );
  },
});

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import {
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
  imagePathFixerRehypePlugin,
} from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  site: 'https://theudaf.com',
  base: '/',
  output: 'static',

  integrations: [
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com', 'images.unsplash.com', 'plus.unsplash.com', 'res.cloudinary.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, imagePathFixerRehypePlugin],
  },

  vite: {
    plugins: [tailwindcss(), cloudinaryPlugin()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
