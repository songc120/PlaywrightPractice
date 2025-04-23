import { test, expect } from "@playwright/test";
import { AuthAPI } from "../../api/auth-api";
import { UsersAPI } from "../../api/users-api";
import {
  USER1_EMAIL,
  USER1_PASSWORD,
  // We might need USER1's first/last name from constants if they exist
  // Or we rely on the profile response structure directly
} from "../../utils/constants";

let token: string;
let usersApi: UsersAPI;

// Run login once before all tests in this file
test.beforeAll(async ({ request }) => {
  const authApi = new AuthAPI(request);
  const response = await authApi.login(USER1_EMAIL, USER1_PASSWORD);
  expect(response.ok(), "Login failed").toBeTruthy();
  const responseBody = await response.json();
  token = responseBody.access_token;
  expect(token, "Access token not found in login response").toBeTruthy();

  // Instantiate UsersAPI once with the token for all tests in this file
  // REMOVED from here: usersApi = new UsersAPI(request, token);
});

// Instantiate UsersAPI before each test using the test-scoped request
test.beforeEach(({ request }) => {
  expect(token, "Token must be available from beforeAll hook").toBeTruthy(); // Sanity check
  usersApi = new UsersAPI(request, token);
});

test.describe("User Profile API", () => {
  test("should fetch the logged-in user's profile", async () => {
    const response = await usersApi.getProfile();

    // Assert response status is OK
    await expect(response, "Get profile API call should succeed").toBeOK();
    expect(response.status(), "Status code should be 200").toBe(200);

    // Assert response body contains expected user details
    const profileData = await response.json();
    expect(profileData, "Profile data should contain user ID").toHaveProperty(
      "id"
    );
    expect(typeof profileData.id).toBe("string");
    expect(
      profileData,
      "Profile data should contain correct email"
    ).toHaveProperty("email", USER1_EMAIL);
    // Add checks for other expected fields like first_name, last_name, address etc.
    expect(profileData).toHaveProperty("first_name");
    expect(profileData).toHaveProperty("last_name");
    expect(profileData).toHaveProperty("address");
    expect(profileData.address).toHaveProperty("street");
  });

  // Add tests for updating profile here
});

// Add test.describe block for Address Management here
