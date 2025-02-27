import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/home-page";

test.describe("HomePage Tests", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.visit();
  });

  test("Verify NavBar interactions", async ({ page }) => {
    expect(await homePage.navBar.getBrandVisibility()).toBe(true);
    await homePage.changeLanguage("es");
    expect(await homePage.navBar.getSelectedLanguage()).toBe("es");
    await homePage.goToCategory("hand-tools");
    expect(page.url()).toContain("hand-tools"); // Adjust if needed
  });

  test("Verify Banner visibility", async () => {
    expect(await homePage.banner.isVisible()).toBe(true);
  });

  test("Search, Sort Products", async () => {
    await homePage.searchAndSort("pliers", "price,asc");
    expect(await homePage.filters.getSortDropdown().inputValue()).toBe(
      "price,asc"
    );
  });

  test("Filter Products by Category", async () => {
    await homePage.filters.filterByCategory([" Hand Tools ", "grinder"]);
    // expect(
    //   await homePage.products.isProductDisplayed("Combination Pliers")
    // ).toBe(true);
    // expect(await homePage.products.isProductDisplayed("Grinder")).toBe(true);
    expect(await homePage.filters.isCategoryChecked("Hand Tools")).toBe(true);
    expect(await homePage.filters.isCategoryChecked("Grinder")).toBe(true);
  });

  test("Filter Products by Price", async () => {
    await homePage.filterByPriceRange(10, 50);
    let range = await homePage.filters.getPriceRange();
    console.log(range);
    expect(range.min).toBeCloseTo(10, 1);
    expect(range.max).toBeCloseTo(50, 1);

    await homePage.filterByPriceRange(1, 5);
    range = await homePage.filters.getPriceRange();
    console.log(range);
    expect(range.min).toBeCloseTo(1, 1);
    expect(range.max).toBeCloseTo(5, 1);

    // await homePage.filterByPriceRange(51, 100);
    // range = await homePage.filters.getPriceRange();
    // console.log(range);
    // expect(range.min).toBeCloseTo(51, 1);
    // expect(range.max).toBeCloseTo(100, 1);
  });

  test("Verify Product Listings", async () => {
    // Verify there are products displayed
    expect(await homePage.products.getProductCount()).toBeGreaterThan(0);

    // Get first product info and verify its details
    const firstProduct = await homePage.products.getProductByIndex(0);
    expect(firstProduct.name).toContain("Pliers");
    expect(firstProduct.price).toMatch(/^\$\d+\.\d{2}$/);

    // Verify specific product visibility and stock status
    const combinationPliers =
      await homePage.products.getProductByName("Combination Pliers");
    expect(combinationPliers.name).toContain("Combination Pliers");

    const longNosePliers =
      await homePage.products.getProductByName("Long Nose Pliers");
    expect(longNosePliers.isOutOfStock).toBe(true);
  });

  test("Navigate to Product Page", async ({ page }) => {
    await homePage.products.clickProductByName("Combination Pliers");
    await page.waitForURL("**/product/**");
    // expect(page.url()).toContain("/product/01JMTM2CKQQNKK2JGZJP5W8S8R");
  });
});
