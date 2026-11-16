import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'], ['list']],
  use:{
    trace: 'retain-on-failure',
    baseURL: 'https://conduit.bondaracademy.com/'
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api-testing',
      testMatch: 'example*',
      testDir: './tests/api-tests',
      dependencies: ['api-smoke-tests']
    },
    {
      name: 'api-smoke-tests',
      testDir: './tests/api-tests',
      testMatch: 'example*'
      // testMatch: 'smoke*'
    },
    {
      name:'ui-tests',
      testDir: './tests/ui-tests',
      use:{
        defaultBrowserType: 'chromium'
      }
    }

  ]
});
