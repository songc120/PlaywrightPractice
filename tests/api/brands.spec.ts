import { test, expect } from "@playwright/test";
import { BrandsApi } from "../../api/brands-api";
import { AuthAPI } from "../../api/auth-api";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../../utils/constants";

let adminToken: string;

test.describe("Brands API Tests", () => {
  test.beforeAll(async ({ request }) => {
    // Initialize API helper for admin login only
    const authApi = new AuthAPI(request);

    // Login as admin to get token for admin-only operations
    const loginResponse = await authApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    expect(loginResponse.ok()).toBeTruthy();
    const loginData = await loginResponse.json();
    adminToken = loginData.access_token;
  });

  test("should get a list of brands", async ({ request }) => {
    // Create a new instance for each test
    const brandsApi = new BrandsApi(request);

    const response = await brandsApi.getBrands();

    expect(response.ok()).toBeTruthy();
    const brands = await response.json();
    expect(Array.isArray(brands)).toBeTruthy();
    expect(brands.length).toBeGreaterThan(0);
  });

  test("should search brands", async ({ request }) => {
    // Create a new instance for each test
    const brandsApi = new BrandsApi(request);

    // First get all brands to find a search term
    const allBrandsResponse = await brandsApi.getBrands();
    const allBrands = await allBrandsResponse.json();

    // Ensure we have at least one brand to search for
    expect(allBrands.length).toBeGreaterThan(0);

    const searchTerm = allBrands[0].name.split(" ")[0]; // Use the first word of the first brand name

    const response = await brandsApi.searchBrands(searchTerm);

    expect(response.ok()).toBeTruthy();
    const brands = await response.json();
    expect(Array.isArray(brands)).toBeTruthy();

    // Check at least some brands contain the search term
    const matchingBrands = brands.filter((brand: any) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(matchingBrands.length).toBeGreaterThan(0);
  });

  test("should get brand by ID", async ({ request }) => {
    // Create a new instance for each test
    const brandsApi = new BrandsApi(request);

    // First get all brands to find a valid brand ID
    const allBrandsResponse = await brandsApi.getBrands();
    const allBrands = await allBrandsResponse.json();

    // Ensure we have at least one brand to get
    expect(allBrands.length).toBeGreaterThan(0);

    const brandId = allBrands[0].id;

    const response = await brandsApi.getBrandById(brandId);

    expect(response.ok()).toBeTruthy();
    const brand = await response.json();
    expect(brand.id).toBe(brandId);
  });

  test("should create a new brand (admin)", async ({ request }) => {
    // Create a new BrandsApi with the admin token in the request headers
    const adminBrandsApi = new BrandsApi({
      ...request,
      async fetch(url, options: any = {}) {
        return request.fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            "Authorization": `Bearer ${adminToken}`,
          },
        });
      },
    });

    // Create a unique slug based on timestamp
    const timestamp = Date.now();

    // Create a new brand
    const newBrand = {
      name: `Test Brand ${timestamp}`,
      slug: `test-brand-${timestamp}`,
    };

    const response = await adminBrandsApi.createBrand(newBrand);

    expect(response.ok()).toBeTruthy();
    const createdBrand = await response.json();
    expect(createdBrand.name).toBe(newBrand.name);
    expect(createdBrand.slug).toBe(newBrand.slug);
  });

  test("should update a brand (admin)", async ({ request }) => {
    // Create a new BrandsApi with the admin token in the request headers
    const adminBrandsApi = new BrandsApi({
      ...request,
      async fetch(url, options: any = {}) {
        return request.fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            "Authorization": `Bearer ${adminToken}`,
          },
        });
      },
    });

    // First, create a brand to update
    const timestamp = Date.now();
    const newBrand = {
      name: `Test Brand for Update ${timestamp}`,
      slug: `test-brand-for-update-${timestamp}`,
    };

    const createResponse = await adminBrandsApi.createBrand(newBrand);
    expect(createResponse.ok()).toBeTruthy();
    const createdBrand = await createResponse.json();
    const brandId = createdBrand.id;

    // Now update the brand
    const updatedBrand = {
      name: `Updated Brand ${timestamp}`,
      slug: `updated-brand-${timestamp}`,
    };

    const updateResponse = await adminBrandsApi.updateBrand(
      brandId,
      updatedBrand
    );

    // Check that the update was successful
    expect(updateResponse.ok()).toBeTruthy();
    const updateResult = await updateResponse.json();
    expect(updateResult.success).toBeTruthy();

    // Verify the brand was actually updated by fetching it again
    const getResponse = await adminBrandsApi.getBrandById(brandId);
    expect(getResponse.ok()).toBeTruthy();

    const updatedBrandData = await getResponse.json();
    expect(updatedBrandData.name).toBe(updatedBrand.name);
    expect(updatedBrandData.slug).toBe(updatedBrand.slug);

    // Clean up - delete the brand
    await adminBrandsApi.deleteBrand(brandId);
  });

  test("should patch a brand (admin)", async ({ request }) => {
    // Create a new BrandsApi with the admin token in the request headers
    const adminBrandsApi = new BrandsApi({
      ...request,
      async fetch(url, options: any = {}) {
        return request.fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            "Authorization": `Bearer ${adminToken}`,
          },
        });
      },
    });

    // First, create a brand to patch
    const timestamp = Date.now();
    const newBrand = {
      name: `Test Brand for Patch ${timestamp}`,
      slug: `test-brand-for-patch-${timestamp}`,
    };

    const createResponse = await adminBrandsApi.createBrand(newBrand);
    expect(createResponse.ok()).toBeTruthy();
    const createdBrand = await createResponse.json();
    const brandId = createdBrand.id;

    // Patch just the name
    const patchData = {
      name: `Patched Brand ${timestamp}`,
    };

    const patchResponse = await adminBrandsApi.patchBrand(brandId, patchData);

    // Check that the patch was successful
    expect(patchResponse.ok()).toBeTruthy();
    const patchResult = await patchResponse.json();
    expect(patchResult.success).toBeTruthy();

    // Verify the brand was actually patched by fetching it again
    const getResponse = await adminBrandsApi.getBrandById(brandId);
    expect(getResponse.ok()).toBeTruthy();

    const patchedBrandData = await getResponse.json();
    expect(patchedBrandData.name).toBe(patchData.name);
    // Slug should remain unchanged
    expect(patchedBrandData.slug).toBe(newBrand.slug);

    // Clean up - delete the brand
    await adminBrandsApi.deleteBrand(brandId);
  });

  test("should delete a brand (admin)", async ({ request }) => {
    // Create a new BrandsApi with the admin token in the request headers
    const adminBrandsApi = new BrandsApi({
      ...request,
      async fetch(url, options: any = {}) {
        return request.fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            "Authorization": `Bearer ${adminToken}`,
          },
        });
      },
    });

    // First, create a brand to delete
    const timestamp = Date.now();
    const newBrand = {
      name: `Test Brand for Delete ${timestamp}`,
      slug: `test-brand-for-delete-${timestamp}`,
    };

    const createResponse = await adminBrandsApi.createBrand(newBrand);
    expect(createResponse.ok()).toBeTruthy();
    const createdBrand = await createResponse.json();
    const brandId = createdBrand.id;

    // Delete the brand
    const response = await adminBrandsApi.deleteBrand(brandId);
    expect(response.ok()).toBeTruthy();

    // Verify the brand is gone
    const brandsApi = new BrandsApi(request);
    const getResponse = await brandsApi.getBrandById(brandId);
    expect(getResponse.status()).toBe(404);
  });
});
