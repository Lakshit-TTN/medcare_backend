import { getUserProfileService } from "../services/userProfile.services.js";

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const userProfile = await getUserProfileService(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
  }
};
