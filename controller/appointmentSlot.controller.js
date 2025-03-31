import { getAvailableSlots } from "../services/appointmentSlot.services.js";

export const getAvailableSlotsController = async (req, res) => {
    try {
      const { doctor_id } = req.query;
  
      if (!doctor_id) {
        return res.status(400).json({ error: "Doctor ID is required" });
      }
        const slotsData = await getAvailableSlots(doctor_id);    
      return res.status(200).json(slotsData);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
};
