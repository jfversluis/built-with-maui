'use strict';

// Shared parser for app-submission GitHub issue forms.
// Used by .github/workflows/triage-app.yml and approve-app.yml
// (via `require` inside actions/github-script).

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Field key -> rendered issue-form label.
const FIELD_LABELS = {
  name: 'App Name',
  description: 'Description',
  users: 'Estimated Users / Downloads',
  website: 'Website URL',
  ios_url: 'App Store (iOS / macOS) URL',
  android_url: 'Google Play URL',
  windows_url: 'Microsoft Store URL',
  github_url: 'GitHub Repository URL (if open source)',
  tags: 'Tags (comma-separated)',
};

const FIELD_LABEL_ALIASES = {
  github_url: ['GitHub Repository URL'],
  tags: ['Tags'],
};

function labelsForKey(key) {
  return [FIELD_LABELS[key], ...(FIELD_LABEL_ALIASES[key] || [])];
}

// GitHub renders each form field as `### <label>` followed by the user's value.
function getField(body, label) {
  const text = body || '';
  const fieldKey = Object.keys(FIELD_LABELS).find((key) => labelsForKey(key).includes(label));
  const startLabels = fieldKey ? labelsForKey(fieldKey) : [label];
  const startRegex = new RegExp(`^### (?:${startLabels.map(escapeRegExp).join('|')})\\s*$\\n?`, 'm');
  const startMatch = text.match(startRegex);
  if (!startMatch || startMatch.index === undefined) return '';

  const rest = text.slice(startMatch.index + startMatch[0].length);
  const nextLabels = Object.keys(FIELD_LABELS)
    .filter((key) => key !== fieldKey)
    .flatMap(labelsForKey)
    .map(escapeRegExp)
    .concat('Checklist');
  const nextRegex = new RegExp(`^### (?:${nextLabels.join('|')})\\s*$`, 'm');
  const nextMatch = rest.match(nextRegex);
  const value = nextMatch && nextMatch.index !== undefined ? rest.slice(0, nextMatch.index) : rest;
  const cleaned = value.trim();
  return cleaned === '_No response_' ? '' : cleaned;
}

function parseAppSubmission(body) {
  const result = {};
  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    result[key] = getField(body, label);
  }
  return result;
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function isValidUrl(value) {
  return /^https?:\/\/.+/.test(String(value || '').trim());
}

module.exports = {
  getField,
  parseAppSubmission,
  slugify,
  isValidUrl,
  FIELD_LABELS,
};
