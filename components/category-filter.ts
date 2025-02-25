// components/category-filter.ts
import { Page } from "@playwright/test";

export class CategoryFilter {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private categoryCheckbox = (categoryText: string) =>
    this.page
      .locator(`label`)
      .filter({ hasText: categoryText })
      .locator('input[type="checkbox"]');

  async filterByCategory(categories: string[]): Promise<void> {
    for (const category of categories) {
      const checkbox = this.categoryCheckbox(category);
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
    }
  }

  // Optional: Verify checked state
  async isCategoryChecked(category: string): Promise<boolean> {
    return await this.categoryCheckbox(category).isChecked();
  }
}
