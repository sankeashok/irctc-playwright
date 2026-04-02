import { Page } from '@playwright/test';

export class ReviewPage {
  constructor(private page: Page) {}

  async waitForReviewPage() {
    // Wait for URL to change to reviewBooking
    await this.page.waitForURL(/reviewBooking/, { timeout: 60000 }).catch(() => {
      console.log('Review page URL not detected, checking content...');
    });
    // Wait for captcha to appear
    await this.page.locator('input#captcha').waitFor({ state: 'visible', timeout: 15000 });
  }

  async enterCaptcha() {
    // Wait for captcha image to fully load
    await this.page.locator('img.captcha-img').first().waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(500);

    console.log('----------------------------------------------------');
    console.log('CAPTCHA loaded. Enter captcha manually (15 seconds)');
    console.log('----------------------------------------------------');

    // Wait until user types something in captcha field (max 15s)
    await this.page.waitForFunction(
      () => {
        const input = document.querySelector('input#captcha') as HTMLInputElement;
        return input && input.value.length >= 3;
      },
      { timeout: 15000 }
    ).catch(() => {
      console.log('Captcha not entered, continuing anyway...');
    });
  }

  async clickContinue() {
    await this.page.locator('button.btnDefault.train_Search').filter({ hasText: /Continue/i }).first()
      .click({ force: true, timeout: 10000 });
  }
}
