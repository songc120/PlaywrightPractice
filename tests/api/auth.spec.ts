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

  // Add more authentication tests here:
  // - Login with missing email/password
  // - Test registration endpoint (if applicable)
});
