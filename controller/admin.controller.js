import {
  getUserCountService,
  deleteDoctorService,
  getAllDoctorsService,
  updateDoctorService,
  getDoctorCountService,
  addDoctorService
} from "../services/admin.services.js";

export const getUserCount = async (req, res) => {
  try {
    const count = await getUserCountService();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const result = await deleteDoctorService(req.params.id);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllDoctorsForAdmin = async (req, res) => {
  try {
    const doctors = await getAllDoctorsService();
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching all doctors:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const result = await updateDoctorService(req.params.id, req.body);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor updated successfully", doctor: result.rows[0] });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getDoctorCount = async (req, res) => {
  try {
    const count = await getDoctorCountService();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching doctor count:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addDoctor = async (req, res) => {
  try {
    const { name, specialty, qualifications, experience, bio, gender, hospital, availability, imageUrl, diseases } = req.body;

    if (!name || !specialty || !qualifications || !experience || !bio || !gender || !hospital || !availability || !imageUrl || !diseases) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log(diseases);
    
    const doctor = await addDoctorService(req.body);
    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
