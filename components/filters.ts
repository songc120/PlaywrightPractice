// components/filters.ts
import { Page } from "@playwright/test";
import { CategoryFilter } from "./category-filter";

/**
 * Represents the filters component.
 * Handles product filtering operations including search, sort, price range, and category filters.
 */
export class Filters {
  private page: Page;
  private categoryFilter: CategoryFilter;
  private readonly selectors = {
    searchInput: '[data-test="search-query"]',
    searchSubmit: '[data-test="search-submit"]',
    searchReset: '[data-test="search-reset"]',
    sortDropdown: '[data-test="sort"]',
    priceSliderMin: ".ngx-slider-pointer-min",
    priceSliderMax: ".ngx-slider-pointer-max",
    sliderFullTrack: ".ngx-slider-full-bar",
    sliderTrack: ".ngx-slider-selection",
    categoryCheckbox: (name: string) => `[data-test="category-${name}"]`,
  };

  constructor(page: Page) {
    this.page = page;
    this.categoryFilter = new CategoryFilter(page);
  }

  /**
   * Locators for filter elements
   */
  private sortDropdown = () => this.page.locator('[data-test="sort"]');
  private priceSliderMin = () => this.page.locator(".ngx-slider-pointer-min");
  private priceSliderMax = () => this.page.locator(".ngx-slider-pointer-max");
  private sliderFullTrack = () => this.page.locator(".ngx-slider-full-bar");
  private sliderTrack = () => this.page.locator(".ngx-slider-selection");
  private searchInput = () => this.page.locator('[data-test="search-query"]');
  private searchSubmit = () => this.page.locator('[data-test="search-submit"]');
  private searchReset = () => this.page.locator('[data-test="search-reset"]');
  private brandCheckbox = (brandId: string) =>
    this.page.locator(`[data-test="brand-${brandId}"]`);

  /**
   * Searches for a product
   * @param query - Search term to filter products
   * @returns Promise<void>
   */
  async searchProduct(query: string): Promise<void> {
    const input = this.searchInput();
    await input.waitFor({ state: "visible", timeout: 5000 });
    await input.fill(query);

    const submit = this.searchSubmit();
    await submit.waitFor({ state: "visible", timeout: 5000 });
    await submit.click();
  }

