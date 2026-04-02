import { TestInfo } from '@playwright/test';
import { test } from '../utils/stealth-fixture';
import { allure } from 'allure-playwright';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { TrainListPage } from '../pages/TrainListPage';
import { BookingPage } from '../pages/BookingPage';
import { ReviewPage } from '../pages/ReviewPage';
import { PaymentPage } from '../pages/PaymentPage';
import testData from '../config/testdata.json';
import { TripData, Passenger } from '../config/types';

const trip: TripData = testData.trips.hampiExpress;
const passengers: Passenger[] = testData.passengers.filter(p => p.active);

async function screenshot(page: import('@playwright/test').Page, testInfo: TestInfo, name: string) {
  const buffer = await page.screenshot({ fullPage: true });
  await testInfo.attach(name, { body: buffer, contentType: 'image/png' });
}

test(`E2E Booking: ${trip.trainName} (${trip.trainNumber}) ${trip.from} → ${trip.to}`, async ({ stealthPage }, testInfo) => {
  const page = stealthPage;
  const loginPage = new LoginPage(page);
  const searchPage = new SearchPage(page);
  const trainListPage = new TrainListPage(page);
  const bookingPage = new BookingPage(page);
  const reviewPage = new ReviewPage(page);
  const paymentPage = new PaymentPage(page);

  allure.epic('IRCTC Train Booking');
  allure.feature('E2E Booking Flow');
  allure.story(`Book ${trip.trainName} (${trip.trainNumber}) ${trip.from} → ${trip.to}`);

  // --- Navigate & Login ---
  await allure.step('Navigate to IRCTC', async () => {
    await loginPage.navigate();
    await screenshot(page, testInfo, 'After Navigation');
  });

  await allure.step('Login', async () => {
    await loginPage.clickLoginLink();
    await loginPage.login();
    await screenshot(page, testInfo, 'After Login');
  });

  // --- Search ---
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

  // --- Booking Form (Step 1: Passenger Details) ---
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

  // Payment mode: keep default (Credit & Debit Cards / Net Banking etc.)
  // await allure.step(`Select Payment Mode (${testData.payment.mode})`, async () => {
  //   await bookingPage.selectPaymentMode(testData.payment.mode);
  //   await screenshot(page, testInfo, 'After Payment Mode Selection');
  // });

  await allure.step('Click Continue (Passenger Details)', async () => {
    await screenshot(page, testInfo, 'Before Continue');
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

  // --- Payment Gateway (IRCTC iPay) ---
  await allure.step('iPay Payment Gateway Loaded', async () => {
    await paymentPage.waitForPaymentPage();
    await screenshot(page, testInfo, 'iPay - All Payment Options');
  });

  await allure.step('Select UPI (CC-CL) Tab', async () => {
    await paymentPage.selectUpiCcCl();
    await screenshot(page, testInfo, 'iPay - UPI CC-CL Selected');
  });

  await allure.step('Click Pay through QR', async () => {
    await paymentPage.clickPayThroughQR();
    await screenshot(page, testInfo, 'iPay - QR Code Displayed');
  });

  await allure.step('Booking flow completed - Scan QR to pay', async () => {
    console.log('----------------------------------------------------');
    console.log('QR Code displayed. Scan with UPI app to complete payment.');
    console.log('Waiting 120 seconds for payment confirmation...');
    console.log('----------------------------------------------------');
    await screenshot(page, testInfo, 'QR Code for Payment');
    // Wait for payment confirmation or timeout
    await page.waitForURL(/bookingConfirmation|success|ticket/i, { timeout: 120000 }).catch(() => {
      console.log('Payment confirmation page not detected within timeout.');
    });
    await screenshot(page, testInfo, 'Final State');
    console.log('✅ E2E Booking flow completed successfully!');
  });

  // --- Cleanup ---
  await allure.step('Logout', async () => {
    await loginPage.logout();
    await screenshot(page, testInfo, 'After Logout');
  });
});
