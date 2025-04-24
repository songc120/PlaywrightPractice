/**
 * Products API module for interacting with product-related endpoints.
 * Handles listing, searching, creating, updating, and deleting products.
 */
import { APIRequestContext, expect } from "@playwright/test";
import { API_BASE_URL } from "../utils/constants";

export class ProductsApi {
  private request: APIRequestContext;

  /**
   * Creates an instance of ProductsApi.
   * @param request The Playwright APIRequestContext to use for API calls
   */
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Gets a list of products with optional filtering parameters
   * @param params Optional query parameters for filtering and pagination
   * @returns API response with product list
   */
  async getProducts(params?: {
    by_brand?: string;
    by_category?: string;
    is_rental?: boolean;
    between?: string; // Format: 'min,max' for price range
    sort?: string;
    page?: number;
  }) {
    const response = await this.request.get(`${API_BASE_URL}/products`, {
      params: params || {},
    });
    return response;
  }

  /**
   * Searches for products by query string
   * @param query The search query string
   * @returns API response with search results
   */
  async searchProducts(query: string) {
    const response = await this.request.get(`${API_BASE_URL}/products/search`, {
      params: { query },
    });
    return response;
  }

  /**
   * Gets a specific product by ID
   * @param productId The ID of the product to retrieve
   * @returns API response with product details
   */
  async getProductById(productId: string) {
    const response = await this.request.get(
      `${API_BASE_URL}/products/${productId}`
    );
    return response;
  }

  /**
   * Creates a new product (Admin only)
   * @param productData The product data to create
   * @returns API response with created product details
   */
  async createProduct(productData: {
    name: string;
    description: string;
    price: number;
    category_id: string;
    brand_id: string;
    is_rental?: boolean;
    product_image_id?: string;
  }) {
    const response = await this.request.post(`${API_BASE_URL}/products`, {
      data: productData,
    });
    return response;
  }

  /**
   * Updates a product (Admin only)
   * @param productId The ID of the product to update
   * @param productData The updated product data
   * @returns API response with updated product details
   */
  async updateProduct(
    productId: string,
    productData: {
      name?: string;
      description?: string;
      price?: number;
      category_id?: string;
      brand_id?: string;
      is_rental?: boolean;
      product_image_id?: string;
    }
  ) {
    const response = await this.request.put(
      `${API_BASE_URL}/products/${productId}`,
      {
        data: productData,
      }
    );
    return response;
  }

  /**
   * Partially updates a product (Admin only)
   * @param productId The ID of the product to update
   * @param productData The partial product data to update
   * @returns API response with updated product details
   */
  async patchProduct(
    productId: string,
    productData: {
      name?: string;
      description?: string;
      price?: number;
      category_id?: string;
      brand_id?: string;
      is_rental?: boolean;
      product_image_id?: string;
    }
  ) {
    const response = await this.request.patch(
      `${API_BASE_URL}/products/${productId}`,
      {
        data: productData,
      }
    );
    return response;
  }

  /**
   * Deletes a product (Admin only)
   * @param productId The ID of the product to delete
   * @returns API response
   */
  async deleteProduct(productId: string) {
    const response = await this.request.delete(
      `${API_BASE_URL}/products/${productId}`
    );
    return response;
  }

  /**
   * Gets related products for a specific product
   * @param productId The ID of the product to get related products for
   * @returns API response with related products
   */
  async getRelatedProducts(productId: string) {
    const response = await this.request.get(
      `${API_BASE_URL}/products/${productId}/related`
    );
    return response;
  }
}
