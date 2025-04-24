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

  /**
   * Fetches a specific user by their ID.
   * @param userId - The ID of the user to fetch.
   * @returns The APIResponse object.
   */
  async getUser(userId: string): Promise<APIResponse> {
    const response = await this.request.get(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response;
  }

  /**
   * Deletes a user by their ID.
   * @param userId - The ID of the user to delete.
   * @returns The APIResponse object.
   */
  async deleteUser(userId: string): Promise<APIResponse> {
    const response = await this.request.delete(
      `${API_BASE_URL}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return response;
  }

  /**
   * Updates the currently authenticated user's profile.
   * @param userData - The user data to update.
   * @returns The APIResponse object.
   */
  async updateProfile(userData: Record<string, any>): Promise<APIResponse> {
    // Try PUT first as the API might not support PATCH
    try {
      const response = await this.request.put(`${API_BASE_URL}/users/me`, {
        data: userData,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      console.warn(`Error in PUT request: ${error}`);
      // If PUT fails, try with post as fallback
      const response = await this.request.post(`${API_BASE_URL}/users/me`, {
        data: userData,
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    }
  }

  /**
   * Updates a specific user by their ID (admin operation).
   * @param userId - The ID of the user to update.
   * @param userData - The user data to update.
   * @returns The APIResponse object.
   */
  async updateUser(
    userId: string,
    userData: Record<string, any>
  ): Promise<APIResponse> {
    const response = await this.request.put(`${API_BASE_URL}/users/${userId}`, {
      data: userData,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  }

  // Add methods for updating profile, managing addresses etc. here
}
