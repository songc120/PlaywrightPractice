import { Page } from "@playwright/test";

/**
 * Represents the banner component.
 * Handles operations related to the main banner image.
 */
export class Banner {
  private page: Page;

  /**
   * Creates an instance of Banner component.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Locator for the banner image
   */
  private banner = () => this.page.locator('img[alt="Banner"]');

  /**
   * Checks if the banner is visible on the page
   * @returns Promise<boolean> True if banner is visible
   */
  async isVisible(): Promise<boolean> {
    const element = this.banner();
    await element.waitFor({ state: "visible", timeout: 5000 });
    return await element.isVisible();
  }

  /**
   * Gets the banner image source URL
   * @returns Promise<string> The image URL
   */
  async getImageUrl(): Promise<string> {
    const element = this.banner();
    await element.waitFor({ state: "visible", timeout: 5000 });
    return (await element.getAttribute("src")) || "";
  }

  /**
   * Clicks the banner if it's clickable
   */
  async click(): Promise<void> {
    const bannerLink = this.page.locator('a:has(img[alt="Banner"])');
    if (await bannerLink.isVisible()) {
      await bannerLink.click();
    }
  }
}
