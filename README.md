# IRCTC Playwright Automation Framework

A production-grade, Playwright-based E2E automation framework for the live [IRCTC](https://www.irctc.co.in) train booking portal, built with Page Object Model, Allure reporting, and data-driven test design.

## Project Structure

```
irctc-playwright/
├── config/
│   ├── testdata.json          # Externalized trip data (routes, trains, dates)
│   └── types.ts               # TypeScript interfaces for test data
├── pages/
│   ├── LoginPage.ts           # Navigation, login detection, session save
│   ├── SearchPage.ts          # Search form: stations, date, class, quota
│   └── TrainListPage.ts       # Train results: selection, booking, verification
├── tests/
│   ├── irctc_booking.spec.ts          # E2E: Login first → Search → Book
│   └── irctc_guest_booking.spec.ts    # E2E: Guest search → Book → Login
├── utils/
│   └── retry.ts               # Generic retry utility for flaky actions
├── auth/                      # Saved session state (gitignored)
├── .env                       # Environment config (gitignored)
├── .env.example               # Template for .env
├── playwright.config.ts       # Playwright config with Allure reporter
├── tsconfig.json              # TypeScript config
├── run-tests.bat              # Test runner with auto Allure report
└── package.json
```

## Features

- **Page Object Model** — Clean separation of locators, actions, and test logic
- **Data-Driven Tests** — Trip details externalized in `config/testdata.json`
- **Allure Reporting** — Step-by-step reports with screenshots at every step, traces, and pass/fail status
- **Smart Waits** — Condition-based waits instead of hard timeouts
- **Retry Mechanism** — Auto-retry on flaky IRCTC dropdowns and autocomplete fields
- **Session Management** — Save/reuse login state via Playwright `storageState`
- **Environment Config** — `.env` for URLs, credentials, and timeouts
- **VS Code Integration** — Debug configs with auto Allure report generation

## Prerequisites

- Node.js 18+
- Google Chrome installed
- Allure CLI (`npm install -g allure-commandline` or available via npx)

## Installation

```bash
git clone <repo-url>
cd irctc-playwright
npm install
```

Copy the environment template and fill in your details:
```bash
cp .env.example .env
```

## Configuration

### Environment Variables (`.env`)
```
BASE_URL=https://www.irctc.co.in/nget/train-search
IRCTC_USERNAME=<your_username>
IRCTC_PASSWORD=<your_password>
LOGIN_TIMEOUT=120000
```

### Test Data (`config/testdata.json`)
Add new routes by adding entries to the `trips` object:
```json
{
  "trips": {
    "hampiExpress": {
      "from": "KGI",
      "to": "TNGL",
      "date": "31/03/2026",
      "trainNumber": "16592",
      "trainName": "HAMPI EXPRESS",
      "class": "Sleeper (SL)",
      "quota": "GENERAL",
      "dateLabel": "Tue, 31 Mar"
    }
  }
}
```

## Running Tests

### From Terminal
```bash
# Run all tests (headed) + auto-open Allure report
npm test

# Run headless
npm run test:headless

# Run a specific test
npx playwright test tests/irctc_booking.spec.ts --headed

# Regenerate and open last Allure report
npm run report
```

### From VS Code (F5)
1. Press `Ctrl+Shift+D` to open Run and Debug
2. Select one of:
   - **Playwright: Debug IRCTC Booking** — runs the booking test
   - **Playwright: Debug Test (Headed)** — runs all tests
   - **Playwright: Debug Current File** — runs the active file
3. Press `F5`
4. Allure report auto-opens after test completes

## Test Flows

### `irctc_booking.spec.ts` — Login First Flow
1. Navigate to IRCTC
2. Manual login (solve captcha + sign in)
3. Search: From → To → Date → Class → Quota
4. Select train → Select class tab → Select date
5. Click Book Now
6. Verify booking page

### `irctc_guest_booking.spec.ts` — Guest Search Flow
1. Navigate to IRCTC (no login)
2. Search: From → To → Date → Class → Quota
3. Select train → Select class tab → Select date
4. Click Book Now
5. Login prompted at booking
6. Verify booking page

## Allure Report

Reports include:
- **Step-by-step breakdown** with pass/fail per step
- **Screenshots** captured at every step
- **Trace recordings** for full test replay
- **Epic → Feature → Story** hierarchy
- **Timing** per step and total duration

## Tech Stack

- [Playwright](https://playwright.dev/) — Browser automation
- [TypeScript](https://www.typescriptlang.org/) — Type-safe test code
- [Allure](https://allurereport.org/) — Test reporting
- [dotenv](https://github.com/motdotla/dotenv) — Environment configuration
