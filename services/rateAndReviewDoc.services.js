import pool from "../config/db.js";

export const rateAndReviewDoctorService = async (doctorId, rating, review_text, name, user_id) => {

  const doctorResult = await pool.query(
    `SELECT total_rating, rating_count, average_rating, COALESCE(reviews, '[]'::jsonb) AS reviews 
     FROM doctors WHERE id = $1`,
    [doctorId]
  );
  // coalesce is used to handle null val if found,
  // we could use replace but it fails when reviews is NULL (because REPLACE only works on non-null values).


  if (doctorResult.rowCount === 0) {
    throw { status: 404, message: "Doctor not found" };
  }

  let { total_rating, rating_count, average_rating, reviews } = doctorResult.rows[0];
  reviews = Array.isArray(reviews) ? reviews : [];

  // Fetch user name from `users` table using `user_id`
  const userResult = await pool.query(`SELECT name FROM users WHERE id = $1`, [user_id]);
  if (userResult.rowCount === 0) {
    throw { status: 404, message: "User not found" };
  }
  const user_name = userResult.rows[0].name || "Anonymous";

  if (rating && rating >= 1 && rating <= 5) {
    total_rating += rating;
    rating_count += 1;
    average_rating = parseFloat((total_rating / rating_count).toFixed(1));
    await pool.query(
      `UPDATE doctors 
       SET total_rating = $1, rating_count = $2, average_rating = $3 
       WHERE id = $4`,
      [total_rating, rating_count, average_rating, doctorId]
    );
  }

  if (review_text) {
    const newReview = { user_id, name: user_name || "Anonymous", review: review_text };
    reviews.push(newReview);
    await pool.query(
      `UPDATE doctors 
       SET reviews = $1::jsonb
       WHERE id = $2`,
      [JSON.stringify(reviews), doctorId]
    );
  }

  return {
    message: "Rating and/or review submitted successfully!",
    average_rating,
    reviews,
  };
};
