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
    // First get the user's ID from their profile
    const profileResponse = await this.getProfile();
    if (!profileResponse.ok()) {
      throw new Error(
        `Failed to get user profile: ${await profileResponse.text()}`
      );
    }

    const profile = await profileResponse.json();
    const userId = profile.id;

    if (!userId) {
      throw new Error("User ID not found in profile response");
    }

    // Now update using the user's ID
    const response = await this.request.put(`${API_BASE_URL}/users/${userId}`, {
      data: userData,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
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

  /**
   * Requests a password reset for a user.
   * @param email - The email of the user requesting a password reset.
   * @returns The APIResponse object.
   */
  async forgotPassword(email: string): Promise<APIResponse> {
    const response = await this.request.post(
      `${API_BASE_URL}/users/forgot-password`,
      {
        data: { email },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  }

  /**
   * Changes a user's password.
   * @param currentPassword - The user's current password.
   * @param newPassword - The user's new password.
   * @param confirmPassword - Confirmation of the new password (must match newPassword).
   * @returns The APIResponse object.
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<APIResponse> {
    const response = await this.request.post(
      `${API_BASE_URL}/users/change-password`,
      {
        data: {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        },
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  }

  /**
   * Logs out the current user, invalidating their token.
   * @returns The APIResponse object.
   */
  async logout(): Promise<APIResponse> {
    const response = await this.request.get(`${API_BASE_URL}/users/logout`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response;
  }

  /**
   * Refreshes the authentication token.
   * @returns The APIResponse object with a new token.
   */
  async refreshToken(): Promise<APIResponse> {
    const response = await this.request.get(`${API_BASE_URL}/users/refresh`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response;
  }

  /**
   * Lists all users (admin-only operation).
   * @param page - The page number for pagination (optional).
   * @param limit - The number of items per page (optional).
   * @returns The APIResponse object.
   */
  async listUsers(page?: number, limit?: number): Promise<APIResponse> {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append("page", page.toString());
    if (limit !== undefined) queryParams.append("limit", limit.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_BASE_URL}/users?${queryString}`
      : `${API_BASE_URL}/users`;

    const response = await this.request.get(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return response;
  }

  /**
   * Searches for users by name or city (admin-only operation).
   * @param query - The search query (name or city).
   * @param page - The page number for pagination (optional).
   * @param limit - The number of items per page (optional).
   * @returns The APIResponse object.
   */
  async searchUsers(
    query: string,
    page?: number,
    limit?: number
  ): Promise<APIResponse> {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("q", query);
    if (page !== undefined) queryParams.append("page", page.toString());
    if (limit !== undefined) queryParams.append("limit", limit.toString());

    const response = await this.request.get(
      `${API_BASE_URL}/users/search?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    return response;
  }

  // Add methods for updating profile, managing addresses etc. here
}
