import { rateAndReviewDoctorService } from "../services/rateAndReviewDoc.services.js";

export const rateAndReviewDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { rating, review_text } = req.body;
    const user_id = req.user?.id; 

    const response = await rateAndReviewDoctorService(doctorId, rating, review_text, name, user_id);

    res.json(response);
  } catch (error) {
    console.error("Error submitting rating/review:", error.message);
    res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
  }
};
