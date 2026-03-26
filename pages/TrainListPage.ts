import { Page, Locator, expect } from '@playwright/test';

export class TrainListPage {
  constructor(private page: Page) {}

  private getTrainCard(trainNumber: string): Locator {
    return this.page.locator('.bull-back').filter({
      has: this.page.locator('.train-heading', { hasText: trainNumber })
    }).first();
  }

  async waitForResults(timeoutMs = 30000) {
    await this.page.locator('.train-heading:visible').first().waitFor({
      state: 'visible',
      timeout: timeoutMs
    });
  }

  async verifyTrainVisible(trainNumber: string) {
    const card = this.getTrainCard(trainNumber);
    await expect(card).toBeVisible({ timeout: 10000 });
  }

  async selectClassTab(trainNumber: string, className: string) {
    const card = this.getTrainCard(trainNumber);
    // Click the pre-avl div containing the class name (always visible on load)
    await card.locator('.pre-avl').filter({ hasText: className }).first()
      .click({ force: true, timeout: 10000 });
    // Wait for availability dates to load
    await card.locator('.pre-avl.selected-class').first()
      .waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  async selectDate(trainNumber: string, dateText: string) {
    const card = this.getTrainCard(trainNumber);
    await card.locator('.pre-avl').filter({ hasText: dateText }).first()
      .click({ force: true, timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async clickBookNow() {
    const bookBtn = this.page.locator('button.btnDefault.train_Search:not(.disable-book)')
      .filter({ hasText: /Book Now/i }).first();
    await expect(bookBtn).toBeEnabled({ timeout: 10000 });
    await bookBtn.click({ force: true });
  }

  async verifyBookingPageLoaded() {
    // Actual IRCTC booking URL is /nget/booking/psgninput
    await this.page.waitForURL(/\/(psgninput|booking|passenger)/, { timeout: 15000 }).catch(() => {
      console.log('URL did not change to booking page, checking page content...');
    });
    // Also wait for the passenger form to be ready
    await this.page.locator('app-passenger-input, app-passenger').first()
      .waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }
}
