#!/usr/bin/env node
// Merges data/apps/*.json into src/BuiltWithMaui/wwwroot/data/apps.json.
// Validates each entry: required fields, URL formats, unique slugs.
// Exits non-zero when validation fails (used by CI).

import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const appsDir = path.join(root, 'data', 'apps');
const outFile = path.join(root, 'src', 'BuiltWithMaui', 'wwwroot', 'data', 'apps.json');

const VALID_PLATFORMS = new Set(['android', 'ios', 'windows', 'macos', 'website', 'github']);
const errors = [];
const apps = [];
const slugs = new Set();

const files = fs.readdirSync(appsDir).filter(f => f.endsWith('.json')).sort();

for (const file of files) {
  const filePath = path.join(appsDir, file);
  let entry;
  try {
    entry = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    errors.push(`${file}: invalid JSON — ${e.message}`);
    continue;
  }

  const baseSlug = file.replace(/\.json$/, '');
  if (!entry.name || typeof entry.name !== 'string') errors.push(`${file}: missing name`);
  if (!entry.description || typeof entry.description !== 'string') errors.push(`${file}: missing description`);
  if (!entry.slug || entry.slug !== baseSlug) errors.push(`${file}: slug "${entry.slug}" does not match filename "${baseSlug}"`);
  if (slugs.has(entry.slug)) errors.push(`${file}: duplicate slug "${entry.slug}"`);
  slugs.add(entry.slug);

  if (!Array.isArray(entry.links) || entry.links.length === 0) {
    errors.push(`${file}: must have at least one link`);
  } else {
    for (const link of entry.links) {
      if (!VALID_PLATFORMS.has(link.platform)) errors.push(`${file}: unknown platform "${link.platform}"`);
      if (!/^https?:\/\/.+/.test(link.url || '')) errors.push(`${file}: invalid link URL "${link.url}"`);
    }
  }
  if (entry.website && !/^https?:\/\/.+/.test(entry.website)) errors.push(`${file}: invalid website URL`);
  if (!Array.isArray(entry.tags)) entry.tags = [];

  apps.push(entry);
}

if (errors.length > 0) {
  console.error('❌ Data validation failed:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

apps.sort((a, b) => a.name.localeCompare(b.name));

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(apps, null, 2) + '\n');
console.log(`✅ Merged ${apps.length} apps → ${path.relative(root, outFile)}`);
