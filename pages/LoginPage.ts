import { Page, Locator } from '@playwright/test';
import path from 'path';

const AUTH_FILE = path.join(process.cwd(), 'auth', 'storageState.json');

export class LoginPage {
  private welcomeText: Locator;

  constructor(private page: Page) {
    this.welcomeText = page.locator('text=Welcome').first();
  }

  async navigate() {
    const url = process.env.BASE_URL || 'https://www.irctc.co.in/nget/train-search';
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    // Wait for the search form to be ready
    await this.page.locator('p-autocomplete input').first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async isLoggedIn(): Promise<boolean> {
    return this.welcomeText.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async waitForManualLogin() {
    if (await this.isLoggedIn()) {
      console.log('Already logged in, skipping manual login.');
      return;
    }
    const timeout = parseInt(process.env.LOGIN_TIMEOUT || '120000');
    console.log('----------------------------------------------------');
    console.log('Log in manually (solve captcha + sign in).');
    console.log('Waiting for login to complete...');
    console.log('----------------------------------------------------');
    await this.welcomeText.waitFor({ state: 'visible', timeout });
    console.log('Login detected!');
  }

  async saveSession() {
    await this.page.context().storageState({ path: AUTH_FILE });
    console.log(`Session saved to ${AUTH_FILE}`);
  }

  static getAuthFile(): string {
    return AUTH_FILE;
  }
}
