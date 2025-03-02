// components/category-filter.ts
import { Page, Locator } from "@playwright/test";
import { BaseComponent } from "../utils/base-component";

/**
 * Represents the category filter component.
 * Handles filtering products by their categories.
 */
export class CategoryFilter extends BaseComponent {
  /**
   * Creates an instance of CategoryFilter component.
   * @param page - The Playwright Page object
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Locator for category checkbox
   * @param categoryText - The text label of the category
   * @returns Locator for the category checkbox
   */
  private getCategoryCheckbox(categoryText: string): Locator {
    return this.page
      .locator(`label`)
      .filter({ hasText: categoryText })
      .locator('input[type="checkbox"]');
  }

  /**
   * Filters products by selecting multiple categories
   * @param categories - Array of category names to filter by
   */
  async filterByCategory(categories: string[]): Promise<void> {
    for (const category of categories) {
      const checkbox = this.getCategoryCheckbox(category);
      await checkbox.waitFor({ state: "visible", timeout: 5000 });

      if (!(await checkbox.isChecked())) {
        await this.waitAndClick(checkbox);
        await this.page.waitForLoadState("networkidle");
      }
    }
  }

  /**
   * Verifies if a specific category is checked
   * @param category - The category name to check
   * @returns Promise<boolean> True if category is checked
   */
  async isCategoryChecked(category: string): Promise<boolean> {
    return await this.getCategoryCheckbox(category).isChecked();
  }
}
