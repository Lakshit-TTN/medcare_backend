import pool from "../config/db.js";
import { isValidEmail, hashPassword, generateToken } from "../utils/utils.js";

export const signupService = async (name, email, password) => {
  try {
    // validate email using regex
    if (!isValidEmail(email)) {
      throw new Error("Invalid email domain. Only gmail.com and tothenew.com are allowed.");
    }

    // check if the user already exists in db
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      throw new Error("User already exists");
    }

    // hash the password
    const hashedPassword = await hashPassword(password);

    // insert user into database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    // generate JWT token
    const token = generateToken(newUser.rows[0].id, email);

    return { user: newUser.rows[0], token };
  } catch (error) {
    throw error;
  }
};
