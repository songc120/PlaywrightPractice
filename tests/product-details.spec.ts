import { test, expect } from "@playwright/test";
import { ProductDetailsPage } from "../pages/product-details-page";
import { HomePage } from "../pages/home-page";
import { ProductContainer } from "../components/product-container";
import { NavBar } from "../components/nav-bar";
import { LoginPage } from "../pages/login-page";
import { USER1_EMAIL, USER1_PASSWORD } from "../utils/constants";

test.describe("Product Details Page", () => {
  let productDetailsPage: ProductDetailsPage;
  let homePage: HomePage;
  let productContainer: ProductContainer;

  test.beforeEach(async ({ page }) => {
    // Start from home page
    homePage = new HomePage(page);
    productContainer = new ProductContainer(page);
    await homePage.goto();

    // Click first product
    await productContainer.clickProduct(1);

    // Initialize product details page
    productDetailsPage = new ProductDetailsPage(page);
  });

  test("should display correct product information", async () => {
    // Test basic product information
    expect(await productDetailsPage.getName()).toContain("Pliers");
    expect(await productDetailsPage.getPrice()).toBe(12.01);
    expect(await productDetailsPage.getDescription()).toContain(
      "Nunc vulputate"
    );
  });

  test("should handle quantity controls", async () => {
    // Test initial quantity
    expect(await productDetailsPage.getQuantity()).toBe(1);

    // Test increase quantity
    await productDetailsPage.increaseQuantity();
    expect(await productDetailsPage.getQuantity()).toBe(2);

    // Test decrease quantity
    await productDetailsPage.decreaseQuantity();
    expect(await productDetailsPage.getQuantity()).toBe(1);

    // Test setting specific quantity
    await productDetailsPage.setQuantity(5);
    expect(await productDetailsPage.getQuantity()).toBe(5);
  });

  test("should display correct categories", async () => {
    const categories = await productDetailsPage.getCategories();
    expect(categories).toContain("Pliers");
  });

  test("should display correct brand", async () => {
    const brand = await productDetailsPage.getBrand();
    expect(brand).toContain("ForgeFlex Tools");
  });

  test("should have valid product image", async () => {
    const imageUrl = await productDetailsPage.getImageUrl();
    expect(imageUrl).toContain("assets/img/products/pliers");
    expect(imageUrl).toMatch(/\.(jpg|jpeg|png|avif|webp)$/i);
  });

  test("should display related products", async () => {
    const relatedProducts = await productDetailsPage.getRelatedProducts();

    // Check if we have related products
    expect(relatedProducts.length).toBeGreaterThan(0);

    // Verify structure of first related product
    const firstProduct = relatedProducts[0];
    expect(firstProduct).toHaveProperty("name");
    expect(firstProduct).toHaveProperty("url");
    expect(firstProduct.url).toContain("/product/");
  });

  test("should handle add to cart", async ({ page }) => {
    await productDetailsPage.addToCart();
    await productDetailsPage.hasSuccessToast();

    const messages = await productDetailsPage.getSuccessToastMessages();
    expect(messages[0]).toContain("Product added to shopping cart");
  });

  test("should handle add to favorites when not logged in", async () => {
    await productDetailsPage.addToFavorites();
    await productDetailsPage.hasErrorToast();

    const messages = await productDetailsPage.getErrorToastMessages();
    expect(messages[0]).toContain(
      "Unauthorized, can not add product to your favorite list"
    );
  });

  test("should handle minimum quantity limit", async () => {
    // Set quantity to 1 first
    await productDetailsPage.setQuantity(1);

    // Try to decrease quantity when it's already at minimum
    await productDetailsPage.decreaseQuantity();
    expect(await productDetailsPage.getQuantity()).toBe(1); // Should remain at 1
  });
});
// TODO: Add logged-in user tests after favorites are implemented
// test.describe("Logged-in user tests", () => {
//   let productDetailsPage: ProductDetailsPage;
//   let homePage: HomePage;
//   let productContainer: ProductContainer;

//   test.beforeEach(async ({ page }) => {
//     // Login first
//     const loginPage = new LoginPage(page);
//     await loginPage.navigate();
//     await loginPage.login(USER1_EMAIL, USER1_PASSWORD);
//     const navBar = new NavBar(page);
//     await expect(await navBar.getUserMenuText()).toContain("Jane Doe");

//     // Navigate to product details
//     homePage = new HomePage(page);
//     productContainer = new ProductContainer(page);
//     await homePage.goto();
//     await productContainer.clickProduct(1);
//     productDetailsPage = new ProductDetailsPage(page);
//   });

//   test("should handle add to favorites", async () => {
//     await productDetailsPage.addToFavorites();
//     await productDetailsPage.hasSuccessToast();

//     const messages = await productDetailsPage.getSuccessToastMessages();
//     expect(messages[0]).toContain("Product added to your favorites list.");

//     await productDetailsPage.addToFavorites();
//     await productDetailsPage.hasErrorToast();

//     const errorMessages = await productDetailsPage.getErrorToastMessages();
//     expect(errorMessages[0]).toContain(
//       "Product already in your favorites list."
//     );
//   });
//   // Add other logged-in user tests here if needed
// });
