import { Page } from '@playwright/test';

export class PaymentPage {
  constructor(private page: Page) {}

  async waitForPaymentPage() {
    // iPay is on a different domain (irctcipay.com)
    await this.page.waitForURL(/irctcipay\.com|bkgPaymentOptions/, { timeout: 30000 }).catch(() => {});
    // Wait for payment tabs to load
    await this.page.locator('#paymentNavs, ul.paymentNavs').first()
      .waitFor({ state: 'visible', timeout: 15000 });
  }

  async selectUpiCcCl() {
    // Click the UPI (CC-CL) tab — 5th tab with id="upiLi"
    const upiTab = this.page.locator('li#upiLi');
    await upiTab.waitFor({ state: 'visible', timeout: 10000 });
    await upiTab.click({ force: true });
    // Wait for UPI section to become visible
    await this.page.locator('#upiCC').waitFor({ state: 'visible', timeout: 5000 });
  }

  async clickPayThroughQR() {
    // Click "Click here to pay through QR"
    const qrButton = this.page.locator('#PayByQrButton span');
    await qrButton.waitFor({ state: 'visible', timeout: 10000 });
    await qrButton.click({ force: true });
    // Wait for QR code to load and "Scan & Pay" text to appear
    await this.page.locator('#canPayTxt').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  async selectBhimUpi() {
    const bhimTab = this.page.locator('.bank-type').filter({ hasText: /BHIM.*UPI/i }).first();
    await bhimTab.click({ timeout: 5000 });
    await this.page.waitForTimeout(1000);
    const providerOption = this.page.locator('.bank-text').filter({ hasText: /BHIM.*PAYTM|Amazon Pay UPI/i }).first();
    await providerOption.click({ timeout: 5000 });
    await this.page.waitForTimeout(1000);
  }

  async clickPayAndBook() {
    const payBtn = this.page.locator('button.btn-primary.hidden-xs').filter({ hasText: /Pay.*Book/i }).first();
    await payBtn.scrollIntoViewIfNeeded();
    await payBtn.click({ timeout: 10000 });
  }
}
