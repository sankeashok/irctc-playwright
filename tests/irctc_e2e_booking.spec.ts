import { test, TestInfo } from '@playwright/test';
import { allure } from 'allure-playwright';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { TrainListPage } from '../pages/TrainListPage';
import { BookingPage } from '../pages/BookingPage';
import { ReviewPage } from '../pages/ReviewPage';
import { PaymentPage } from '../pages/PaymentPage';
import testData from '../config/testdata.json';
import { TripData, Passenger } from '../config/types';

test.use({ viewport: null });

const trip: TripData = testData.trips.hampiExpress;
const passengers: Passenger[] = testData.passengers;

async function screenshot(page: import('@playwright/test').Page, testInfo: TestInfo, name: string) {
  const buffer = await page.screenshot({ fullPage: true });
  await testInfo.attach(name, { body: buffer, contentType: 'image/png' });
}

test(`E2E Booking: ${trip.trainName} (${trip.trainNumber}) ${trip.from} → ${trip.to}`, async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const trainListPage = new TrainListPage(page);
  const bookingPage = new BookingPage(page);
  const reviewPage = new ReviewPage(page);
  const paymentPage = new PaymentPage(page);

  allure.epic('IRCTC Train Booking');
  allure.feature('E2E Booking Flow');
  allure.story(`Book ${trip.trainName} (${trip.trainNumber}) ${trip.from} → ${trip.to}`);

  // --- Search ---
  await allure.step('Navigate to IRCTC', async () => {
    await loginPage.navigate();
    await screenshot(page, testInfo, 'After Navigation');
  });

  await allure.step(`Fill From Station (${trip.from})`, async () => {
    await searchPage.fillFromStation(trip.from);
    await screenshot(page, testInfo, 'After From Station');
  });

  await allure.step(`Fill To Station (${trip.to})`, async () => {
    await searchPage.fillToStation(trip.to);
    await screenshot(page, testInfo, 'After To Station');
  });

  await allure.step(`Fill Journey Date (${trip.date})`, async () => {
    await searchPage.fillDate(trip.date);
    await screenshot(page, testInfo, 'After Date');
  });

  await allure.step(`Select Class - ${trip.class}`, async () => {
    await searchPage.selectClass(trip.class);
    await screenshot(page, testInfo, 'After Class Selection');
  });

  await allure.step(`Select Quota - ${trip.quota}`, async () => {
    await searchPage.selectQuota(trip.quota);
    await screenshot(page, testInfo, 'After Quota Selection');
  });

  await allure.step('Click Search', async () => {
    await searchPage.clickSearch();
    await screenshot(page, testInfo, 'After Search Click');
  });

  // --- Train Selection ---
  await allure.step('Wait for Train Results', async () => {
    await trainListPage.waitForResults();
    await screenshot(page, testInfo, 'Train Results Loaded');
  });

  await allure.step(`Verify ${trip.trainName} (${trip.trainNumber}) is listed`, async () => {
    await trainListPage.verifyTrainVisible(trip.trainNumber);
    await screenshot(page, testInfo, 'Train Verified');
  });

  await allure.step(`Select ${trip.class} on ${trip.trainName}`, async () => {
    await trainListPage.selectClassTab(trip.trainNumber, trip.class);
    await screenshot(page, testInfo, 'After Class Tab Selection');
  });

  await allure.step(`Select date (${trip.dateLabel})`, async () => {
    await trainListPage.selectDate(trip.trainNumber, trip.dateLabel);
    await screenshot(page, testInfo, 'After Date Selection');
  });

  await allure.step('Click Book Now', async () => {
    await trainListPage.clickBookNow();
    await screenshot(page, testInfo, 'After Book Now');
  });

  // --- Login ---
  await allure.step('Login after Book Now', async () => {
    await loginPage.login();
    await screenshot(page, testInfo, 'After Login');
  });

  // --- Booking Form ---
  await allure.step('Wait for Booking Form', async () => {
    await bookingPage.waitForBookingForm();
    await screenshot(page, testInfo, 'Booking Form Loaded');
  });

  for (let i = 0; i < passengers.length; i++) {
    const p = passengers[i];
    await allure.step(`Add Passenger ${i + 1}: ${p.name} (${p.age}, ${p.gender})`, async () => {
      await bookingPage.addPassenger(p, i);
      await screenshot(page, testInfo, `After Passenger ${i + 1}`);
    });
  }

  await allure.step(`Fill Mobile Number (${testData.contact.mobile})`, async () => {
    await bookingPage.fillMobileNumber(testData.contact.mobile);
    await screenshot(page, testInfo, 'After Mobile Number');
  });

  await allure.step(`Select Payment Mode (${testData.payment.mode})`, async () => {
    await bookingPage.selectPaymentMode(testData.payment.mode);
    await screenshot(page, testInfo, 'After Payment Mode Selection');
  });

  await allure.step('Click Continue (Passenger Details)', async () => {
    await bookingPage.clickContinue();
    await screenshot(page, testInfo, 'After Continue');
  });

  // --- Review Journey (Step 2) ---
  await allure.step('Review Journey Page', async () => {
    await reviewPage.waitForReviewPage();
    await screenshot(page, testInfo, 'Review Journey Page');
  });

  await allure.step('Enter Captcha', async () => {
    await reviewPage.enterCaptcha();
    await screenshot(page, testInfo, 'After Captcha Entry');
  });

  await allure.step('Click Continue (Review Journey)', async () => {
    await reviewPage.clickContinue();
    await screenshot(page, testInfo, 'After Review Continue');
  });

  // --- Payment (Step 3) ---
  await allure.step('Payment Page', async () => {
    await paymentPage.waitForPaymentPage();
    await screenshot(page, testInfo, 'Payment Page');
  });

  await allure.step('Select BHIM/UPI/USSD', async () => {
    await paymentPage.selectBhimUpi();
    await screenshot(page, testInfo, 'After BHIM UPI Selection');
  });

  await allure.step('Click Pay & Book', async () => {
    await paymentPage.clickPayAndBook();
    await screenshot(page, testInfo, 'After Pay and Book');
  });

  await allure.step('Booking flow completed', async () => {
    await page.waitForTimeout(3000);
    await screenshot(page, testInfo, 'Final State');
    console.log('✅ E2E Booking flow completed successfully!');
  });

  // --- Cleanup ---
  await allure.step('Logout', async () => {
    await loginPage.logout();
    await screenshot(page, testInfo, 'After Logout');
  });
});
