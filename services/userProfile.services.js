import pool from "../config/db.js";

export const getUserProfileService = async (userId) => {
  const userQuery = "SELECT id, name, email FROM users WHERE id = $1;";
  const userResult = await pool.query(userQuery, [userId]);
  if (userResult.rows.length === 0) {
    throw { status: 404, message: "User not found" };
  }
  const appointmentsQuery = `
    SELECT a.id, d.name AS doctor_name, a.appointment_date, a.time_slot, 
    a.method, a.status, a.location
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id  
    WHERE a.user_id = $1 
    ORDER BY a.appointment_date DESC;
  `;
  const appointmentsResult = await pool.query(appointmentsQuery, [userId]);

  return {
    user: userResult.rows[0],
    appointments: appointmentsResult.rows,
  };
};
