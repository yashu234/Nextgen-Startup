import 'dotenv/config';
import readline from 'readline';
import { generateStartupPackage } from './aiService.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('\n--- 🚀 AI ENGINE ---');

  // 1. Get custom input from user
  const userInput = await askQuestion('\n👉 Type your input/topic (e.g., food, fitness app, SaaS tool): ');
  
  if (!userInput.trim()) {
    console.log('❌ No input provided. Exiting...');
    rl.close();
    return;
  }

  // 2. Choose output module
  console.log(`\nYour Input: "${userInput.trim()}"\n`);
  console.log('Select output type:');
  console.log('1. Branding');
  console.log('2. Business Plan');
  console.log('3. Marketing Strategy');
  console.log('4. Logo Image');
  console.log('5. Landing Page HTML');
  console.log('6. FULL PACKAGE');
  console.log('0. Exit\n');

  const choice = (await askQuestion('Enter your choice (0-6): ')).trim();
  rl.close();

  if (choice === '0') {
    console.log('Exiting...');
    return;
  }

  const options = {
    branding: choice === '1',
    business: choice === '2',
    marketing: choice === '3',
    logo: choice === '4',
    landing: choice === '5',
    all: choice === '6',
  };

  console.log('\n⏳ Processing input with AI...\n');
  const startTime = Date.now();

  try {
    const output = await generateStartupPackage(userInput.trim(), options);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n✅ Done in ${duration}s!\n`);
    console.log('----------------------------------------------------');

    if (output.branding) {
      console.log('📌 BRANDING');
      console.log('Tagline:', output.branding.tagline);
      console.log('Mission:', output.branding.missionStatement);
    }

    if (output.businessPlan) {
      console.log('\n📈 BUSINESS PLAN');
      const bp = output.businessPlan;
      console.log('Overview:', bp.summary || bp.overview || JSON.stringify(bp, null, 2));
    }

    if (output.marketing) {
      console.log('\n📣 MARKETING STRATEGY');
      console.log('Target Audience:', output.marketing.strategy?.targetAudience || output.marketing);
    }

    if (output.logoUrl) {
      console.log('\n🎨 LOGO');
      console.log('Output:', output.logoUrl.startsWith('data:') ? 'Generated Base64 String' : output.logoUrl);
    }

    if (output.landingPageHtml) {
      console.log('\n💻 LANDING PAGE');
      console.log('HTML Length:', output.landingPageHtml.length, 'characters');
    }

    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Generation Failed:', error);
  }
}

main();