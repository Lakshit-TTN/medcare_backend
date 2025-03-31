import { fetchDoctorById } from "../services/getDocById.services.js";

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await fetchDoctorById(req.params.id);
    res.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    res.status(error.status || 500).json({ message: error.message || "Server error" });
  }
};
