import {
    fetchBookedSlots,
    createAppointment,
    fetchAppointmentById,
    fetchAvailableDates,
    fetchAllAppointments
  } from "../services/appointment.services.js";
  
  export const getBookedSlots = async (req, res) => {
    try {
      const { doctor_id, appointment_date } = req.query;
      if (!doctor_id || !appointment_date) {
        return res.status(400).json({ message: "Doctor ID and Date are required" });
      }
  
      const bookedSlots = await fetchBookedSlots(doctor_id, appointment_date);
      res.json({ bookedSlots });
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      res.status(error.status || 500).json({ message: error.message });
    }
  };
  
  export const bookAppointment = async (req, res) => {
    try {
      const { doctor_id, appointment_date, time_slot, booking_type, location } = req.body;
      const user_id = req.user.id; 
  
      const appointment = await createAppointment(user_id, doctor_id, appointment_date, time_slot, booking_type, location);
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error booking appointment:", error);
      res.status(error.status || 500).json({ message: error.message });
    }
  };
  
  export const getAppointmentById = async (req, res) => {
    try {
      const { id } = req.params;
      const appointment = await fetchAppointmentById(id);
      res.json(appointment);
    } catch (error) {
      console.error("Error fetching appointment by id:", error);
      res.status(error.status || 500).json({ message: error.message });
    }
  };
  
  export const getAvailableDates = async (req, res) => {
    try {
      const availableDates = await fetchAvailableDates();
      res.json({ dates: availableDates });
    } catch (error) {
      console.error("Error fetching available dates:", error);
      res.status(error.status || 500).json({ message: error.message });
    }
  };
  
  export const getAllAppointments = async (req, res) => {
    try {
      const appointments = await fetchAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(error.status || 500).json({ message: error.message });
    }
  };
  