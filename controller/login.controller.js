import { authenticateUser, authenticateGoogle, handleGoogleCallback } from "../services/login.services.js";

export const login = authenticateUser;
export const googleAuth = authenticateGoogle;
export const googleAuthCallback = handleGoogleCallback;
