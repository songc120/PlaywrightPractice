import { test, expect } from "@playwright/test";
import { AuthAPI } from "../../api/auth-api";
import { UsersAPI } from "../../api/users-api";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  USER1_EMAIL,
  USER1_PASSWORD,
  VALID_REGISTRATION_PASSWORD, // Import the new constant
  NOT_USER_EMAIL,
  NOT_USER_PASSWORD,
  INVALID_PASSWORD, // Assuming you have a constant for an intentionally wrong password
  INVALID_REGISTRATION_PASSWORD, // Import the weak password constant
  INVALID_EMAIL, // Add import for invalid email constant
  API_BASE_URL, // Import API_BASE_URL
  MOCK_ADDRESS, // Import mock address
} from "../../utils/constants";
import { APIResponse } from "@playwright/test"; // Import APIResponse if needed for type hints
import { APIRequestContext, request } from "@playwright/test"; // Import APIRequestContext and request for new context management

// Helper function/structure to generate unique user data (snake_case)
const generateUniqueUserData = () => {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 12);
  return {
    first_name: "Test", // snake_case
    last_name: `User-${timestamp}`, // snake_case
    address: {
      street: MOCK_ADDRESS.street,
      city: MOCK_ADDRESS.city,
      state: MOCK_ADDRESS.state,
      country: MOCK_ADDRESS.country,
      postal_code: MOCK_ADDRESS.postalCode, // snake_case
    },
    phone: "1234567890", // Example Phone
    dob: "1990-01-01", // Example Date of Birth
    password: VALID_REGISTRATION_PASSWORD, // Use the valid registration password
    email: `testuser_${timestamp}_${randomSuffix}@example.com`, // Ensure unique email
  };
};

