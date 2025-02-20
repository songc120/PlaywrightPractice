import { test, expect } from '@playwright/test';

test('login test', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  await page.locator('[data-test="nav-sign-in"]').click();
  await page.locator('[data-test="email"]').fill('customer@practicesoftwaretesting.com');
  await page.locator('[data-test="password"]').fill('welcome01');
  await page.locator('[data-test="login-submit"]').click();
  await expect(page.locator('[data-test="nav-menu"]')).toContainText('Jane Doe');
  await expect(page.locator('[data-test="page-title"]')).toContainText('My account');
});

test('login invalid test', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  await page.locator('[data-test="nav-sign-in"]').click();
  await page.locator('[data-test="email"]').fill('notcustomer@practicesoftwaretesting.com');
  await page.locator('[data-test="password"]').fill('welcomes01');
  await page.locator('[data-test="login-submit"]').click();
  await expect(page.locator('[data-test="login-error"] div')).toContainText('Invalid email or password');
  await expect(page.locator('app-login')).toContainText('Not yet an account? Register your accountForgot your Password?');
14
});
