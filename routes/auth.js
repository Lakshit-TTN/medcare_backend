import express from "express";
import { signup } from "../controller/signup.controller.js";
import passport from "../config/passportConfig.js";
import { googleAuthCallback, login } from "../controller/login.controller.js";
import { forgotPassword, resetPassword } from "../controller/resetPassword.controller.js";
import { verifyToken } from "../services/verifyToken.services.js";

const router = express.Router();

router.post("/signup", signup);//for registering
router.post("/login", login);//for log in
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));//for google login
router.get("/google/callback", googleAuthCallback); // after google login , callback url
router.post("/forgot-password", forgotPassword);//forgot password
router.post("/reset-password", resetPassword);//to reset password

//for admin
router.post("/verify", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const result = verifyToken(token);
    res.json(result);
  });

export default router;
