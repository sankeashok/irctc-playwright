import { Page } from '@playwright/test';
import { Passenger } from '../config/types';

export class BookingPage {
  constructor(private page: Page) {}

  async waitForBookingForm() {
    await this.page.locator('app-passenger-input').first()
      .waitFor({ state: 'visible', timeout: 15000 });
  }

  async addPassenger(passenger: Passenger, index: number) {
    if (index > 0) {
      await this.page.locator('span.prenext').filter({ hasText: '+ Add Passenger' }).first()
        .click({ force: true, timeout: 5000 });
      await this.page.waitForTimeout(500);
    }

    // Name — p-autocomplete input with placeholder="Name"
    const nameInput = this.page.locator('app-passenger input[placeholder="Name"]').nth(index);
    await nameInput.fill(passenger.name, { timeout: 5000 });

    // Age — input with placeholder="Age"
    const ageInput = this.page.locator('app-passenger input[placeholder="Age"]').nth(index);
    await ageInput.fill(passenger.age, { timeout: 5000 });

    // Gender — native <select> with formcontrolname="passengerGender"
    const genderSelect = this.page.locator('select[formcontrolname="passengerGender"]').nth(index);
    const genderValue = passenger.gender === 'Male' ? 'M' : passenger.gender === 'Female' ? 'F' : 'T';
    await genderSelect.selectOption(genderValue);
  }

  async fillMobileNumber(mobile: string) {
    const mobileInput = this.page.locator('input#mobileNumber');
    await mobileInput.fill(mobile, { timeout: 5000 });
  }

  async selectPaymentMode(mode: string) {
    if (mode === 'BHIM/UPI') {
      // PrimeNG hides the actual <input>, the clickable element is div.ui-radiobutton-box
      // Find the radio button row containing "BHIM/UPI" text, then click its radiobutton-box
      const bhimRow = this.page.locator('tr').filter({ hasText: /BHIM\/UPI/ }).first();
      await bhimRow.scrollIntoViewIfNeeded();
      await bhimRow.locator('.ui-radiobutton-box').first().click({ timeout: 5000 });
      await this.page.waitForTimeout(1000);
    }
  }

  async clickContinue() {
    const continueBtn = this.page.locator('button.train_Search.btnDefault').filter({ hasText: /Continue/i }).first();
    await continueBtn.scrollIntoViewIfNeeded();
    await continueBtn.click({ force: true, timeout: 10000 });
  }
}
