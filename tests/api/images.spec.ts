import { test, expect } from "@playwright/test";
import { ImagesApi } from "../../api/images-api";
import { AuthAPI } from "../../api/auth-api";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  API_BASE_URL,
} from "../../utils/constants";

let imagesApi: ImagesApi;
let authApi: AuthAPI;
let adminToken: string;

test.describe("Images API Tests", () => {
  test.beforeAll(async ({ request }) => {
    // Initialize API helpers
    imagesApi = new ImagesApi(request);
    authApi = new AuthAPI(request);

    // Login as admin to get token for admin-only operations
    const loginResponse = await authApi.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    expect(loginResponse.ok()).toBeTruthy();
    const loginData = await loginResponse.json();
    adminToken = loginData.access_token;
  });

  test("should get a list of images", async ({ request }) => {
    // Get the images with admin token
    const response = await request.fetch(`${API_BASE_URL}/images`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${adminToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const images = await response.json();
    expect(Array.isArray(images)).toBeTruthy();
  });
});
