import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('I click the Filters button', async ({ page }) => {
	await page.getByRole('button', { name: 'Filters' }).click();
});

When('I type {string} in the {string} filter', async ({ page }, value: string, column: string) => {
	await page.getByPlaceholder(`Filter by ${column}`).fill(value);
});

When('I click the Reset Filters button', async ({ page }) => {
	await page.getByRole('button', { name: 'Reset Filters' }).click();
});

Then(
	'I should see filter inputs for {string}, {string}, {string}, and {string}',
	async ({ page }, col1: string, col2: string, col3: string, col4: string) => {
		for (const column of [col1, col2, col3, col4]) {
			await expect(page.getByPlaceholder(`Filter by ${column}`)).toBeVisible();
		}
	}
);

Then(
	'the table should only show users whose job contains {string}',
	async ({ page }, keyword: string) => {
		const rows = page.locator('table tbody tr');
		const count = await rows.count();

		for (let i = 0; i < count; i++) {
			const jobCell = rows.nth(i).locator('td').nth(1);
			await expect(jobCell).toContainText(keyword);
		}
	}
);

Then('the table should display no users', async ({ page }) => {
	await expect(page.locator('table tbody td', { hasText: 'No data available.' })).toBeVisible();
});
