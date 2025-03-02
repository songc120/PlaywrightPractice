import { Page, Locator } from "@playwright/test";

/**
 * Represents the banner component.
 * Handles operations related to the main banner image.
 */
export class Banner {
  private page: Page;
  private readonly banner: Locator;
  private readonly bannerLink: Locator;

  /**
   * Creates an instance of Banner component.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
    this.banner = page.locator('img[alt="Banner"]');
    this.bannerLink = page.locator('a:has(img[alt="Banner"])');
  }

  /**
   * Checks if the banner is visible on the page
   * @returns Promise<boolean> True if banner is visible
   */
  async isVisible(): Promise<boolean> {
    await this.banner.waitFor({ state: "visible", timeout: 5000 });
    return await this.banner.isVisible();
  }

  /**
   * Gets the banner image source URL
   * @returns Promise<string> The image URL
   */
  async getImageUrl(): Promise<string> {
    await this.banner.waitFor({ state: "visible", timeout: 5000 });
    return (await this.banner.getAttribute("src")) || "";
  }

  /**
   * Clicks the banner if it's clickable
   */
  async click(): Promise<void> {
    if (await this.bannerLink.isVisible()) {
      await this.bannerLink.click();
    }
  }
}
