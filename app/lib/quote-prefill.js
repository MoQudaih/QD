import { catalogToLineItem } from './quote-catalog.js';

// Maps a projectSubmissions doc → initial quote draft data.
// Each field is best-effort: missing submission fields are simply skipped.
// All returned line items are removable; admin can also add custom lines.

const ARABIC_RE = /[؀-ۿ]/;

function getAnswer(submission, key) {
  if (!submission) return '';
  if (submission[key] !== undefined && submission[key] !== null && submission[key] !== '') return submission[key];
  const answers = submission.answers || {};
  return answers[key] ?? '';
}

function countNeededPages(rawPages) {
  if (!rawPages) return 0;
  if (Array.isArray(rawPages)) return rawPages.length;
  return String(rawPages).split(/[,·•/]| and /i).map((p) => p.trim()).filter(Boolean).length;
}

function pickSiteCatalogKey(pageCount) {
  if (pageCount <= 0) return null;
  if (pageCount <= 6) return 'site-5p';
  return 'site-10p';
}

function detectLanguage(submission) {
  if (submission?.pageLang === 'ar') return 'ar';
  const name = getAnswer(submission, 'businessName') || '';
  if (ARABIC_RE.test(name)) return 'ar';
  return 'en';
}

export function prefillFromSubmission(submission) {
  const lineItems = [];

  // 1. Website line item, sized by neededPages count
  const pageCount = countNeededPages(getAnswer(submission, 'neededPages'));
  const siteKey = pickSiteCatalogKey(pageCount);
  if (siteKey) lineItems.push(catalogToLineItem(siteKey));

  // 2. Required features → catalog matches
  const reqFeatures = submission.selectedRequiredFeatures || getAnswer(submission, 'requiredFeatures') || {};
  const featuresFlat = typeof reqFeatures === 'string'
    ? reqFeatures.toLowerCase()
    : (Array.isArray(reqFeatures) ? reqFeatures.join(' ').toLowerCase() : Object.keys(reqFeatures).join(' ').toLowerCase());

  if (featuresFlat.includes('online') && featuresFlat.includes('order')) lineItems.push(catalogToLineItem('online-ordering'));
  if (featuresFlat.includes('multi') && featuresFlat.includes('lang'))    lineItems.push(catalogToLineItem('multilang'));
  if (featuresFlat.includes('seo'))                                       lineItems.push(catalogToLineItem('seo-foundation'));

  // 3. Optional services → catalog matches
  const optServices = submission.selectedOptionalServices || getAnswer(submission, 'optionalServices') || {};
  const optFlat = typeof optServices === 'string'
    ? optServices.toLowerCase()
    : (Array.isArray(optServices) ? optServices.join(' ').toLowerCase() : Object.keys(optServices).join(' ').toLowerCase());
  if (optFlat.includes('maintenance')) lineItems.push(catalogToLineItem('maintenance-3m'));

  // 4. Logo design — if client said they DON'T have a logo
  if (getAnswer(submission, 'hasLogo') === false || getAnswer(submission, 'hasLogo') === 'no') {
    lineItems.push(catalogToLineItem('logo-design'));
  }

  // 5. Customer snapshot
  const customer = {
    businessName: getAnswer(submission, 'businessName') || '',
    email: getAnswer(submission, 'businessEmail') || '',
    phone: getAnswer(submission, 'businessPhone') || '',
  };

  // 6. Pages list (EN raw, AR blank for admin to fill)
  const rawPages = getAnswer(submission, 'neededPages');
  const pagesEn = Array.isArray(rawPages) ? rawPages.join(' · ') : String(rawPages || '');

  return {
    customer,
    lineItems: lineItems.filter(Boolean),
    pages: { en: pagesEn, ar: '' },
    language: detectLanguage(submission),
  };
}
