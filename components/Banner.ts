import { Page } from "@playwright/test";

/**
 * Represents the banner component of the website.
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
   * @returns Locator for the banner element
   */
  private banner = () => this.page.locator('img[alt="Banner"]');

  /**
   * Checks if the banner is visible on the page
   * @returns Promise<boolean> True if banner is visible
   */
  async isVisible() {
    return await this.banner().isVisible();
  }
}
