import { Page } from "@playwright/test";

export class Banner {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private banner = () => this.page.locator('img[alt="Banner"]');

  async isVisible() {
    return await this.banner().isVisible();
  }
}
