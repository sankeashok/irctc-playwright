@echo off
echo ============================================
echo  Running Playwright Tests
echo ============================================

:: Preserve history from previous report
if exist allure-report\history (
  if not exist allure-results\history mkdir allure-results\history
  xcopy /s /y /q allure-report\history allure-results\history\ >nul 2>&1
)

:: Clean old results but keep history
for /d %%i in (allure-results\*) do if /i not "%%~nxi"=="history" rmdir /s /q "%%i" 2>nul
for %%i in (allure-results\*) do if /i not "%%~nxi"=="history" del /q "%%i" 2>nul

npx playwright test %*

echo.
echo ============================================
echo  Generating Allure Report with History
echo ============================================

npx allure generate ./allure-results -o allure-report
npx allure open allure-report
