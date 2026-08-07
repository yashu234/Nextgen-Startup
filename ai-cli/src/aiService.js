import { generateBranding } from './modules/brandingEngine.js';
import { generateBusinessPlan } from './modules/businessEngine.js';
import { generateLandingPage } from './modules/landingEngine.js';
import { generateLogo } from './modules/logoEngine.js';
import { generateMarketingStrategy } from './modules/marketingEngine.js';
import { callWithRetry, sleep } from './utils/rateLimiter.js';

export { generateBranding } from './modules/brandingEngine.js';
export { generateBusinessPlan } from './modules/businessEngine.js';
export { generateLandingPage } from './modules/landingEngine.js';
export { generateLogo } from './modules/logoEngine.js';
export { generateMarketingStrategy } from './modules/marketingEngine.js';

export async function generateStartupPackage(idea, options = {}) {
  const {
    branding = false,
    business = false,
    marketing = false,
    landing = false,
    logo = false,
    all = false,
  } = options;

  const result = {};

  // 1. Branding (Runs ONLY if selected, if 'all' is true, or if required by Landing/Logo)
  let brandingData = null;
  const needBranding = all || branding || landing || logo;

  if (needBranding) {
    console.log('📦 Stage 1: Generating Branding...');
    brandingData = await callWithRetry(() => generateBranding(idea));
    if (branding || all) {
      result.branding = brandingData;
    }
    await sleep(500);
  }

  // 2. Business Plan
  if (all || business) {
    console.log('📈 Stage 2: Generating Business Plan...');
    result.businessPlan = await callWithRetry(() => generateBusinessPlan(idea));
    await sleep(500);
  }

  // 3. Marketing Strategy
  if (all || marketing) {
    console.log('📣 Stage 3: Generating Marketing Strategy...');
    result.marketing = await callWithRetry(() => generateMarketingStrategy(idea));
    await sleep(500);
  }

  // 4. Logo Generation
  if (all || logo) {
    console.log('🎨 Stage 4: Generating Logo...');
    const logoPrompt = brandingData?.logoPrompt || `Minimalist logo for ${idea}`;
    result.logoUrl = await callWithRetry(() => generateLogo(logoPrompt, idea));
    await sleep(500);
  }

  // 5. Landing Page HTML
  if (all || landing) {
    console.log('💻 Stage 5: Generating Landing Page...');
    result.landingPageHtml = await callWithRetry(() => generateLandingPage(idea, brandingData || {}));
  }

  return result;
}