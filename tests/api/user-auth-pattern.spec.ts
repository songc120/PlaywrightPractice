import { test, expect, APIRequestContext, request } from "@playwright/test";
import { AuthAPI } from "../../api/auth-api";
import { UsersAPI } from "../../api/users-api";
import { API_BASE_URL } from "../../utils/constants";

/**
 * Example test group demonstrating the create-test-delete pattern with proper error handling.
 * Creates a new test user before all tests, uses it in the tests, and cleans up afterward.
 */
test.describe("User Create-Test-Delete Pattern Example", () => {
  let authApi: AuthAPI;
  let testUserInfo: {
    userData: Record<string, any>;
    userId: string;
    token: string;
    cleanup: (customRequest?: APIRequestContext) => Promise<void>;
  };
  let testUserCreated = false;
  let apiContext: APIRequestContext;

  test.beforeAll(async () => {
    // Create API context that persists across tests
    apiContext = await request.newContext({
      baseURL: API_BASE_URL,
    });

    // Initialize API helper with this context
    authApi = new AuthAPI(apiContext);

    try {
      // Create a test user with the pattern
      testUserInfo = await authApi.createTestUser();
      testUserCreated = true;
    } catch (error) {
      console.warn(`Failed to set up test user: ${error}`);
      // Don't fail in beforeAll - let the tests handle it
    }
  });

  test("should login with test user credentials", async () => {
    // Skip test if user wasn't created
    test.skip(!testUserCreated, "Test user creation failed");

    // Use the shared API context
    const response = await authApi.login(
      testUserInfo.userData.email,
      testUserInfo.userData.password
    );

    await expect(
      response,
      "Login with created test user should succeed"
    ).toBeOK();
    expect(response.status(), "Status code should be 200").toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("access_token");
  });

  test("should fetch user profile for test user", async () => {
    // Skip test if user wasn't created
    test.skip(!testUserCreated, "Test user creation failed");

    // Create UsersAPI instance with the shared context
    const usersApi = new UsersAPI(apiContext, testUserInfo.token);

    // Fetch user profile
    const response = await usersApi.getProfile();

    await expect(
      response,
      "Profile fetch for test user should succeed"
    ).toBeOK();
    expect(response.status(), "Status code should be 200").toBe(200);

    // Verify profile data matches test user data
    const body = await response.json();
    expect(body.email).toBe(testUserInfo.userData.email);
    expect(body.first_name).toBe(testUserInfo.userData.first_name);
    expect(body.last_name).toBe(testUserInfo.userData.last_name);
  });

  test.afterAll(async () => {
    // Clean up the test user if it was created
    if (testUserCreated && testUserInfo) {
      try {
        await testUserInfo.cleanup(apiContext);
      } catch (error) {
        console.warn(`Failed to clean up test user: ${error}`);
      }
    }

    // Dispose of the API context
    await apiContext.dispose();
  });
});

/**
 * Example test group demonstrating working with multiple test users.
 * Creates multiple test users and verifies they are distinct.
 */
test.describe("Multiple Test Users Example", () => {
  let authApi: AuthAPI;
  let apiContext: APIRequestContext;
  let testUsers: Array<{
    userData: Record<string, any>;
    userId: string;
    token: string;
    cleanup: (customRequest?: APIRequestContext) => Promise<void>;
  }> = [];

  test.beforeAll(async () => {
    // Create API context that persists across tests
    apiContext = await request.newContext({
      baseURL: API_BASE_URL,
    });

    // Initialize API helper with this context
    authApi = new AuthAPI(apiContext);

    try {
      // Create first test user
      const timestamp1 = Date.now();
      const random1 = Math.random().toString(36).substring(2, 10);
      const user1 = await authApi.createTestUser({
        first_name: "User",
        last_name: "One",
        email: `user1_${timestamp1}_${random1}@example.com`,
        // No password - will use the secure generated one
      });
      testUsers.push(user1);

      // Create second test user
      const timestamp2 = Date.now() + 1; // Ensure different timestamp
      const random2 = Math.random().toString(36).substring(2, 10);
      const user2 = await authApi.createTestUser({
        first_name: "User",
        last_name: "Two",
        email: `user2_${timestamp2}_${random2}@example.com`,
        // No password - will use the secure generated one
      });
      testUsers.push(user2);
    } catch (error) {
      console.warn(`Failed to set up test users: ${error}`);
      // Continue to let tests decide if they should run
    }
  });

  test("should create multiple independent test users", async () => {
    // Skip if we don't have 2 users
    test.skip(testUsers.length < 2, "Failed to create both test users");

    // Verify both users exist with their own profiles
    for (const user of testUsers) {
      const usersApi = new UsersAPI(apiContext, user.token);
      const response = await usersApi.getProfile();

      await expect(response, "Profile fetch should succeed").toBeOK();
      const body = await response.json();

      expect(body.email).toBe(user.userData.email);
    }

    // Verify users are different
    expect(testUsers[0].userId).not.toBe(testUsers[1].userId);
    expect(testUsers[0].userData.email).not.toBe(testUsers[1].userData.email);
  });

  test.afterAll(async () => {
    // Clean up all test users
    for (const user of testUsers) {
      try {
        await user.cleanup(apiContext);
      } catch (error) {
        console.warn(`Failed to clean up test user: ${error}`);
      }
    }

    // Dispose of the API context
    await apiContext.dispose();
  });
});
