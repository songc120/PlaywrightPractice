import { test, expect } from "@playwright/test";
import { AuthAPI } from "../../api/auth-api";
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

// Helper function/structure to generate unique user data (snake_case)
const generateUniqueUserData = () => {
  const timestamp = Date.now();
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
    email: `testuser_${timestamp}@example.com`, // Keep unique email generation
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
    // Adjust based on the actual API response structure
    const responseBody = await response.json();
    // Check for key fields returned in the 201 response
    expect(responseBody, "Response should contain user ID").toHaveProperty(
      "id"
    );
    expect(typeof responseBody.id).toBe("string");
    expect(responseBody, "Response should contain email").toHaveProperty(
      "email",
      userData.email
    );
    expect(responseBody, "Response should contain first_name").toHaveProperty(
      "first_name",
      userData.first_name
    );
    expect(responseBody, "Response should contain last_name").toHaveProperty(
      "last_name",
      userData.last_name
    );
    expect(
      responseBody,
      "Response should contain address object"
    ).toHaveProperty("address");
    expect(
      responseBody.address,
      "Address object should contain street"
    ).toHaveProperty("street", userData.address.street);
    // Add more checks for other fields like phone, dob, country etc. if needed
  });

  test("should fail to register with duplicate email", async () => {
    // 1. Register a user successfully first
    const userData = generateUniqueUserData();
    const firstResponse = await authApi.register(userData);
    await expect(firstResponse, "Initial registration should succeed").toBeOK();
    expect(
      firstResponse.status(),
      "Initial registration status should be 201"
    ).toBe(201);

    // 2. Attempt to register again with the exact same email
    const secondResponse = await authApi.register(userData);

    // 3. Assert the second attempt fails
    await expect(
      secondResponse,
      "Duplicate registration attempt should fail"
    ).not.toBeOK();

    // Assert specific status code (e.g., 409 Conflict or 400 Bad Request)
    // Let's assume 409 for duplicate data conflict
    expect(
      secondResponse.status(),
      "Status code should be 422 for duplicate email"
    ).toBe(422);

    // Optional: Assert specific error message about duplicate email
    // const responseBody = await secondResponse.json();
    // await expect(responseBody).toHaveProperty("error");
    // expect(responseBody.error).toContain("already exists"); // Adjust message
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
