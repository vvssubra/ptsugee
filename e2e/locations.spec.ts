import {expect, test} from '@playwright/test';

for (const viewport of [
  {name: 'mobile', width: 375, height: 812},
  {name: 'tablet', width: 768, height: 1024},
  {name: 'desktop', width: 1440, height: 1000}
]) {
  test(`locations are responsive and interactive at ${viewport.name}`, async ({page}) => {
    await page.setViewportSize(viewport);
    await page.route('https://*.tile.openstreetmap.org/**', (route) => route.abort());
    await page.goto('/');

    const locations = page.locator('#locations');
    await expect(locations).toBeVisible();
    await expect(locations.getByText('164 Tuas South Ave 2')).toBeVisible();
    await expect(locations.getByText('Approximate location')).toBeVisible();

    const batamButton = locations.getByRole('button', {name: 'Show Batam office on map'});
    await batamButton.click();
    await expect(batamButton).toHaveAttribute('aria-pressed', 'true');

    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasOverflow).toBe(false);
  });
}

test('the map is Home-only and Bahasa content is equivalent', async ({page}) => {
  await page.goto('/about');
  await expect(page.locator('#locations')).toHaveCount(0);

  await page.goto('/id');
  await expect(page.getByRole('heading', {name: 'Lokasi Kami'})).toBeVisible();
  await expect(page.getByText('Lokasi perkiraan')).toBeVisible();
});

test('the map is immediately visible from the locations anchor on a narrow preview', async ({page}) => {
  await page.setViewportSize({width: 375, height: 812});
  await page.goto('/#locations');

  const mapBox = await page.getByRole('region', {name: 'Office map'}).boundingBox();
  expect(mapBox).not.toBeNull();
  expect(mapBox?.y).toBeLessThan(500);
});

test.describe('without JavaScript', () => {
  test.use({javaScriptEnabled: false});

  test('keeps office addresses and directions links available', async ({page}) => {
    await page.goto('/');

    await expect(page.getByText('164 Tuas South Ave 2')).toBeVisible();
    await expect(page.getByText('K-15, Tunas Regency')).toBeVisible();
    await expect(page.getByRole('link', {name: 'Get directions'})).toHaveCount(2);
  });
});
