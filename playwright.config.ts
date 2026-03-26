import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 300000,
  expect: { timeout: 10000 },
  retries: 0,
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    baseURL: process.env.BASE_URL,
    viewport: null,
    launchOptions: {
      channel: 'chrome',
      args: ['--start-maximized']
    },
    screenshot: 'on',
    trace: 'on',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  }
});
