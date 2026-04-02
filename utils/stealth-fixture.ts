import { test as base, Page, BrowserContext } from '@playwright/test';
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Add stealth plugin — patches navigator.webdriver, Chrome runtime, etc.
chromium.use(StealthPlugin());

type StealthFixtures = {
  stealthPage: Page;
  stealthContext: BrowserContext;
};

export const test = base.extend<StealthFixtures>({
  stealthContext: async ({}, use) => {
    const browser = await chromium.launch({
      channel: 'chrome',
      headless: false,
      args: ['--start-maximized'],
    });
    const context = await browser.newContext({ viewport: null });
    await use(context);
    await context.close();
    await browser.close();
  },

  stealthPage: async ({ stealthContext }, use) => {
    const page = await stealthContext.newPage();
    await use(page);
  },
});

export { expect } from '@playwright/test';
