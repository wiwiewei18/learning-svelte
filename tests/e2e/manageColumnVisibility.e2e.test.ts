import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('I click the Manage Columns button', async ({ page }) => {
	await page.getByRole('button', { name: 'Manage Columns' }).click();
});

When('I uncheck the {string} column', async ({ page }, column: string) => {
	await page.getByLabel(column).uncheck();
});

When('I check the {string} column', async ({ page }, column: string) => {
	await page.getByLabel(column).check();
});

When('I uncheck the {string} checkbox', async ({ page }, label: string) => {
	await page.getByLabel(label).uncheck();
});

When('I check the {string} checkbox', async ({ page }, label: string) => {
	await page.getByLabel(label).check();
});

When('I type {string} in the column search box', async ({ page }, value: string) => {
	await page.getByPlaceholder('Search columns').fill(value);
});

Then(
	'I should see column toggles for {string} and {string}',
	async ({ page }, col1: string, col2: string) => {
		await expect(page.getByLabel(col1)).toBeVisible();
		await expect(page.getByLabel(col2)).toBeVisible();
	}
);

Then('all column checkboxes should be checked', async ({ page }) => {
	const checkboxes = page.locator('.dropdown-content input[type="checkbox"]');
	const count = await checkboxes.count();

	for (let i = 0; i < count; i++) {
		await expect(checkboxes.nth(i)).toBeChecked();
	}
});

Then('the table should not show the {string} column', async ({ page }, column: string) => {
	await expect(page.locator('table thead th', { hasText: column })).not.toBeVisible();
});

Then('the table should show the {string} column', async ({ page }, column: string) => {
	await expect(page.locator('table thead th', { hasText: column })).toBeVisible();
});

Then('I should only see the {string} column toggle', async ({ page }, column: string) => {
	await expect(page.getByLabel(column)).toBeVisible();
});

Then('I should not see the {string} column toggle', async ({ page }, column: string) => {
	await expect(page.getByLabel(column)).not.toBeVisible();
});
