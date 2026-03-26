# IRCTC Playwright Automation Framework

This project is a robust, Playwright-based automation framework designed to navigate the end-to-end booking flow on the live [IRCTC Indian Railways](https://www.irctc.co.in) portal. 

## Features
- **Responsive Handling:** Configured to launch in full 1920x1080 desktop mode so crucial navigation elements like "LOGIN" don't collapse into mobile menus.
- **Robust Locators:** Uses text-based locators and `.getByPlaceholder` to resist IRCTC UI CSS changes instead of brittle class selectors.
- **Bot/Popup Resilience:** Incorporates fallback wait states, `force: true` clicks, and silent error catching to ensure the script does not crash if IRCTC blocks navigation or throws overlay banners.
- **Manual Captcha Gateway:** Contains an explicit `page.pause()` checkpoint allowing you to safely resolve CAPTCHAs in the browser during the authentication phase before letting the framework take over the search flow.

## Installation
```bash
npm install
npx playwright install
```

## Running the Automation
Because resolving the IRCTC Captcha is required, the automation is run in a hybrid attended mode:

```bash
npx playwright test tests/irctc_booking.spec.ts --headed
```

**Execution Workflow:**
1. The script will open the browser automatically, navigate to IRCTC, and open the Login Modal.
2. It will inject your credentials automatically.
3. The Playwright Inspector will pop up, **pausing** the script entirely.
4. **MANUALLY** solve the Captcha in the browser window and click `SIGN IN`.
5. Once you verify you are logged in and looking at the Home page, return to the **Playwright Inspector window** and hit the **Resume (▶️) button**.
6. The script will then autonomously search for KGI -> TNGL, set dates precisely via simulated keystrokes, locate the *HAMPI EXPRESS*, select the Sleeper class, and attempt to click Book Now.
