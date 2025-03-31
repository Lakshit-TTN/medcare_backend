import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
import { hashPassword } from "../utils/utils.js";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetPasswordEmail = async (email) => {
  const { rows } = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  if (rows.length === 0) throw new Error("User not found");
  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30m" });
  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 30 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export const updatePassword = async (token, newPassword) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const email = decoded.emai
  const hashedPassword = await hashPassword(newPassword);
  await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);
};
