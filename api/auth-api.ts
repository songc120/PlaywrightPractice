import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_BASE_URL } from "../utils/constants";
import { UsersAPI } from "./users-api";

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

  /**
   * Creates a temporary test user, returns their credentials and a cleanup function.
   * This implements the create-test-delete pattern in a reusable way.
   *
   * @param userData - Optional custom user data. If not provided, generates random user data.
   * @param adminEmail - Admin email for cleanup (defaults to env var).
   * @param adminPassword - Admin password for cleanup (defaults to env var).
   * @returns Object containing credentials, userId, token, and a cleanup function.
   */
  async createTestUser(
    userData?: Record<string, any>,
    adminEmail?: string,
    adminPassword?: string
  ): Promise<{
    userData: Record<string, any>;
    userId: string;
    token: string;
    cleanup: (customRequest?: APIRequestContext) => Promise<void>;
  }> {
    // Generate a unique, secure password that won't be flagged as leaked
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 12);
    const securePassword = `Secure$${timestamp}${randomSuffix}!2Abx`;

    // Use provided user data or generate random data with unique email
    const testUserData = userData || {
      first_name: "Test",
      last_name: `User-${timestamp}`,
      email: `testuser_${timestamp}_${randomSuffix}@example.com`,
      password: securePassword,
      dob: "1990-01-01",
      phone: "1234567890",
    };

    // If user data is provided but no password, set our secure password
    if (userData && !userData.password) {
      testUserData.password = securePassword;
    }

    // Register the user
    const registerResponse = await this.register(testUserData);
    if (!registerResponse.ok()) {
      throw new Error(
        `Failed to create test user: ${await registerResponse.text()}`
      );
    }

    // Extract user ID
    const registerBody = await registerResponse.json();
    const userId = registerBody.id; // Adjust based on actual API response

    // Login to get token
    const loginResponse = await this.login(
      testUserData.email,
      testUserData.password
    );
    if (!loginResponse.ok()) {
      throw new Error(
        `Failed to login as test user: ${await loginResponse.text()}`
      );
    }

    // Extract token
    const loginBody = await loginResponse.json();
    const token = loginBody.access_token;

    // Create cleanup function
    const cleanup = async (
      customRequest?: APIRequestContext
    ): Promise<void> => {
      try {
        // Use the provided request context or the instance one
        const requestContext = customRequest || this.request;

        // Login as admin
        const adminLoginResponse = await requestContext.post(
          `${API_BASE_URL}/users/login`,
          {
            data: {
              email: adminEmail || process.env.ADMIN_EMAIL,
              password: adminPassword || process.env.ADMIN_PASSWORD,
            },
          }
        );

        if (adminLoginResponse.ok()) {
          const adminLoginBody = await adminLoginResponse.json();
          const adminToken = adminLoginBody.access_token;

          // Delete the test user
          const deleteResponse = await requestContext.delete(
            `${API_BASE_URL}/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${adminToken}`,
              },
            }
          );

          if (!deleteResponse.ok()) {
            console.warn(
              `Failed to delete test user: ${await deleteResponse.text()}`
            );
          }
        } else {
          console.warn("Failed to login as admin for test user cleanup");
        }
      } catch (error) {
        console.warn("Failed to clean up test user:", error);
      }
    };

    // Return user data, ID, token, and cleanup function
    return {
      userData: testUserData,
      userId,
      token,
      cleanup,
    };
  }

  // Add other auth-related methods here (e.g., forgotPassword) as needed
}
