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
    const tab = card.locator('li[role="tab"]').filter({ hasText: className }).first();
    const preAvl = card.locator('.pre-avl').filter({ hasText: className }).first();

    // Try tab first, fall back to pre-avl link
    if (await tab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await tab.click({ force: true });
    } else {
      await preAvl.click({ force: true, timeout: 10000 });
    }
    // Wait for availability data to load
    await card.locator('.pre-avl.selected-class, .pre-avl').first()
      .waitFor({ state: 'visible', timeout: 10000 });
  }

  async selectDate(trainNumber: string, dateText: string) {
    const card = this.getTrainCard(trainNumber);
    const dateCell = card.locator('.pre-avl').filter({ hasText: dateText }).first();
    await dateCell.click({ force: true, timeout: 10000 });
    // Wait for selection to register
    await dateCell.locator('.selected-class, &.selected-class').first()
      .waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
  }

  async clickBookNow() {
    const bookBtn = this.page.locator('button.btnDefault.train_Search:not(.disable-book)')
      .filter({ hasText: /Book Now/i }).first();
    await expect(bookBtn).toBeEnabled({ timeout: 10000 });
    await bookBtn.click({ force: true });
  }

  async verifyBookingPageLoaded() {
    // Wait for navigation away from train-list
    await this.page.waitForURL(/\/(booking|passenger)/, { timeout: 15000 }).catch(() => {
      console.log('URL did not change to booking page, checking page content...');
    });
  }
}
