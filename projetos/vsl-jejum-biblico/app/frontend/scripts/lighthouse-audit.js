#!/usr/bin/env node

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urls = [
  'http://localhost:3000/',
  'http://localhost:3000/wizard',
  'http://localhost:3000/dashboard',
];

const options = {
  logLevel: 'info',
  output: 'json',
  port: 9222,
  emulatedFormFactor: 'mobile',
  throttling: {
    rttMs: 40,
    throughputKbps: 10 * 1024,
    cpuSlowdownMultiplier: 1,
    requestLatencyMs: 0,
    downloadThroughputKbps: 0,
    uploadThroughputKbps: 0,
  },
};

async function runLighthouse(url) {
  let chrome;
  try {
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    options.port = chrome.port;

    const runnerResult = await lighthouse(url, options);
    
    const scores = {
      url,
      timestamp: new Date().toISOString(),
      performance: runnerResult.lhr.categories.performance.score * 100,
      accessibility: runnerResult.lhr.categories.accessibility.score * 100,
      'best-practices': runnerResult.lhr.categories['best-practices'].score * 100,
      seo: runnerResult.lhr.categories.seo.score * 100,
      pwa: runnerResult.lhr.categories.pwa?.score * 100 || 0,
    };

    return scores;
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}

async function main() {
  console.log('🚀 Running Lighthouse audits...\n');
  
  const results = [];
  const reportDir = path.join(__dirname, 'lighthouse-reports');
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  for (const url of urls) {
    try {
      console.log(`📊 Auditing: ${url}`);
      const scores = await runLighthouse(url);
      results.push(scores);
      
      console.log(`   Performance:     ${scores.performance.toFixed(1)}`);
      console.log(`   Accessibility:   ${scores.accessibility.toFixed(1)}`);
      console.log(`   Best Practices:  ${scores['best-practices'].toFixed(1)}`);
      console.log(`   SEO:             ${scores.seo.toFixed(1)}\n`);
    } catch (error) {
      console.error(`❌ Error auditing ${url}:`, error.message);
    }
  }

  // Save results
  const reportPath = path.join(reportDir, `audit-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  
  // Print summary
  console.log('✅ Lighthouse audits complete!');
  console.log(`📄 Report saved to: ${reportPath}\n`);
  
  // Check if all scores meet targets
  const allGood = results.every(r => 
    r.performance >= 85 && 
    r.accessibility >= 85 && 
    r['best-practices'] >= 85 &&
    r.seo >= 85
  );
  
  if (allGood) {
    console.log('🎉 All performance targets met!');
    process.exit(0);
  } else {
    console.log('⚠️  Some scores below target (85). Review report for details.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
