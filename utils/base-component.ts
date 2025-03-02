import { Page, Locator, expect } from "@playwright/test";

export abstract class BaseComponent {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Helper method to wait for and click an element
   * @param locator - The Playwright Locator
   */
  protected async waitAndClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: 5000 });
    await locator.click();
  }

  /**
   * Helper method for polling expectations
   * @param callback - The callback to evaluate
   */
  protected expect<T>(callback: () => Promise<T>) {
    return expect.poll(callback);
  }

  protected async waitForToast(type: "success" | "error"): Promise<void> {
    const toastLocator = this.page.locator(`[data-test="${type}-toast"]`);
    await expect(toastLocator).toBeVisible({ timeout: 5000 });
  }
}
