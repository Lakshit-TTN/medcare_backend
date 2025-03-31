import pool from "../config/db.js";

// Cancel all pending appointments for the same doctor, date, and time slot
export const cancelOtherAppointmentsService = async (doctor_id, appointment_date, time_slot) => {
  const cancelQuery = `
      UPDATE appointments
      SET status = 'cancelled'
      WHERE doctor_id = $1
      AND appointment_date = $2
      AND time_slot = $3
      AND status = 'pending';
  `;
  return await pool.query(cancelQuery, [doctor_id, appointment_date, time_slot]);
};

export const getAllAppointmentsService = async () => {
  const query = `
      SELECT a.id, a.user_id, a.doctor_id, d.name AS doctor_name, 
      a.appointment_date, a.time_slot, a.method, a.status, 
      a.location, a.created_at, u.name AS patient_name
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u ON a.user_id = u.id
      ORDER BY a.appointment_date DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Get pending appointments for admin
export const getAppointmentsService = async () => {
  const query = `
      SELECT 
      appointments.id, 
      appointments.appointment_date, 
      appointments.doctor_id, 
      appointments.time_slot, 
      appointments.method, 
      appointments.status, 
      appointments.location, 
      users.name AS username, 
      doctors.name AS doctor_name
      FROM appointments
      JOIN users ON appointments.user_id = users.id
      JOIN doctors ON appointments.doctor_id = doctors.id
      WHERE appointments.appointment_date >= CURRENT_DATE
      AND appointments.status = 'pending'
      ORDER BY appointments.appointment_date ASC;
  `;

  const { rows } = await pool.query(query);

  // Convert UTC to Local Time (Asia/Kolkata)
  return rows.map(appointment => ({
    ...appointment,
    appointment_date: new Date(appointment.appointment_date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    }),
  }));
};

// Update appointment status
export const updateAppointmentStatusService = async (id, status) => {
  if (!status || !["confirmed", "cancelled"].includes(status)) {
    return { error: "Invalid status" };
  }

  // Update the status first
  const updateResult = await pool.query(
    "UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );

  if (updateResult.rowCount === 0) {
    return { error: "Appointment not found" };
  }

  // Fetch the updated appointment details
  const { rows: appointmentRows } = await pool.query(
    `SELECT a.*, u.email, u.name AS user_name, d.name AS doctor_name 
     FROM appointments a
     JOIN users u ON a.user_id = u.id
     JOIN doctors d ON a.doctor_id = d.id
     WHERE a.id = $1`,
    [id]
  );

  if (appointmentRows.length === 0) {
    return { error: "Appointment not found" };
  }

  return appointmentRows[0];
};

