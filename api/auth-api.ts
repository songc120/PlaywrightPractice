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

  /**
   * Registers a new user via the API.
   * @param userData - An object containing user registration details (e.g., firstName, lastName, email, password, dob, address, phone, country, postcode).
   * @returns The APIResponse object.
   */
  async register(userData: Record<string, any>): Promise<APIResponse> {
    const response = await this.request.post(`${API_BASE_URL}/users/register`, {
      data: userData,
    });
    return response;
  }

  // Add other auth-related methods here (e.g., forgotPassword) as needed
}
