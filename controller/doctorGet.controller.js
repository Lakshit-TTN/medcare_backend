import { fetchDoctors } from "../services/getdoctor.services.js";

export const getDoctors = async (req, res) => {
  try {
    const data = await fetchDoctors(req.query);
    res.json(data);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
};
