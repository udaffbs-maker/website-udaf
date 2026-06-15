import { createMediaHandler } from 'next-tinacms-cloudinary/dist/handlers.js';
import serverless from 'serverless-http';

const mediaHandler = createMediaHandler({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  authorized: async () => {
    return true;
  },
});

export const handler = serverless((req, res) => {
  // Set CORS headers to allow cross-origin requests from your GitHub Pages site
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Parse URL to extract path segments for next-tinacms-cloudinary (replaces Vercel/Next.js [math] route parser)
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const prefix = '/.netlify/functions/cloudinary';
  
  const query = {};
  for (const [key, value] of url.searchParams.entries()) {
    query[key] = value;
  }
  
  if (pathname.startsWith(prefix)) {
    const remaining = pathname.slice(prefix.length).replace(/^\//, '');
    if (remaining) {
      query.media = ['media', ...remaining.split('/')];
    } else {
      query.media = ['media'];
    }
  } else {
    query.media = ['media'];
  }
  
  req.query = query;

  return mediaHandler(req, res);
});
