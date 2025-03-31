import pool from "../config/db.js";

export const getUserCountService = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM users");
  return parseInt(result.rows[0].count);
};

export const deleteDoctorService = async (id) => {
  const result = await pool.query("DELETE FROM doctors WHERE id = $1 RETURNING *", [id]);
  return result;
};

export const getAllDoctorsService = async () => {
  const result = await pool.query("SELECT * FROM doctors");
  return result.rows;
};

export const updateDoctorService = async (id, updates) => {
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setQuery = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");
  if (!setQuery) {
    return { error: "No valid fields provided for update" };
  }
  const query = `UPDATE doctors SET ${setQuery} WHERE id = $${fields.length + 1} RETURNING *`;
  const result = await pool.query(query, [...values, id]);
  return result;
};

export const getDoctorCountService = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM doctors");
  return parseInt(result.rows[0].count);
};
export const addDoctorService = async (doctorData) => {
  console.log("doc", doctorData);

  const { name, specialty, qualifications, experience, bio, gender, hospital, availability, imageUrl, diseases } = doctorData;

  const query = `
    INSERT INTO doctors (name, specialty, qualifications, experience, bio, gender, hospital, availability, image_url, diseases)  
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) RETURNING *;
  `;

  const values = [
    name,
    specialty,
    qualifications,
    experience,
    bio,
    gender,
    hospital,
    availability,
    imageUrl,
    diseases
  ];

  console.log("Query values:", values);

  const result = await pool.query(query, values);
  console.log("Doctor inserted:", result.rows[0]);

  return result.rows[0];
};
