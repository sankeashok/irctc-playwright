import { test } from '@playwright/test';
import { allure } from 'allure-playwright';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { TrainListPage } from '../pages/TrainListPage';
import testData from '../config/testdata.json';
import { TripData } from '../config/types';

test.use({ viewport: null });

const trip: TripData = testData.trips.hampiExpress;

async function screenshot(page: import('@playwright/test').Page, name: string) {
  const buffer = await page.screenshot();
  allure.attachment(name, buffer, 'image/png');
}

test(`E2E Guest Search + Login at Booking: ${trip.trainName} (${trip.trainNumber}) ${trip.from} → ${trip.to}`, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const trainListPage = new TrainListPage(page);

  allure.epic('IRCTC Train Booking');
  allure.feature('Guest Search + Login at Booking');
  allure.story(`Book ${trip.trainName} (${trip.trainNumber}) ${trip.from} → ${trip.to}`);

  await allure.step('Navigate to IRCTC', async () => {
    await loginPage.navigate();
    await screenshot(page, 'After Navigation');
  });

  await allure.step(`Fill From Station (${trip.from})`, async () => {
    await searchPage.fillFromStation(trip.from);
    await screenshot(page, 'After From Station');
  });

  await allure.step(`Fill To Station (${trip.to})`, async () => {
    await searchPage.fillToStation(trip.to);
    await screenshot(page, 'After To Station');
  });

  await allure.step(`Fill Journey Date (${trip.date})`, async () => {
    await searchPage.fillDate(trip.date);
    await screenshot(page, 'After Date');
  });

  await allure.step(`Select Class - ${trip.class}`, async () => {
    await searchPage.selectClass(trip.class);
    await screenshot(page, 'After Class Selection');
  });

  await allure.step(`Select Quota - ${trip.quota}`, async () => {
    await searchPage.selectQuota(trip.quota);
    await screenshot(page, 'After Quota Selection');
  });

  await allure.step('Click Search', async () => {
    await searchPage.clickSearch();
    await screenshot(page, 'After Search Click');
  });

  await allure.step('Wait for Train Results', async () => {
    await trainListPage.waitForResults();
    await screenshot(page, 'Train Results Loaded');
  });

  await allure.step(`Verify ${trip.trainName} (${trip.trainNumber}) is listed`, async () => {
    await trainListPage.verifyTrainVisible(trip.trainNumber);
    await screenshot(page, 'Train Verified');
  });

  await allure.step(`Select ${trip.class} on ${trip.trainName}`, async () => {
    await trainListPage.selectClassTab(trip.trainNumber, trip.class);
    await screenshot(page, 'After Class Tab Selection');
  });

  await allure.step(`Select date (${trip.dateLabel})`, async () => {
    await trainListPage.selectDate(trip.trainNumber, trip.dateLabel);
    await screenshot(page, 'After Date Selection');
  });

  await allure.step('Click Book Now', async () => {
    await trainListPage.clickBookNow();
    await screenshot(page, 'After Book Now');
  });

  // await allure.step('Login after Book Now', async () => {
  //   await loginPage.waitForManualLogin();
  //   await loginPage.saveSession();
  //   await screenshot(page, 'After Login');
  // });

  await allure.step('Verify booking page loaded', async () => {
    await trainListPage.verifyBookingPageLoaded();
    await screenshot(page, 'Booking Page');
    console.log('✅ E2E Guest Search + Login at Booking completed successfully!');
  });
});