test.describe("Authentication API", () => {
  let authApi: AuthAPI;

  test.beforeEach(({ request }) => {
    authApi = new AuthAPI(request);
  });

  test("should successfully login with valid admin credentials", async () => {
    const response = await authApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);

    // Assert response status is OK (200-299)
    await expect(response, "Login API call should succeed").toBeOK();

    // Assert specific status code is 200
    expect(response.status(), "Status code should be 200").toBe(200);

    // Assert response body contains an access token
    const responseBody = await response.json();
    await expect(
      responseBody,
      "Response body should contain access_token"
    ).toHaveProperty("access_token");
    expect(typeof responseBody.access_token).toBe("string");
    expect(responseBody.access_token.length).toBeGreaterThan(0);
  });

  test("should successfully login with valid regular user credentials", async () => {
    const response = await authApi.login(USER1_EMAIL, USER1_PASSWORD);

    // Assert response status is OK (200-299)
    await expect(
      response,
      "Regular user login API call should succeed"
    ).toBeOK();

    // Assert specific status code is 200
    expect(response.status(), "Status code should be 200").toBe(200);

    // Assert response body contains an access token
    const responseBody = await response.json();
    await expect(
      responseBody,
      "Response body should contain access_token"
    ).toHaveProperty("access_token");
    expect(typeof responseBody.access_token).toBe("string");
    expect(responseBody.access_token.length).toBeGreaterThan(0);
  });

  test("should fail to login with invalid password", async () => {
    const response = await authApi.login(ADMIN_EMAIL, INVALID_PASSWORD);

    // Assert response status is not OK
    await expect(response, "Login API call should fail").not.toBeOK();

    // Assert specific status code is 401 Unauthorized
    expect(response.status(), "Status code should be 401").toBe(401);

    // Optional: Assert error message in response body
    // const responseBody = await response.json();
    // await expect(responseBody, "Response body should contain error").toHaveProperty("error");
    // expect(responseBody.error).toContain("Invalid credentials"); // Adjust based on actual API response
  });

  test("should fail to login with non-existent user", async () => {
    const response = await authApi.login(NOT_USER_EMAIL, NOT_USER_PASSWORD);

    // Assert response status is not OK
    await expect(response, "Login API call should fail").not.toBeOK();

    // Assert specific status code is 401 Unauthorized (or possibly 404 Not Found, adjust as needed)
    expect(response.status(), "Status code should be 401").toBe(401);

    // Optional: Assert error message in response body
    // const responseBody = await response.json();
    // await expect(responseBody, "Response body should contain error").toHaveProperty("error");
    // expect(responseBody.error).toContain("User not found"); // Adjust based on actual API response
  });

  test("should fail to login with invalid email format", async () => {
    const response = await authApi.login(INVALID_EMAIL, ADMIN_PASSWORD); // Use a valid password here

    // Assert response status is not OK
    await expect(
      response,
      "Login API call should fail with invalid email format"
    ).not.toBeOK();

    // Assert specific status code - often 400 Bad Request or 422 Unprocessable Entity for validation errors
    // Let's assume 400 for now, adjust based on actual API behavior
    expect(
      response.status(),
      "Status code should be 401 for invalid email format"
    ).toBe(401);

    // Optional: Assert specific error message related to email format
    // const responseBody = await response.json();
    // await expect(responseBody, "Response body should contain validation error").toHaveProperty("error");
    // expect(responseBody.error).toContain("email must be a valid email"); // Adjust based on actual API response
  });

  test("should fail to login with missing email", async ({ request }) => {
    // Test sending an empty string for email directly to the API
    const response = await request.post(`${API_BASE_URL}/users/login`, {
      data: {
        email: "",
        password: ADMIN_PASSWORD, // Use a valid password
      },
      failOnStatusCode: false, // Prevent Playwright from throwing on 4xx/5xx
    });

    // Assert response status is not OK
    await expect(
      response,
      "Login API call should fail with missing email"
    ).not.toBeOK();

    // Assert specific status code (e.g., 400 Bad Request or 422 Unprocessable Entity)
    // Assuming 401 based on previous findings for validation issues, adjust if needed.
    expect(
      response.status(),
      "Status code should be 401 for missing email"
    ).toBe(401);
  });

  test("should fail to login with missing password", async ({ request }) => {
    // Test sending an empty string for the password directly to the API
    const response = await request.post(`${API_BASE_URL}/users/login`, {
      data: {
        email: ADMIN_EMAIL, // Use a valid email
        password: "",
      },
      failOnStatusCode: false, // Prevent Playwright from throwing on 4xx/5xx
    });

    // Assert response status is not OK
    await expect(
      response,
      "Login API call should fail with missing password"
    ).not.toBeOK();

    // Assert specific status code (e.g., 400 Bad Request or 422 Unprocessable Entity)
    // Assuming 401 based on previous findings for validation issues, adjust if needed.
    expect(
      response.status(),
      "Status code should be 401 for missing password"
    ).toBe(401);
  });

  // --- Registration Tests ---

  test("should successfully register a new user", async () => {
    const userData = generateUniqueUserData();
    const response = await authApi.register(userData);

    // Assert response status is 201 Created
    await expect(response, "Registration API call should succeed").toBeOK(); // Checks 2xx
    expect(response.status(), "Status code should be 201").toBe(201);

    // Assert response body contains success message or user details
    const responseBody = await response.json();
    await expect(
      responseBody,
      "Response body should contain user ID"
    ).toHaveProperty("id");
    expect(typeof responseBody.id).toBe("string");

    // Clean up created user (if the API allows deletion without admin access)
    // If not, consider using authApi.createTestUser() pattern for a cleaner approach
  });

  test("should fail to register with duplicate email", async () => {
    // First, create a unique user
    const userData = generateUniqueUserData();
    const firstResponse = await authApi.register(userData);
    await expect(firstResponse, "First registration should succeed").toBeOK();

    // Now try to register the same email again
    const duplicateData = {
      ...generateUniqueUserData(), // Generate new data for other fields
      email: userData.email, // But use the same email
    };

    const response = await authApi.register(duplicateData);

    // Assert response status is not OK
    await expect(
      response,
      "Registration with duplicate email should fail"
    ).not.toBeOK();

    // Assert specific status code - typically 409 Conflict for duplicate resources
    expect(
      response.status(),
      "Status code should be 422 for duplicate email"
    ).toBe(422);

    // Optional: Assert error message in response body
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("email");
    expect(Array.isArray(responseBody.email)).toBe(true);
    expect(responseBody.email[0]).toContain("already exists");

    // Clean up the created user using admin credentials (if possible)
    // This would require admin login, which would be better handled with the createTestUser pattern
  });

  test("should fail to register with invalid data (e.g., missing required field)", async () => {
    const baseUserData = generateUniqueUserData();
    // Create a new object *without* the required field (e.g., firstName)
    const { first_name, ...invalidUserData } = baseUserData;

    // console.log('Sending invalid user data:', invalidUserData); // Debug log

    const response = await authApi.register(invalidUserData);

    // Assert the attempt fails
    await expect(
      response,
      "Registration with invalid data should fail"
    ).not.toBeOK();

    // Assert specific status code (e.g., 400 Bad Request or 422 Unprocessable Entity for validation)
    // Let's assume 400 for now
    expect(
      response.status(),
      "Status code should be 422 for invalid/missing data"
    ).toBe(422);

    // Optional: Assert specific error message about the missing field
    // const responseBody = await response.json();
    // await expect(responseBody).toHaveProperty("error");
    // expect(responseBody.error).toContain("firstName is required"); // Adjust message
  });

  test("should fail to register with invalid password (weak)", async () => {
    const userData = generateUniqueUserData();
    // Override the password with the weak one
    userData.password = INVALID_REGISTRATION_PASSWORD;

    const response = await authApi.register(userData);

    // Assert the attempt fails
    await expect(
      response,
      "Registration with weak password should fail"
    ).not.toBeOK();

    // Assert specific status code (expecting 422 based on previous validation errors)
    expect(
      response.status(),
      "Status code should be 422 for weak password"
    ).toBe(422);

    // Optional: Assert specific error message about password complexity
    // const responseBody = await response.json();
    // await expect(responseBody).toHaveProperty("password");
    // expect(responseBody.password).toEqual(expect.arrayContaining([
    //   expect.stringContaining("uppercase"),
    //   expect.stringContaining("lowercase"),
    //   expect.stringContaining("symbol"),
    //   expect.stringContaining("number"),
    // ])); // Adjust based on exact error messages
  });

  // Add more authentication tests here:
  // - Registration attempt with invalid data
});

