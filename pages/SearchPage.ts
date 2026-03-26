import { Page, Locator } from '@playwright/test';
import { retry } from '../utils/retry';

export class SearchPage {
  private originInput: Locator;
  private destInput: Locator;
  private dateInput: Locator;
  private classDropdown: Locator;
  private quotaDropdown: Locator;
  private searchButton: Locator;

  constructor(private page: Page) {
    this.originInput = page.locator('p-autocomplete input').first();
    this.destInput = page.locator('p-autocomplete input').nth(1);
    this.dateInput = page.locator('p-calendar input').first();
    this.classDropdown = page.locator('p-dropdown').first();
    this.quotaDropdown = page.locator('p-dropdown').nth(1);
    this.searchButton = page.locator('button.search_btn.train_Search').first();
  }

  private async selectAutocomplete(input: Locator, code: string) {
    await retry(async () => {
      await input.fill(code, { force: true, timeout: 5000 });
      // Target only the <ul> autocomplete list, not <input role="listbox"> from dropdowns
      const list = this.page.locator('ul.ui-autocomplete-list');
      await list.waitFor({ state: 'visible', timeout: 3000 });
      await list.locator('li').filter({ hasText: code }).first().click({ force: true });
    }, { retries: 3, label: `Autocomplete ${code}` });
  }

  async fillFromStation(code: string) {
    await this.selectAutocomplete(this.originInput, code);
  }

  async fillToStation(code: string) {
    await this.selectAutocomplete(this.destInput, code);
  }

  async fillDate(date: string) {
    await this.dateInput.click({ force: true });
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.dateInput.pressSequentially(date, { delay: 50 });
    await this.page.keyboard.press('Tab');
    await this.page.locator('.ui-datepicker:visible').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  }

  async selectClass(className: string) {
    await retry(async () => {
      await this.classDropdown.click({ force: true, timeout: 5000 });
      // p-dropdown renders its list as <ul> inside the dropdown panel
      const list = this.page.locator('ul.ui-dropdown-items:visible');
      await list.waitFor({ state: 'visible', timeout: 3000 });
      await list.locator('li').filter({ hasText: className }).first().click({ force: true });
    }, { retries: 3, label: `Class ${className}` });
  }

  async selectQuota(quota: string) {
    await retry(async () => {
      await this.quotaDropdown.click({ force: true, timeout: 5000 });
      const list = this.page.locator('ul.ui-dropdown-items:visible');
      await list.waitFor({ state: 'visible', timeout: 3000 });
      await list.locator('li').filter({ hasText: quota }).first().click({ force: true });
    }, { retries: 3, label: `Quota ${quota}` });
  }

  async clickSearch() {
    await this.page.keyboard.press('Escape');
    await this.searchButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.searchButton.click({ force: true, timeout: 10000 });
  }
}
