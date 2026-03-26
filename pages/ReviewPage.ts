import { Page } from '@playwright/test';

export class ReviewPage {
  constructor(private page: Page) {}

  async waitForReviewPage() {
    await this.page.waitForURL(/reviewBooking/, { timeout: 15000 }).catch(() => {});
    await this.page.locator('app-review-booking, input#captcha').first()
      .waitFor({ state: 'visible', timeout: 10000 });
  }

  async enterCaptcha() {
    const captchaInput = this.page.locator('input#captcha');
    // Wait for captcha image to load
    await this.page.locator('img.captcha-img').first().waitFor({ state: 'visible', timeout: 5000 });

    // Allow user 30 seconds to manually enter captcha
    console.log('----------------------------------------------------');
    console.log('CAPTCHA detected. Enter captcha manually in browser.');
    console.log('You have 30 seconds...');
    console.log('----------------------------------------------------');
    // Wait for user to type something in the captcha field
    await this.page.waitForFunction(
      () => (document.querySelector('input#captcha') as HTMLInputElement)?.value?.length > 0,
      { timeout: 30000 }
    ).catch(() => {
      console.log('Captcha not entered within 30 seconds.');
    });
  }

  async clickContinue() {
    await this.page.locator('button.btnDefault.train_Search').filter({ hasText: /Continue/i }).first()
      .click({ force: true, timeout: 10000 });
  }
}
