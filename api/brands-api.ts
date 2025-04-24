/**
 * Brands API module for interacting with brand-related endpoints.
 * Handles listing, searching, creating, updating, and deleting brands.
 */
import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_BASE_URL } from "../utils/constants";

/**
 * Type for custom request object with fetch method
 */
type CustomRequest = {
  fetch: (url: string, options?: any) => Promise<APIResponse>;
};

export class BrandsApi {
  private request: APIRequestContext | CustomRequest;

  /**
   * Creates an instance of BrandsApi.
   * @param request The Playwright APIRequestContext or custom request object to use for API calls
   */
  constructor(request: APIRequestContext | CustomRequest) {
    this.request = request;
  }

  /**
   * Gets a list of brands
   * @returns API response with brand list
   */
  async getBrands(): Promise<APIResponse> {
    if ("fetch" in this.request) {
      return this.request.fetch(`${API_BASE_URL}/brands`);
    } else {
      return (this.request as APIRequestContext).get(`${API_BASE_URL}/brands`);
    }
  }

  /**
   * Searches for brands by query string
   * @param query The search query string
   * @returns API response with search results
   */
  async searchBrands(query: string): Promise<APIResponse> {
    if ("fetch" in this.request) {
      return this.request.fetch(
        `${API_BASE_URL}/brands/search?query=${encodeURIComponent(query)}`
      );
    } else {
      return (this.request as APIRequestContext).get(
        `${API_BASE_URL}/brands/search`,
        {
          params: { query },
        }
      );
    }
  }

  /**
   * Gets a specific brand by ID
   * @param brandId The ID of the brand to retrieve
   * @returns API response with brand details
   */
  async getBrandById(brandId: string): Promise<APIResponse> {
    if ("fetch" in this.request) {
      return this.request.fetch(`${API_BASE_URL}/brands/${brandId}`);
    } else {
      return (this.request as APIRequestContext).get(
        `${API_BASE_URL}/brands/${brandId}`
      );
    }
  }

  /**
   * Creates a new brand (Admin only)
   * @param brandData The brand data to create
   * @returns API response with created brand details
   */
  async createBrand(brandData: {
    name: string;
    slug: string;
  }): Promise<APIResponse> {
    if ("fetch" in this.request) {
      return this.request.fetch(`${API_BASE_URL}/brands`, {
        method: "POST",
        data: brandData,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return (this.request as APIRequestContext).post(
        `${API_BASE_URL}/brands`,
        {
          data: brandData,
        }
      );
    }
  }

  /**
   * Updates a brand (Admin only)
   * @param brandId The ID of the brand to update
   * @param brandData The updated brand data
   * @returns API response with updated brand details
   */
  async updateBrand(
    brandId: string,
    brandData: {
      name?: string;
      slug?: string;
    }
  ): Promise<APIResponse> {
    if ("fetch" in this.request) {
      return this.request.fetch(`${API_BASE_URL}/brands/${brandId}`, {
        method: "PUT",
        data: brandData,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return (this.request as APIRequestContext).put(
        `${API_BASE_URL}/brands/${brandId}`,
        {
          data: brandData,
        }
      );
    }
  }

  /**
   * Partially updates a brand (Admin only)
   * @param brandId The ID of the brand to update
   * @param brandData The partial brand data to update
   * @returns API response with updated brand details
   */
  async patchBrand(
    brandId: string,
    brandData: {
      name?: string;
      slug?: string;
    }
  ): Promise<APIResponse> {
    if ("fetch" in this.request) {
      return this.request.fetch(`${API_BASE_URL}/brands/${brandId}`, {
        method: "PATCH",
        data: brandData,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return (this.request as APIRequestContext).patch(
        `${API_BASE_URL}/brands/${brandId}`,
        {
          data: brandData,
        }
      );
    }
  }

  /**
   * Deletes a brand (Admin only)
   * @param brandId The ID of the brand to delete
   * @returns API response
   */
  async deleteBrand(brandId: string): Promise<APIResponse> {
    if ("fetch" in this.request) {
      return this.request.fetch(`${API_BASE_URL}/brands/${brandId}`, {
        method: "DELETE",
      });
    } else {
      return (this.request as APIRequestContext).delete(
        `${API_BASE_URL}/brands/${brandId}`
      );
    }
  }
}
