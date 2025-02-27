// components/filters.ts
import { Page } from "@playwright/test";
import { CategoryFilter } from "./category-filter";

export class Filters {
  private page: Page;
  private categoryFilter: CategoryFilter;

  constructor(page: Page) {
    this.page = page;
    this.categoryFilter = new CategoryFilter(page);
  }

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

  async selectSortOption(
    option: "name,asc" | "name,desc" | "price,asc" | "price,desc"
  ) {
    await this.sortDropdown().selectOption(option);
  }

  async setPriceRange(min: number, max: number): Promise<void> {
    const fullTrack = this.sliderFullTrack();
    const slider1 = this.priceSliderMin();
    const slider2 = this.priceSliderMax();

    const trackBox = await fullTrack.boundingBox();
    const slider1Box = await slider1.boundingBox();
    const slider2Box = await slider2.boundingBox();
    if (!trackBox || !slider1Box || !slider2Box)
      throw new Error("Slider elements not found");

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

  async adjustSlider(
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

  async getSliderValue(slider: any): Promise<number> {
    const value = await slider.getAttribute("aria-valuenow");
    return parseFloat(value || "0");
  }

  async getPriceRange(): Promise<{ min: number; max: number }> {
    return {
      min: await this.getMinPrice(),
      max: await this.getMaxPrice(),
    };
  }

  async getMinPrice(): Promise<number> {
    const minValue = await this.priceSliderMin().getAttribute("aria-valuenow");
    return parseFloat(minValue || "0");
  }

  async getMaxPrice(): Promise<number> {
    const maxValue = await this.priceSliderMax().getAttribute("aria-valuenow");
    return parseFloat(maxValue || "0");
  }

  async searchProduct(query: string) {
    await this.searchInput().fill(query);
    await this.searchSubmit().click();
  }

  async resetSearch() {
    await this.searchReset().click();
  }

  async filterByCategory(categories: string[]): Promise<void> {
    await this.categoryFilter.filterByCategory(categories);
  }

  async isCategoryChecked(category: string): Promise<boolean> {
    return await this.categoryFilter.isCategoryChecked(category);
  }

  async filterByBrand(brandId: string) {
    await this.brandCheckbox(brandId).check();
  }

  // Expose sortDropdown for assertions
  getSortDropdown() {
    return this.sortDropdown();
  }
}
