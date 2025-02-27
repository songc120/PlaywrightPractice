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
