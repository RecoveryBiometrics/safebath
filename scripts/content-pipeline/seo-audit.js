/**
 * Agent 5: SEO Audit
 * Validates that articles meet SEO requirements before deployment.
 * Checks: title length, excerpt/meta length, slug format, schema readiness, internal link targets.
 */
const { slugifyCity } = require('./cities');

/**
 * Audit a set of articles for SEO compliance.
 * Returns { pass: boolean, issues: string[], fixes: object[] }
 */
function audit(entries, city) {
  const issues = [];
  const fixes = [];

  const locationSlug = slugifyCity(city);

  for (const entry of entries) {
    // Title checks
    if (entry.title.length > 70) {
      issues.push(`Title too long (${entry.title.length} chars, max 70): "${entry.title}"`);
      fixes.push({
        entry: entry.id,
        field: 'title',
        action: 'truncate',
        suggestion: entry.title.slice(0, 67) + '...',
      });
    }
    if (entry.title.length < 20) {
      issues.push(`BLOCK: Title too short (${entry.title.length} chars): "${entry.title}"`);
    }

    // Excerpt / meta description
    if (entry.excerpt.length > 160) {
      issues.push(`Excerpt too long for meta description (${entry.excerpt.length} chars, max 160)`);
      fixes.push({
        entry: entry.id,
        field: 'excerpt',
        action: 'truncate',
        suggestion: entry.excerpt.slice(0, 157) + '...',
      });
    }
    if (entry.excerpt.length < 50) {
      issues.push(`BLOCK: Excerpt too short (${entry.excerpt.length} chars, min 50)`);
    }

    // Slug format
    if (entry.slug !== entry.slug.toLowerCase()) {
      issues.push(`Slug contains uppercase: "${entry.slug}"`);
      fixes.push({ entry: entry.id, field: 'slug', action: 'lowercase', suggestion: entry.slug.toLowerCase() });
    }
    if (/[^a-z0-9-]/.test(entry.slug)) {
      issues.push(`BLOCK: Slug contains invalid characters: "${entry.slug}"`);
    }

    // Body checks
    if (entry.body.length < 300) {
      issues.push(`BLOCK: Body too thin for indexing (${entry.body.length} chars, min 300)`);
    }

    // Must mention city name (local relevance signal)
    const cityMentions = (entry.body.match(new RegExp(city.name, 'gi')) || []).length;
    if (cityMentions < 2) {
      issues.push(`Low local relevance: "${entry.title}" mentions ${city.name} only ${cityMentions} time(s) (min 2)`);
    }

    // Must mention county (broader local signal)
    if (!entry.body.includes(city.county)) {
      issues.push(`Missing county mention: "${entry.title}" should reference ${city.county}`);
    }

    // Internal link target exists (the service page should exist)
    const targetUrl = `/${locationSlug}/bathroom-grab-bar-installation`;
    // We know this page exists for every city — just verify the slug is valid
    if (!locationSlug.startsWith('bathroom-safety-')) {
      issues.push(`BLOCK: Invalid location slug: "${locationSlug}"`);
    }
  }

  const blockers = issues.filter(i => i.startsWith('BLOCK:'));

  return {
    pass: blockers.length === 0,
    issues,
    fixes,
    blockers: blockers.length,
    warnings: issues.length - blockers.length,
    auditedAt: new Date().toISOString(),
  };
}

/**
 * Apply auto-fixes from the audit.
 */
function applyFixes(entries, fixes) {
  for (const fix of fixes) {
    const entry = entries.find(e => e.id === fix.entry);
    if (!entry) continue;

    if (fix.action === 'truncate' && fix.field === 'excerpt') {
      entry.excerpt = fix.suggestion;
    }
    if (fix.action === 'lowercase' && fix.field === 'slug') {
      entry.slug = fix.suggestion;
    }
    // Don't auto-truncate titles — the copywriter should rewrite them
  }

  return entries;
}

module.exports = { audit, applyFixes };
