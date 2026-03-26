@echo off
echo ============================================
echo  Running Playwright Tests
echo ============================================

rmdir /s /q allure-results 2>nul

npx playwright test %*

echo.
echo ============================================
echo  Generating Allure Report
echo ============================================

npx allure generate ./allure-results -o allure-report

echo.
echo Opening Allure Report in browser...
start "" "%cd%\allure-report\index.html"
