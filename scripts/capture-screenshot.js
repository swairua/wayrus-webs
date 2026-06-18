#!/usr/bin/env node

/**
 * Screenshot capture script using Puppeteer
 * Usage: node scripts/capture-screenshot.js <url> <outputPath>
 *
 * Environment variables (optional):
 * - PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true (if using system Chromium)
 */

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function captureScreenshot(websiteUrl, outputPath) {
  let browser;
  try {
    // Launch browser with hardcoded options
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    const page = await browser.newPage();
    
    // Set viewport size (1024x768 to match URLBox defaults)
    await page.setViewport({
      width: 1024,
      height: 768,
      deviceScaleFactor: 1,
    });

    // Set timeout for navigation
    await page.goto(websiteUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Wait a bit for any lazy-loaded content
    await page.waitForTimeout(1000);

    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Take screenshot
    await page.screenshot({
      path: outputPath,
      type: 'jpeg',
      quality: 80,
    });

    console.log(JSON.stringify({
      status: 'success',
      message: 'Screenshot captured successfully',
      path: outputPath,
      url: websiteUrl,
    }));

    process.exit(0);
  } catch (error) {
    console.error(JSON.stringify({
      status: 'error',
      message: error.message,
      url: websiteUrl,
      stack: error.stack,
    }));

    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error(JSON.stringify({
    status: 'error',
    message: 'Usage: node capture-screenshot.js <url> <outputPath>',
  }));
  process.exit(1);
}

const [websiteUrl, outputPath] = args;

// Validate URL
if (!websiteUrl.match(/^https?:\/\//)) {
  console.error(JSON.stringify({
    status: 'error',
    message: 'Invalid URL. Must start with http:// or https://',
  }));
  process.exit(1);
}

captureScreenshot(websiteUrl, outputPath);
