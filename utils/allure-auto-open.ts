import type { Reporter } from '@playwright/test/reporter';
import { execSync, spawn } from 'child_process';
import { rmSync } from 'fs';

class AllureAutoOpenReporter implements Reporter {
  onBegin() {
    // Clean old results at the start of each run
    try {
      rmSync('./allure-results', { recursive: true, force: true });
    } catch {}
  }

  onEnd() {
    try {
      console.log('\n============================================');
      console.log(' Generating and Opening Allure Report');
      console.log('============================================\n');
      execSync('npx allure generate ./allure-results -o allure-report', { stdio: 'inherit' });
      spawn('npx', ['allure', 'open', 'allure-report'], {
        detached: true,
        stdio: 'ignore',
        shell: true
      }).unref();
    } catch (e) {
      console.log('Failed to open Allure report:', e);
    }
  }
}

export default AllureAutoOpenReporter;
