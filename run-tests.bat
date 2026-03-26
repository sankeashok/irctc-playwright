@echo off
echo ============================================
echo  Running Playwright Tests
echo ============================================

rmdir /s /q allure-results 2>nul

npx playwright test %*

echo.
echo ============================================
echo  Generating and Opening Allure Report
echo ============================================

npx allure generate ./allure-results -o allure-report
npx allure open allure-report
