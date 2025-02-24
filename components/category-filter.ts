// components/categoryFilter.ts
import { Page } from "@playwright/test";

export class CategoryFilter {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private categoryCheckbox = (categoryId: string) =>
    this.page.locator(`[data-test="category-${categoryId}"]`);

  private categoryMap = {
    "hand-tools": "01JMWRQF0970B7TBD0DB647XWZ",
    "power-tools": "01JMTM2CJ80R31NZS95KZW345D",
    "other": "01JMTM2CJ80R31NZS95KZW345E",
    subcategories: {
      "hand-tools": {
        "hammer": "01JMWRQF0X53P7QG7GJHBJ6Z6K",
        "hand-saw": "01JMWRQF0X53P7QG7GJHBJ6Z6M",
        "wrench": "01JMWRQF0X53P7QG7GJHBJ6Z6N",
        "screwdriver": "01JMWRQF0X53P7QG7GJHBJ6Z6P",
        "pliers": "01JMWRQF0X53P7QG7GJHBJ6Z6Q",
        "chisels": "01JMWRQF0X53P7QG7GJHBJ6Z6R",
        "measures": "01JMWRQF0X53P7QG7GJHBJ6Z6S",
      },
      "power-tools": {
        "grinder": "01JMTM2CJKNFWVAKWYJPMENHKQ",
        "sander": "01JMTM2CJKNFWVAKWYJPMENHKR",
        "saw": "01JMTM2CJKNFWVAKWYJPMENHKS",
        "drill": "01JMTM2CJKNFWVAKWYJPMENHKT",
      },
      "other": {
        "tool-belts": "01JMTM2CJKNFWVAKWYJPMENHKV",
        "storage-solutions": "01JMTM2CJKNFWVAKWYJPMENHKW",
        "workbench": "01JMTM2CJKNFWVAKWYJPMENHKX",
        "safety-gear": "01JMTM2CJKNFWVAKWYJPMENHKY",
        "fasteners": "01JMTM2CJKNFWVAKWYJPMENHKZ",
      },
    },
  };

  async filterByCategory(categories: string[]): Promise<void> {
    for (const category of categories) {
      let categoryId = this.categoryMap[category];
      if (categoryId) {
        const checkbox = this.categoryCheckbox(categoryId);
        if (!(await checkbox.isChecked())) {
          await checkbox.check();
        }
        continue;
      }

      for (const topLevel in this.categoryMap.subcategories) {
        const subCatId = this.categoryMap.subcategories[topLevel][category];
        if (subCatId) {
          const checkbox = this.categoryCheckbox(subCatId);
          if (!(await checkbox.isChecked())) {
            await checkbox.check();
          }
          break;
        }
      }

      if (
        !categoryId &&
        !Object.values(this.categoryMap.subcategories).some(
          (subs) => subs[category]
        )
      ) {
        throw new Error(`Unknown category or subcategory: ${category}`);
      }
    }
  }
}
