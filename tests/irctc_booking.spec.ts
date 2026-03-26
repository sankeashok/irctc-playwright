import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1920, height: 1080 } });

test('IRCTC Booking Automation Flow', async ({ page }) => {
  test.setTimeout(300000); // 5 minutes

  // Navigate to live IRCTC
  console.log('Navigating to IRCTC...');
  await page.goto('https://www.irctc.co.in/nget/train-search', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Click on LOGIN button
  console.log('Looking for LOGIN button...');
  const loginButton = page.locator('a').filter({ hasText: 'LOGIN' }).first();
  await loginButton.click({ force: true, timeout: 15000 }).catch(() => console.log('Wait for login button timeout'));

  // Fill Credentials
  console.log('Filling out credentials...');
  const userIdInput = page.getByPlaceholder('User Name').first();
  await userIdInput.fill('SANKEASHOK', { force: true, timeout: 5000 }).catch(() => console.log('Could not fill username'));
  
  const pwdInput = page.getByPlaceholder('Password').first();
  await pwdInput.fill('ThisisIRCTC56!$', { force: true, timeout: 5000 }).catch(() => console.log('Could not fill password'));
  
  console.log('----------------------------------------------------');
  console.log('PAUSED: Solve Captcha manually, click SIGN IN!');
  console.log('Then click RESUME/PLAY in Playwright Inspector!');
  console.log('----------------------------------------------------');
  await page.pause(); 
  
  // --- Step 2: Home Screen (Search) ---
  console.log('Resuming... Looking for From Station input...');
  const originInput = page.locator('p-autocomplete input').first();
  await originInput.fill('KGI', { force: true, timeout: 5000 }).catch(() => console.log('Origin fill failed'));
  await page.waitForTimeout(1000);
  await page.getByRole('listbox').getByText('KGI', { exact: false }).first().click({ force: true }).catch(() => {});
  
  console.log('Looking for To Station input...');
  const destInput = page.locator('p-autocomplete input').nth(1);
  await destInput.fill('TNGL', { force: true, timeout: 5000 }).catch(() => console.log('Destination fill failed'));
  await page.waitForTimeout(1000);
  await page.getByRole('listbox').getByText('TNGL', { exact: false }).first().click({ force: true }).catch(() => {});

  console.log('Filling in Date...');
  const dateInput = page.locator('p-calendar input').first();
  await dateInput.click({ force: true }).catch(() => {});
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await dateInput.pressSequentially('31/03/2026', { delay: 50 }).catch(() => {});
  // Use Tab to click out of the calendar and register the value into the Angular form
  await page.keyboard.press('Tab');
  await page.waitForTimeout(500);

  console.log('Selecting Class...');
  const classDropdown = page.locator('p-dropdown').first();
  await classDropdown.click({ force: true, timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);
  await page.getByRole('listbox').getByText('Sleeper (SL)', { exact: false }).first().click({ force: true }).catch(() => {});

  console.log('Selecting Quota...');
  const quotaDropdown = page.locator('p-dropdown').nth(1);
  await quotaDropdown.click({ force: true, timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(500);
  await page.getByRole('listbox').getByText('GENERAL', { exact: true }).first().click({ force: true }).catch(() => {});

  console.log('Clicking Search Train button...');
  await page.locator('button').filter({ hasText: 'Search' }).first().click({ force: true, timeout: 5000 }).catch(() => {});

  console.log('Waiting for Trains List page to load...');
  await page.waitForTimeout(5000);
  
  console.log('Scanning for HAMPI EXPRESS (16592)...');
  const trainCard = page.locator('div').filter({ hasText: /16592/ }).last();

  console.log('Selecting Sleeper (SL) quota on train card...');
  await trainCard.getByText('Sleeper (SL)', { exact: false }).first().click({ force: true, timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(2000);

  console.log('Clicking Book Now...');
  await trainCard.getByRole('button', { name: 'Book Now' }).first().click({ force: true, timeout: 5000 }).catch(() => {});

  console.log('Done! Pausing at the final page.');
  await page.pause();
});
