import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_BASE_URL } from "../utils/constants";

/**
 * Represents the API helper for user-related endpoints (/users).
 */
export class UsersAPI {
  private request: APIRequestContext;
  private token: string;

  /**
   * Constructs the UsersAPI helper.
   * @param request - The Playwright APIRequestContext.
   * @param token - The authentication token for the logged-in user.
   */
  constructor(request: APIRequestContext, token: string) {
    if (!token) {
      throw new Error("Authentication token is required for UsersAPI");
    }
    this.request = request;
    this.token = token;
  }

  /**
   * Fetches the profile of the currently authenticated user.
   * @returns The APIResponse object.
   */
  async getProfile(): Promise<APIResponse> {
    const response = await this.request.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response;
  }

  // Add methods for updating profile, managing addresses etc. here
}
