import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    // Setting viewport to null allows the browser to size the page to its full window extent
    viewport: null,
    launchOptions: {
      args: ['--start-maximized']
    }
  }
});
