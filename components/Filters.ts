import { Page } from "@playwright/test";

export class Filters {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  private sortDropdown = () => this.page.locator('[data-test="sort"]');
  private priceSliderMin = () => this.page.locator(".ngx-slider-pointer-min");
  private priceSliderMax = () => this.page.locator(".ngx-slider-pointer-max");
  private searchInput = () => this.page.locator('[data-test="search-query"]');
  private searchSubmit = () => this.page.locator('[data-test="search-submit"]');
  private searchReset = () => this.page.locator('[data-test="search-reset"]');
  private categoryCheckbox = (categoryId: string) =>
    this.page.locator(`[data-test="category-${categoryId}"]`);
  private brandCheckbox = (brandId: string) =>
    this.page.locator(`[data-test="brand-${brandId}"]`);

  //Methods
  async selectSortOption(
    option: "name,asc" | "name,desc" | "price,asc" | "price,desc"
  ) {
    await this.sortDropdown().selectOption(option);
  }

  async setPriceRange(min: number, max: number): Promise<void> {
    const sliderMin = this.priceSliderMin();
    const sliderMax = this.priceSliderMax();

    await sliderMin.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(min, 0);
    await this.page.mouse.up();

    await sliderMax.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(max, 0);
    await this.page.mouse.up();
  }

  async searchProduct(query: string) {
    await this.searchInput().fill(query);
    await this.searchSubmit().click();
  }

  async resetSearch() {
    await this.searchReset().click();
  }

  async filterByCategory(categoryId: string) {
    await this.categoryCheckbox(categoryId).check(); // Use check() instead of click()
  }

  async filterByBrand(brandId: string) {
    await this.brandCheckbox(brandId).check(); // Use check() instead of click()
  }
}