// Add new test group for the user creation, test, delete pattern
test.describe("Create-Test-Delete Authentication Pattern", () => {
  let authApi: AuthAPI;
  let testUser: any;
  let userId: string;
  let userToken: string;
  let apiContext: APIRequestContext;

  test.beforeAll(async () => {
    // Create API context that persists across tests
    apiContext = await request.newContext({
      baseURL: API_BASE_URL,
    });

    // Initialize API helper with this context
    authApi = new AuthAPI(apiContext);

    // Create a test user
    testUser = generateUniqueUserData();
    const registerResponse = await authApi.register(testUser);
    expect(registerResponse.status(), "User registration should succeed").toBe(
      201
    );

    // Extract user ID from the registration response if available
    const registerBody = await registerResponse.json();
    userId = registerBody.id; // Adjust field name based on actual API response

    // Log in with the new user to get a token
    const loginResponse = await authApi.login(
      testUser.email,
      testUser.password
    );
    expect(loginResponse.status(), "Login with new user should succeed").toBe(
      200
    );

    // Extract token from login response
    const loginBody = await loginResponse.json();
    userToken = loginBody.access_token;
  });

  test("should login with newly created user credentials", async () => {
    // Test login with the newly created user - using the shared context
    const response = await authApi.login(testUser.email, testUser.password);

    // Assert successful login
    await expect(response, "Login with new user should succeed").toBeOK();
    expect(response.status(), "Status code should be 200").toBe(200);

    // Verify response has token
    const responseBody = await response.json();
    await expect(
      responseBody,
      "Response should have access token"
    ).toHaveProperty("access_token");
  });

  test("should fetch user profile for newly created user", async () => {
    // Create UsersAPI with the token from the new user and shared context
    const usersApi = new UsersAPI(apiContext, userToken);

    // Fetch user profile
    const profileResponse = await usersApi.getProfile();

    // Assert successful profile fetch
    await expect(profileResponse, "Profile fetch should succeed").toBeOK();
    expect(profileResponse.status(), "Status code should be 200").toBe(200);

    // Verify profile data matches registration data
    const profileBody = await profileResponse.json();
    expect(profileBody.email).toBe(testUser.email);
    expect(profileBody.first_name).toBe(testUser.first_name);
    expect(profileBody.last_name).toBe(testUser.last_name);
  });

  test.afterAll(async () => {
    // Get admin token to delete the user - using the shared context
    const adminLoginResponse = await authApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    const adminBody = await adminLoginResponse.json();
    const adminToken = adminBody.access_token;

    // Initialize UsersAPI with admin token and shared context
    const usersApi = new UsersAPI(apiContext, adminToken);

    // Delete the test user
    if (userId) {
      const deleteResponse = await usersApi.deleteUser(userId);
      expect(
        deleteResponse.status(),
        "User deletion should succeed"
      ).toBeLessThan(400);
    } else {
      console.warn("Could not delete test user: user ID not found");
    }

    // Dispose of the API context
    await apiContext.dispose();
  });
});
