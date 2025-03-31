import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const isValidEmail = (email) => {
  const emailRegex = /^(?:[a-zA-Z0-9._%+-]+@(?:gmail\.com|tothenew\.com))$/;
  return emailRegex.test(email);
};

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
