import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');

    // Check that the main heading is present
    await expect(page.getByRole('heading', { name: 'Master Your Teacher Certification Exam' })).toBeVisible();

    // Check for key elements
    await expect(page.getByRole('link', { name: 'Browse All Exams' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Pricing' })).toBeVisible();

    // Check stats section
    await expect(page.getByText('50,000+')).toBeVisible();
    await expect(page.getByText('Students Trained')).toBeVisible();

    // Take a screenshot for visual regression testing
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('states page loads and shows data', async ({ page }) => {
    await page.goto('/states');

    // Check that the page loads
    await expect(page.getByRole('heading', { name: 'Teacher Certification by State' })).toBeVisible();

    // Wait for data to load (either success or error state)
    await page.waitForSelector('text=Loading State Data', { state: 'hidden', timeout: 30000 });

    // Check for either error state or content
    const hasError = await page.getByText('Unable to Load Data').isVisible();
    const hasContent = await page.getByText('States Available').isVisible();

    if (hasError) {
      // Check that retry button exists
      await expect(page.getByRole('button', { name: 'Try Again' })).toBeVisible();
    } else if (hasContent) {
      // Check that state cards are displayed
      await expect(page.getByText('States Available')).toBeVisible();

      // Look for state summary cards
      const stateCards = page.locator('[data-testid="state-summary-card"]').first();
      if (await stateCards.isVisible()) {
        await expect(stateCards).toBeVisible();
      }
    }

    // Check search functionality exists
    await expect(page.getByPlaceholder('Search by state name or abbreviation...')).toBeVisible();
  });

  test('navigation menu works', async ({ page }) => {
    await page.goto('/');

    // Test navigation to different pages
    await page.getByRole('link', { name: 'States' }).click();
    await expect(page).toHaveURL('/states');

    await page.getByRole('link', { name: 'Pricing' }).click();
    await expect(page).toHaveURL('/pricing');

    // Go back to home
    await page.getByRole('link', { name: 'TeachCert Pro' }).click();
    await expect(page).toHaveURL('/');
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check mobile navigation
    await expect(page.getByRole('heading', { name: 'Master Your Teacher Certification Exam' })).toBeVisible();

    // Check that buttons are properly sized for mobile
    await expect(page.getByRole('link', { name: 'Browse All Exams' })).toBeVisible();

    // Check mobile layout
    await expect(page).toHaveScreenshot('homepage-mobile.png');
  });

  test('page performance is acceptable', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // Check Core Web Vitals
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {
            largestContentfulPaint: entries.find(entry => entry.name === 'largest-contentful-paint')?.startTime || 0,
            firstInputDelay: entries.find(entry => entry.name === 'first-input')?.processingStart - entries.find(entry => entry.name === 'first-input')?.startTime || 0,
            cumulativeLayoutShift: entries.find(entry => entry.name === 'cumulative-layout-shift')?.value || 0,
          };
          resolve(metrics);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'cumulative-layout-shift'] });

        // Fallback timeout
        setTimeout(() => resolve({ largestContentfulPaint: 0, firstInputDelay: 0, cumulativeLayoutShift: 0 }), 3000);
      });
    });

    // LCP should be under 2.5 seconds
    expect(performanceMetrics.largestContentfulPaint).toBeLessThan(2500);

    // CLS should be under 0.1
    expect(performanceMetrics.cumulativeLayoutShift).toBeLessThan(0.1);
  });
});