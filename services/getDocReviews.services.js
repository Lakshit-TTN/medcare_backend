import pool from "../config/db.js";

export const fetchDoctorReviews = async (doctorId) => {
  const query = `
    SELECT 
    u.name, 
    review_data->>'review' AS comment
    FROM doctors d, 
    LATERAL jsonb_array_elements(d.reviews) AS review_data
    JOIN users u ON (review_data->>'user_id')::INT = u.id
    WHERE d.id = $1
  `;
  const result = await pool.query(query, [doctorId]);
  return result.rows;
};

//jsonb_array_elements(d.reviews) - expands this JSON array into multiple rows, one per review.
//LATERAL allows subqueries to reference columns from the main query,if we have a query reutrning multiple rows (not in subquery)
//Using LATERAL, you extract each review separately and match it with the user.
//Each review contains a user_id field (as JSON).
// review_data->>'user_id' extracts the user_id as text.


