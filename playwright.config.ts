import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
	features: 'tests/e2e/*.feature',
	steps: 'tests/e2e/*.ts'
});

export default defineConfig({
	testDir,
	reporter: 'html',
	webServer: { command: 'npm run build && npm run preview', port: 4173 }
});
