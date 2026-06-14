import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('I am on the home page', async ({ page }) => {
	await page.goto('/');
});

Then('the table should display {int} user(s)', async ({ page }, count: number) => {
	await expect(page.locator('table tbody tr')).toHaveCount(count);
});

Then('I should see a user named {string}', async ({ page }, name: string) => {
	await expect(page.locator('table tbody td', { hasText: name }).first()).toBeVisible();
});
