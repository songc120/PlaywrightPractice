import { test, expect } from "@playwright/test";
import { AuthAPI } from "../../api/auth-api";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../../utils/constants";

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

  // Add more authentication tests here:
  // - Login with invalid credentials
  // - Login with missing email/password
  // - Test other user roles (e.g., USER1)
  // - Test registration endpoint (if applicable)
});
