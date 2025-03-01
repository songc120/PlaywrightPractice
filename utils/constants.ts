/**
 * Constants module for managing environment variables used in testing.
 * Loads environment variables from .env file and provides typed access to them.
 */
import dotenv from "dotenv";
dotenv.config();

/** Admin user email from environment variables */
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

/** Admin user password from environment variables */
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

/** First test user email from environment variables */
export const USER1_EMAIL = process.env.USER1_EMAIL || "";

/** First test user password from environment variables */
export const USER1_PASSWORD = process.env.USER1_PASSWORD || "";

/** Second test user email from environment variables */
export const USER2_EMAIL = process.env.USER2_EMAIL || "";

/** Second test user password from environment variables */
export const USER2_PASSWORD = process.env.USER2_EMAIL || "";

/** Non-existent user email for negative testing */
export const NOT_USER_EMAIL = process.env.NOT_USER_EMAIL || "";

/** Non-existent user password for negative testing */
export const NOT_USER_PASSWORD = process.env.NOT_USER_PASSWORD || "";

/** Invalid format email for validation testing */
export const INVALID_EMAIL = process.env.INVALID_EMAIL || "";

/** Invalid format password for validation testing */
export const INVALID_PASSWORD = process.env.INVALID_PASSWORD || "";

/** Mock address for testing from environment variables */
export const MOCK_ADDRESS = {
  street: process.env.MOCK_STREET || "123 Test Street",
  city: process.env.MOCK_CITY || "Test City",
  state: process.env.MOCK_STATE || "Test State",
  country: process.env.MOCK_COUNTRY || "Test Country",
  postalCode: process.env.MOCK_POSTAL_CODE || "12345",
} as const;

/** Mock credit card details for testing */
export const MOCK_CREDIT_CARD = {
  number: process.env.MOCK_CARD_NUMBER || "4532-7153-3790-4666",
  expiryDate: process.env.MOCK_CARD_EXPIRY || "12/2025",
  cvv: process.env.MOCK_CARD_CVV || "123",
  holderName: process.env.MOCK_CARD_HOLDER || "Jane Doe",
} as const;

/** Invalid credit card for testing error messages */
export const INVALID_CREDIT_CARD = {
  number: process.env.INVALID_CARD_NUMBER || "1234-5678-9012",
  expiryDate: process.env.INVALID_CARD_EXPIRY || "12/25",
  cvv: process.env.INVALID_CARD_CVV || "12",
  holderName: process.env.INVALID_CARD_HOLDER || "",
} as const;
