import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_BASE_URL } from "../utils/constants";

export class AuthAPI {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Logs in a user via the API.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The APIResponse object.
   */
  async login(email?: string, password?: string): Promise<APIResponse> {
    // Default to using environment variables if no arguments are passed
    const loginEmail = email ?? process.env.ADMIN_EMAIL;
    const loginPassword = password ?? process.env.ADMIN_PASSWORD;

    if (!loginEmail || !loginPassword) {
      throw new Error(
        "Login credentials not provided and not found in environment variables."
      );
    }

    const response = await this.request.post(`${API_BASE_URL}/users/login`, {
      data: {
        email: loginEmail,
        password: loginPassword,
      },
    });
    return response;
  }

  // Add other auth-related methods here (e.g., register, forgotPassword) as needed
}
