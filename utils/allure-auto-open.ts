import type { Reporter } from '@playwright/test/reporter';
import { execSync } from 'child_process';
import { rmSync, cpSync, existsSync, mkdirSync, readdirSync } from 'fs';

class AllureAutoOpenReporter implements Reporter {
  onBegin() {
    try {
      // Preserve history
      if (existsSync('./allure-report/history')) {
        mkdirSync('./allure-results/history', { recursive: true });
        cpSync('./allure-report/history', './allure-results/history', { recursive: true });
      }
      // Clean old results but keep history
      if (existsSync('./allure-results')) {
        for (const file of readdirSync('./allure-results')) {
          if (file !== 'history') {
            rmSync(`./allure-results/${file}`, { recursive: true, force: true });
          }
        }
      }
    } catch {}
  }

  onEnd() {
    try {
      // Kill any existing allure server
      execSync('taskkill /f /im node.exe /fi "WINDOWTITLE eq allure*" 2>nul', { stdio: 'ignore' });
    } catch {}

    try {
      console.log('\n============================================');
      console.log(' Generating Allure Report with History');
      console.log('============================================\n');
      execSync('npx allure generate ./allure-results -o allure-report', { stdio: 'inherit' });
      // Open report — non-blocking, detached
      require('child_process').exec('npx allure open allure-report', { detached: true, windowsHide: true });
    } catch (e) {
      console.log('Failed to generate Allure report:', e);
    }
  }
}

export default AllureAutoOpenReporter;
