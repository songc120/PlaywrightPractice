// components/category-filter.ts
import { Page } from "@playwright/test";

/**
 * Represents the category filter component.
 * Handles filtering products by their categories.
 */
export class CategoryFilter {
  private page: Page;

  /**
   * Creates an instance of CategoryFilter component.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Locator for category checkbox
   * @param categoryText - The text label of the category
   * @returns Locator for the category checkbox
   */
  private categoryCheckbox = (categoryText: string) =>
    this.page
      .locator(`label`)
      .filter({ hasText: categoryText })
      .locator('input[type="checkbox"]');

  /**
   * Filters products by selecting multiple categories
   * @param categories - Array of category names to filter by
   * @returns Promise<void>
   */
  async filterByCategory(categories: string[]): Promise<void> {
    for (const category of categories) {
      const checkbox = this.categoryCheckbox(category);
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
    }
  }

  /**
   * Verifies if a specific category is checked
   * @param category - The category name to check
   * @returns Promise<boolean> True if category is checked
   */
  async isCategoryChecked(category: string): Promise<boolean> {
    return await this.categoryCheckbox(category).isChecked();
  }
}
