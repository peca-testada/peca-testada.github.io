import type { APIRoute } from 'astro';
import { catalog } from '../config/catalog';
import { getAllProducts, parseProductId } from '../lib/catalog';

export const GET: APIRoute = async ({ site }) => {
  const base = site!.href.replace(/\/$/, '');
  const now = new Date().toISOString().slice(0, 10);
  const products = await getAllProducts();

  const urls: { loc: string; priority: string }[] = [];

  urls.push({ loc: `${base}/`, priority: '1.0' });

  for (const section of catalog) {
    urls.push({ loc: `${base}/${section.slug}/`, priority: '0.8' });
    for (const category of section.categories) {
      urls.push({ loc: `${base}/${section.slug}/${category.slug}/`, priority: '0.7' });
    }
  }

  for (const p of products) {
    const { section, category, product } = parseProductId(p.id);
    urls.push({ loc: `${base}/${section}/${category}/${product}/`, priority: '0.9' });
  }

  urls.push({ loc: `${base}/transparency/`, priority: '0.3' });
  urls.push({ loc: `${base}/community/`, priority: '0.3' });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
