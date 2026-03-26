import { Page } from '@playwright/test';

export class PaymentPage {
  constructor(private page: Page) {}

  async waitForPaymentPage() {
    await this.page.waitForURL(/bkgPaymentOptions/, { timeout: 15000 }).catch(() => {});
    await this.page.locator('app-payment-options, #pay-type').first()
      .waitFor({ state: 'visible', timeout: 10000 });
  }

  async selectBhimUpi() {
    // Click the BHIM/ UPI/ USSD tab in the left payment type panel
    const bhimTab = this.page.locator('.bank-type').filter({ hasText: /BHIM.*UPI.*USSD/i }).first();
    await bhimTab.click({ timeout: 5000 });
    await this.page.waitForTimeout(1000);
  }

  async clickPayAndBook() {
    // Desktop "Pay & Book" button
    const payBtn = this.page.locator('button.btn-primary.hidden-xs').filter({ hasText: /Pay.*Book/i }).first();
    await payBtn.scrollIntoViewIfNeeded();
    await payBtn.click({ timeout: 10000 });
  }
}
