import pool from "../config/db.js";

// Fetch booked slots
export const fetchBookedSlots = async (doctor_id, appointment_date) => {
  const query = `
    SELECT time_slot FROM appointments 
    WHERE doctor_id = $1 AND appointment_date = $2 AND status = 'confirmed';
  `;
  const result = await pool.query(query, [doctor_id, appointment_date]);
  return result.rows.map(row => row.time_slot);
};

// Create new appointment
export const createAppointment = async (user_id, doctor_id, appointment_date, time_slot, booking_type, location) => {
  const selectedDate = new Date(appointment_date);
  const maxBookingDate = new Date();
  const today = new Date();
  maxBookingDate.setDate(today.getDate() + 30);

  if (selectedDate < today || selectedDate > maxBookingDate) {
    throw { status: 400, message: "Appointments can only be booked within the next 30 days." };
  }

  const query = `
    INSERT INTO appointments (user_id, doctor_id, appointment_date, time_slot, method, status, created_at, location)
    VALUES ($1, $2, $3, $4, $5, 'pending', NOW(), $6) 
    RETURNING *;
  `;
  const values = [user_id, doctor_id, appointment_date, time_slot, booking_type, location];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Fetch appointment by ID
export const fetchAppointmentById = async (id) => {
  const result = await pool.query("SELECT * FROM appointments WHERE id = $1", [id]);
  if (result.rows.length === 0) {
    throw { status: 404, message: "Appointment not found" };
  }
  return result.rows[0];
};

// Fetch available dates for the current month
export const fetchAvailableDates = async () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  let currentMonth = today.getMonth();
  let startDate = today.getDate();

  // If today is the last day of the month, start from the next month
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  if (startDate === lastDayOfMonth) {
    startDate = 1;
    currentMonth += 1;

    if (currentMonth > 11) {
      currentMonth = 0;
    }
  }
  const availableDates = [];
  const daysToFetch = 30;
  for (let i = 0; i < daysToFetch; i++) {
    const nextDate = new Date(currentYear, currentMonth, startDate + i);
    const year = nextDate.getFullYear();
    const month = String(nextDate.getMonth() + 1).padStart(2, "0");
    const day = String(nextDate.getDate()).padStart(2, "0");
    availableDates.push(`${year}-${month}-${day}`);
  }
  console.log("Fixed Available Dates:", availableDates);
  return availableDates;
};



// Fetch all appointments
export const fetchAllAppointments = async () => {
  const result = await pool.query("SELECT * FROM appointments");
  return result.rows;
};
