#!/usr/bin/env node
// One-time seed script: parses the README.md app table and writes one
// data/apps/<slug>.json per app.
//
// Table row format:
// | **Name** | Description | Users | [icons/links...] |
// Links look like: [<img src="assets/ios.png"/>](https://...) — the icon
// filename determines the platform.

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf-8');
const outDir = path.join(root, 'data', 'apps');
fs.mkdirSync(outDir, { recursive: true });

const PLATFORM_BY_ICON = {
  'ios.png': 'ios',
  'android.png': 'android',
  'windows.png': 'windows',
  'website.png': 'website',
  'github.png': 'github',
};

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Extract the table rows between the header separator and the next section.
const tableMatch = readme.match(/\| App Name \|.*?\n\|[-\s|:]+\|\n([\s\S]*?)\n\s*##/);
if (!tableMatch) {
  console.error('Could not find app table in README.md');
  process.exit(1);
}

const rows = tableMatch[1].split('\n').filter(l => l.trim().startsWith('|'));
const today = new Date().toISOString().split('T')[0];
const usedSlugs = new Set();
let count = 0;

for (const row of rows) {
  const cells = row.split('|').slice(1).map(c => c.trim());
  if (cells.length < 3) continue;

  const name = cells[0].replace(/\*\*/g, '').trim();
  const description = cells[1].replace(/<br\s*\/?>/gi, ' ').trim();
  // Rows like `+1K |[<img...` have no space before the pipe, so a trailing
  // empty cell appears — join the tail cells back into the links cell.
  const users = cells[2].replace(/<br\s*\/?>/gi, ' ').trim();
  const linksCell = cells.slice(3).join(' | ');

  const links = [];
  // Match [<img src="assets/X.png"/>](url) and variants (quote styles, spacing)
  const simpleRe = /<img[^>]*src=["']?assets\/([\w.-]+?)["'\s/>][^>]*>\s*\]\((https?:[^)\s]+)\)/g;
  let m;
  while ((m = simpleRe.exec(linksCell)) !== null) {
    const icon = m[1];
    const url = m[2];
    const platform = PLATFORM_BY_ICON[icon] || 'website';
    links.push({ platform, url });
  }

  if (links.length === 0) {
    console.warn(`⚠️  No links parsed for: ${name}`);
  }

  let slug = slugify(name);
  if (usedSlugs.has(slug)) {
    let i = 2;
    while (usedSlugs.has(`${slug}-${i}`)) i++;
    slug = `${slug}-${i}`;
  }
  usedSlugs.add(slug);

  const entry = {
    name,
    slug,
    description,
    users,
    website: links.find(l => l.platform === 'website')?.url || '',
    links,
    tags: [],
    dateAdded: today,
    featured: false,
  };

  fs.writeFileSync(
    path.join(outDir, `${slug}.json`),
    JSON.stringify(entry, null, 2) + '\n'
  );
  count++;
}

console.log(`✅ Wrote ${count} app files to data/apps/`);
