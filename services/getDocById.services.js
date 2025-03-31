import pool from "../config/db.js";

export const fetchDoctorById = async (doctorId) => {
  const query = `
    SELECT * FROM doctors WHERE id = $1
  `;

  const { rows } = await pool.query(query, [doctorId]);

  if (rows.length === 0) {
    const error = new Error("Doctor not found");
    error.status = 404;
    throw error;
  }

  return rows[0];
};
