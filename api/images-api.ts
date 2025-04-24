/**
 * Images API module for interacting with image-related endpoints.
 * Handles listing and managing images.
 */
import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../utils/constants";

export class ImagesApi {
  private request: APIRequestContext;

  /**
   * Creates an instance of ImagesApi.
   * @param request The Playwright APIRequestContext to use for API calls
   */
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Gets a list of images
   * @returns API response with image list
   */
  async getImages() {
    const response = await this.request.fetch(`${API_BASE_URL}/images`, {
      method: "GET",
    });
    return response;
  }
}
