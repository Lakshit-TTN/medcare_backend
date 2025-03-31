import {
    cancelOtherAppointmentsService,
    getAllAppointmentsService,
    getAppointmentsService,
    updateAppointmentStatusService,
  } from "../services/adminAppointment.services.js";
  import { sendAppointmentCancellationEmail, sendAppointmentConfirmationEmail } from "./emailController.js";
  
  export const cancelOtherAppointments = async (req, res) => {
    const { doctor_id, appointment_date, time_slot } = req.body;
    console.log("Cancel API:", doctor_id, appointment_date, time_slot);
  
    try {
      await cancelOtherAppointmentsService(doctor_id, appointment_date, time_slot);
      res.status(200).json({ message: "Other pending appointments cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling other appointments:", error);
      res.status(500).json({ message: "Error cancelling other appointments" });
    }
  };
  
  export const getAllAppointments = async (req, res) => {
    console.log("getAllAppointments API called");
  
    try {
      const appointments = await getAllAppointmentsService();
      console.log("Appointments Data:", appointments);
      res.status(200).json(appointments);
    } catch (error) {
      console.error("Error fetching all appointments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const getAppointments = async (req, res) => {
    try {
      const appointments = await getAppointmentsService();
      console.log("Appointments fetched:", appointments);
      res.status(200).json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Error fetching appointments" });
    }
  };
  
  export const updateAppointmentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const appointment = await updateAppointmentStatusService(id, status);
  
      if (appointment.error) {
        return res.status(400).json({ message: appointment.error });
      }
  
      if (status === "confirmed") {
        await sendAppointmentConfirmationEmail(
          appointment.email,
          appointment.user_name,
          appointment.doctor_name,
          appointment.appointment_date,
          appointment.time_slot,
          appointment.location,
          appointment.method
        );
      }
  
      if (status === "cancelled") {
        console.log("Sending cancellation email to:", appointment.email);

        await sendAppointmentCancellationEmail(
          appointment.email,
          appointment.user_name,
          appointment.doctor_name,
          appointment.appointment_date,
          appointment.time_slot,
          appointment.location,
        );
      }
  
      res.status(200).json({ message: `Appointment status updated to ${status}` });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      res.status(500).json({ message: "Error updating appointment status" });
    }
  };
  