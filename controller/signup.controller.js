import { signupService } from "../services/signup.services.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const { user, token } = await signupService(name, email, password);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};
