/**
 * Categories API module for interacting with category-related endpoints.
 * Handles listing, searching, creating, updating, and deleting categories.
 */
import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../utils/constants";

export class CategoriesApi {
  private request: APIRequestContext;

  /**
   * Creates an instance of CategoriesApi.
   * @param request The Playwright APIRequestContext to use for API calls
   */
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Gets a list of categories
   * @returns API response with category list
   */
  async getCategories() {
    const response = await this.request.get(`${API_BASE_URL}/categories`);
    return response;
  }

  /**
   * Gets a tree structure of categories
   * @returns API response with category tree
   */
  async getCategoriesTree() {
    const response = await this.request.get(`${API_BASE_URL}/categories/tree`);
    return response;
  }

  /**
   * Searches for categories by query string
   * @param query The search query string
   * @returns API response with search results
   */
  async searchCategories(query: string) {
    const response = await this.request.get(
      `${API_BASE_URL}/categories/search`,
      {
        params: { query },
      }
    );
    return response;
  }

  /**
   * Gets a specific category by ID
   * @param categoryId The ID of the category to retrieve
   * @returns API response with category details
   */
  async getCategoryById(categoryId: string) {
    const response = await this.request.get(
      `${API_BASE_URL}/categories/${categoryId}`
    );
    return response;
  }

  /**
   * Creates a new category (Admin only)
   * @param categoryData The category data to create
   * @returns API response with created category details
   */
  async createCategory(categoryData: {
    name: string;
    slug: string;
    description?: string;
    parent_id?: string;
  }) {
    const response = await this.request.post(`${API_BASE_URL}/categories`, {
      data: categoryData,
    });
    return response;
  }

  /**
   * Updates a category (Admin only)
   * @param categoryId The ID of the category to update
   * @param categoryData The updated category data
   * @returns API response with updated category details
   */
  async updateCategory(
    categoryId: string,
    categoryData: {
      name?: string;
      slug?: string;
      description?: string;
      parent_id?: string;
    }
  ) {
    const response = await this.request.put(
      `${API_BASE_URL}/categories/${categoryId}`,
      {
        data: categoryData,
      }
    );
    return response;
  }

  /**
   * Partially updates a category (Admin only)
   * @param categoryId The ID of the category to update
   * @param categoryData The partial category data to update
   * @returns API response with updated category details
   */
  async patchCategory(
    categoryId: string,
    categoryData: {
      name?: string;
      slug?: string;
      description?: string;
      parent_id?: string;
    }
  ) {
    const response = await this.request.patch(
      `${API_BASE_URL}/categories/${categoryId}`,
      {
        data: categoryData,
      }
    );
    return response;
  }

  /**
   * Deletes a category (Admin only)
   * @param categoryId The ID of the category to delete
   * @returns API response
   */
  async deleteCategory(categoryId: string) {
    const response = await this.request.delete(
      `${API_BASE_URL}/categories/${categoryId}`
    );
    return response;
  }
}
