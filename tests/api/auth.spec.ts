import { test, expect } from "@playwright/test";
import { AuthAPI } from "../../api/auth-api";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  USER1_EMAIL,
  USER1_PASSWORD,
  NOT_USER_EMAIL,
  NOT_USER_PASSWORD,
  INVALID_PASSWORD, // Assuming you have a constant for an intentionally wrong password
  INVALID_EMAIL, // Add import for invalid email constant
  API_BASE_URL, // Import API_BASE_URL
} from "../../utils/constants";

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

  // Add more authentication tests here:
  // - Test registration endpoint (if applicable)
});
