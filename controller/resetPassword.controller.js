import { sendResetPasswordEmail, updatePassword } from "../services/forgotpassword.services.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    await sendResetPasswordEmail(email);
    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    await updatePassword(token, newPassword);
    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
