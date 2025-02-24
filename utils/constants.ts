import dotenv from "dotenv";
dotenv.config();

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

export const USER1_EMAIL = process.env.USER1_EMAIL || "";
export const USER1_PASSWORD = process.env.USER1_PASSWORD || "";

export const USER2_EMAIL = process.env.USER2_EMAIL || "";
export const USER2_PASSWORD = process.env.USER2_EMAIL || "";

export const NOT_USER_EMAIL = process.env.NOT_USER_EMAIL || "";
export const NOT_USER_PASSWORD = process.env.NOT_USER_PASSWORD || "";

export const INVALID_EMAIL = process.env.INVALID_EMAIL || "";
export const INVALID_PASSWORD = process.env.INVALID_PASSWORD || "";
