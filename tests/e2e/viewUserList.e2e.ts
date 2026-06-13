import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

Given('I am on the home page', async ({ page }) => {
	await page.goto('/');
});

When('I look at the page', async () => {
	// no action needed, just observing the page
});

When('I look at the table', async () => {
	// no action needed, just observing the table
});

When('I look at the table headers', async () => {
	// no action needed, just observing the headers
});

Then('I should see a table titled {string}', async ({ page }, title: string) => {
	await expect(page.getByRole('heading', { name: title })).toBeVisible();
});

Then('the table should display {int} users', async ({ page }, count: number) => {
	const rows = page.locator('table tbody tr');
	await expect(rows).toHaveCount(count);
});

Then('the table should have the following columns', async ({ page }, dataTable) => {
	const expectedColumns: string[] = dataTable.raw()[0];

	for (const column of expectedColumns) {
		await expect(page.locator('table thead th', { hasText: column }).first()).toBeVisible();
	}
});

Then('I should see the following users', async ({ page }, dataTable) => {
	const expectedUsers = dataTable.hashes() as {
		Name: string;
		Job: string;
		Company: string;
		Location: string;
	}[];

	const rows = page.locator('table tbody tr');

	for (let i = 0; i < expectedUsers.length; i++) {
		const user = expectedUsers[i];
		const row = rows.nth(i);
		const cells = row.locator('td');

		await expect(cells.nth(0)).toHaveText(user.Name);
		await expect(cells.nth(1)).toHaveText(user.Job);
		await expect(cells.nth(2)).toHaveText(user.Company);
		await expect(cells.nth(3)).toHaveText(user.Location);
	}
});
