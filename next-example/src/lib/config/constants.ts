/**
 * API Configuration - backend runs on localhost:8080 during development.
 */
const baseUrl =
  process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:8080";
export const SERVER_BASE_URL = `${baseUrl}/api`;

export const API_USERNAME =
  process.env.NEXT_PUBLIC_API_USERNAME || "user";
export const API_PASSWORD =
  process.env.NEXT_PUBLIC_API_PASSWORD || "password";

export const APP_NAME = "Pet Clinic";
export const APP_VERSION = "0.1.0";