  /**
   * Selects a sort option for products
   * @param option - Sort option ("name,asc" | "name,desc" | "price,asc" | "price,desc")
   * @returns Promise<void>
   */
  async selectSortOption(
    option: "name,asc" | "name,desc" | "price,asc" | "price,desc"
  ): Promise<void> {
    const dropdown = this.sortDropdown();
    await dropdown.waitFor({ state: "visible", timeout: 5000 });
    await dropdown.selectOption(option);
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Sets the price range filter
   * @param min - Minimum price value
   * @param max - Maximum price value
   * @throws Error if slider elements are not found or not visible
   * @returns Promise<void>
   */
  async setPriceRange(min: number, max: number): Promise<void> {
    const fullTrack = this.sliderFullTrack();
    const slider1 = this.priceSliderMin();
    const slider2 = this.priceSliderMax();

    await Promise.all([
      fullTrack.waitFor({ state: "visible", timeout: 5000 }),
      slider1.waitFor({ state: "visible", timeout: 5000 }),
      slider2.waitFor({ state: "visible", timeout: 5000 }),
    ]);

    const [trackBox, slider1Box, slider2Box] = await Promise.all([
      fullTrack.boundingBox(),
      slider1.boundingBox(),
      slider2.boundingBox(),
    ]);

    if (!trackBox || !slider1Box || !slider2Box) {
      throw new Error("Slider elements not found or not visible");
    }

    const currentMin = await this.getMinPrice();
    const currentMax = await this.getMaxPrice();
    const leftSlider = slider1Box.x < slider2Box.x ? slider1 : slider2;
    const rightSlider = slider1Box.x < slider2Box.x ? slider2 : slider1;

    // console.log({
    //   currentMin,
    //   currentMax,
    //   trackWidth: trackBox.width,
    //   trackBoxX: trackBox.x,
    //   leftSliderX: leftSlider === slider1 ? slider1Box.x : slider2Box.x,
    //   rightSliderX: rightSlider === slider1 ? slider1Box.x : slider2Box.x,
    //   slider1Class: await slider1.getAttribute("class"),
    //   slider2Class: await slider2.getAttribute("class"),
    // });

    // Move left slider to min
    await this.adjustSlider(leftSlider, min, trackBox.y + trackBox.height / 2);
    // await this.page.waitForTimeout(50);

    // Move right slider to max
    await this.adjustSlider(rightSlider, max, trackBox.y + trackBox.height / 2);
    // await this.page.waitForTimeout(50);

    // Final nudge to ensure exact values
    const finalMin = await this.getMinPrice();
    const finalMax = await this.getMaxPrice();
    if (Math.abs(finalMin - min) > 0.5)
      await this.adjustSlider(
        this.priceSliderMin(),
        min,
        trackBox.y + trackBox.height / 2
      );
    if (Math.abs(finalMax - max) > 0.5)
      await this.adjustSlider(
        this.priceSliderMax(),
        max,
        trackBox.y + trackBox.height / 2
      );

    console.log("After move:", await this.getPriceRange());
  }

  /**
   * Adjusts a slider to a target value
   * @param slider - The slider locator to adjust
   * @param targetValue - The target value to set
   * @param yPosition - The y-coordinate for mouse movement
   * @returns Promise<void>
   */
  private async adjustSlider(
    slider: any,
    targetValue: number,
    yPosition: number
  ): Promise<void> {
    let currentValue = await this.getSliderValue(slider);
    let currentX = (await slider.boundingBox())?.x || 0;
    let iterations = 0;
    const maxIterations = 50; // Cap at ~2.5s

    while (
      Math.abs(currentValue - targetValue) > 0.5 &&
      iterations < maxIterations
    ) {
      const distance = Math.abs(currentValue - targetValue);
      const step =
        distance > 20 ? 20 : distance > 10 ? 10 : distance > 5 ? 5 : 1; // Dynamic steps
      const direction = currentValue < targetValue ? step : -step;

      await slider.hover();
      await this.page.mouse.down();
      await this.page.mouse.move(currentX + direction, yPosition);
      await this.page.mouse.up();
      // await this.page.waitForTimeout(50); // Reduced to 50ms

      currentValue = await this.getSliderValue(slider);
      currentX += direction;
      iterations++;

      // console.log({
      //   sliderClass: await slider.getAttribute("class"),
      //   currentValue,
      //   targetValue,
      //   step,
      //   currentX,
      //   iterations,
      // });

      if (currentX < 0 || currentX > 1000) break; // Safety bounds
    }

    // Fallback: Coarse move if max iterations reached
    if (iterations >= maxIterations) {
      const coarseStep = (targetValue - currentValue) * 2; // Rough 2px/unit estimate
      await slider.hover();
      await this.page.mouse.down();
      await this.page.mouse.move(currentX + coarseStep, yPosition);
      await this.page.mouse.up();
      // await this.page.waitForTimeout(50);
    }
  }

  /**
   * Gets the current value of a slider
   * @param slider - The slider locator
   * @returns Promise<number> The current slider value
   */
  async getSliderValue(slider: any): Promise<number> {
    const value = await slider.getAttribute("aria-valuenow");
    return parseFloat(value || "0");
  }

  /**
   * Gets the current price range values
   * @throws Error if sliders are not found or not visible
   * @returns Promise<{min: number, max: number}> The current price range
   */
  async getPriceRange(): Promise<{ min: number; max: number }> {
    const minSlider = this.priceSliderMin();
    const maxSlider = this.priceSliderMax();

    await Promise.all([
      minSlider.waitFor({ state: "visible", timeout: 5000 }),
      maxSlider.waitFor({ state: "visible", timeout: 5000 }),
    ]);

    const [min, max] = await Promise.all([
      this.getMinPrice(),
      this.getMaxPrice(),
    ]);

    return { min, max };
  }

  /**
   * Gets the current minimum price value
   * @returns Promise<number> The minimum price value
   */
  async getMinPrice(): Promise<number> {
    const minValue = await this.priceSliderMin().getAttribute("aria-valuenow");
    return parseFloat(minValue || "0");
  }

  /**
   * Gets the current maximum price value
   * @returns Promise<number> The maximum price value
   */
  async getMaxPrice(): Promise<number> {
    const maxValue = await this.priceSliderMax().getAttribute("aria-valuenow");
    return parseFloat(maxValue || "0");
  }

  /**
   * Resets the search input
   * @returns Promise<void>
   */
  async resetSearch(): Promise<void> {
    const reset = this.searchReset();
    await reset.waitFor({ state: "visible", timeout: 5000 });
    await reset.click();
  }

  /**
   * Gets the current search query
   * @returns Promise<string> The current search query
   */
  async getSearchQuery(): Promise<string> {
    const searchInput = this.searchInput();
    await searchInput.waitFor({ state: "visible", timeout: 5000 });
    return await searchInput.inputValue();
  }

  /**
   * Filters products by category
   * @param categories - Array of category names to filter by
   * @returns Promise<void>
   */
  async filterByCategory(categories: string[]): Promise<void> {
    await this.categoryFilter.filterByCategory(categories);
  }

  /**
   * Checks if a category is currently selected
   * @param category - The category name to check
   * @returns Promise<boolean> True if category is checked
   */
  async isCategoryChecked(category: string): Promise<boolean> {
    return await this.categoryFilter.isCategoryChecked(category);
  }

  /**
   * Filters products by brand
   * @param brandId - The brand ID to filter by
   * @returns Promise<void>
   */
  async filterByBrand(brandId: string): Promise<void> {
    const checkbox = this.brandCheckbox(brandId);
    await checkbox.waitFor({ state: "visible", timeout: 5000 });
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
      await this.page.waitForLoadState("networkidle");
    }
  }

  /**
   * Gets the currently selected sort option
   * @returns Promise<string> The current sort option
   */
  async getSelectedSortOption(): Promise<string> {
    const dropdown = this.sortDropdown();
    await dropdown.waitFor({ state: "visible", timeout: 5000 });
    return await dropdown.inputValue();
  }

  /**
   * Gets the sort dropdown locator (for assertions)
   * @returns Locator The sort dropdown locator
   */
  getSortDropdown(): any {
    return this.sortDropdown();
  }
}
