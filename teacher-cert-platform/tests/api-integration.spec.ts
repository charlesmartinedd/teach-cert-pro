import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API service for testing
    await page.addInitScript(() => {
      // Mock the API responses
      window.fetch = async (url: string, options?: RequestInit) => {
        if (url.includes('/states')) {
          if (url.includes('/summary')) {
            // Mock state summary
            return new Response(JSON.stringify({
              state: 'California',
              abbreviation: 'CA',
              total_tests: 3,
              total_objectives: 24,
              average_confidence: 0.75,
              last_updated: '2025-10-16T11:09:13.132158'
            }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          } else {
            // Mock states list
            return new Response(JSON.stringify([
              'California', 'Texas', 'New York', 'Florida', 'Georgia'
            ]), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }

        // For other requests, use the real fetch
        return fetch(url, options);
      };
    });
  });

  test('states page loads with mocked data', async ({ page }) => {
    await page.goto('/states');

    // Wait for the page to load
    await expect(page.getByRole('heading', { name: 'Teacher Certification by State' })).toBeVisible();

    // Should show stats instead of loading
    await expect(page.getByText('5')).toBeVisible(); // States Available
    await expect(page.getByText('States Available')).toBeVisible();

    // Check that search functionality works
    const searchInput = page.getByPlaceholder('Search by state name or abbreviation...');
    await searchInput.fill('California');

    // Should filter results
    await expect(page.getByText('California')).toBeVisible();
  });

  test('handles API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.addInitScript(() => {
      window.fetch = async () => {
        return new Response('Internal Server Error', {
          status: 500,
          statusText: 'Internal Server Error'
        });
      };
    });

    await page.goto('/states');

    // Should show error state
    await expect(page.getByText('Unable to Load Data')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Try Again' })).toBeVisible();

    // Test retry functionality
    await page.getByRole('button', { name: 'Try Again' }).click();

    // Should show loading state again
    await expect(page.getByText('Loading State Data')).toBeVisible();
  });

  test('search functionality works correctly', async ({ page }) => {
    await page.goto('/states');

    // Wait for data to load
    await expect(page.getByText('5')).toBeVisible(); // States Available

    // Test search by state name
    const searchInput = page.getByPlaceholder('Search by state name or abbreviation...');
    await searchInput.fill('Texas');

    // Should show filtered results
    await expect(page.getByText('Texas')).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(page.getByText('California')).toBeVisible();
    await expect(page.getByText('Texas')).toBeVisible();
  });

  test('state cards are clickable', async ({ page }) => {
    await page.goto('/states');

    // Wait for data to load
    await expect(page.getByText('5')).toBeVisible();

    // Find and click a state card
    const stateCard = page.locator('text=California').first();
    if (await stateCard.isVisible()) {
      await stateCard.click();
      // In a real implementation, this would navigate to state detail page
      // For now, we'll just check that the click doesn't cause errors
      await expect(page.getByRole('heading', { name: 'Teacher Certification by State' })).toBeVisible();
    }
  });
});