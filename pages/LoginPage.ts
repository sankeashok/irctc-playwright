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
    await this.page.locator('p-autocomplete input').first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async isLoggedIn(): Promise<boolean> {
    return this.welcomeText.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async login() {
    if (await this.isLoggedIn()) {
      console.log('Already logged in, skipping.');
      return;
    }

    const username = process.env.IRCTC_USERNAME;
    const password = process.env.IRCTC_PASSWORD;
    if (!username || !password) throw new Error('IRCTC_USERNAME and IRCTC_PASSWORD must be set in .env');

    // Wait for login dialog to appear (either from header click or post-Book-Now)
    const loginDialog = this.page.locator('app-login p-dialog .ui-dialog');
    await loginDialog.waitFor({ state: 'visible', timeout: 15000 });

    // Scope inputs to the login dialog to avoid conflicts with other elements
    const userInput = loginDialog.locator('input[placeholder="User Name"]').first();
    const pwdInput = loginDialog.locator('input[placeholder="Password"]').first();
    const signInBtn = loginDialog.locator('button').filter({ hasText: 'SIGN IN' }).first();

    await userInput.fill(username);
    await pwdInput.fill(password);
    await signInBtn.click({ force: true });

    // Wait for login to complete
    const timeout = parseInt(process.env.LOGIN_TIMEOUT || '120000');
    await this.welcomeText.waitFor({ state: 'visible', timeout });
    console.log('Login successful!');
  }

  async clickLoginLink() {
    await this.page.locator('a').filter({ hasText: 'LOGIN' }).first().click({ force: true, timeout: 15000 });
  }

  async logout() {
    // Direct navigation to logout URL — most reliable
    await this.page.goto('https://www.irctc.co.in/nget/logout', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await this.page.waitForTimeout(2000);
    console.log('Logged out successfully!');
  }

  async waitForManualLogin() {
    if (await this.isLoggedIn()) {
      console.log('Already logged in, skipping manual login.');
      return;
    }
    const timeout = parseInt(process.env.LOGIN_TIMEOUT || '120000');
    console.log('Log in manually. Waiting for login to complete...');
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
