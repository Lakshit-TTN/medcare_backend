import { fetchDoctorReviews } from "../services/getDocReviews.services.js";

export const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await fetchDoctorReviews(req.params.doctorId);
    res.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
  }
};
