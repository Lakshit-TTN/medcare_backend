import pool from "../config/db.js";

export const fetchDoctors = async (queryParams) => {
  const { rating, experience, gender, page, limit, searchTerm } = queryParams;
  console.log("Received filters:", { rating, experience, gender, searchTerm });
  
  let minExpValue = null;
  let maxExpValue = null;

  if (experience && experience !== "null") {
    if (experience.includes("+")) {
      minExpValue = parseInt(experience.replace("+", ""), 10);
    } else {
      const [min, max] = experience.split("-").map(num => parseInt(num, 10));
      minExpValue = isNaN(min) ? null : min;
      maxExpValue = isNaN(max) ? null : max;
    }
  }

  const ratingValue = rating ? Number(rating) : null;
  const pageNumber = page ? Number(page) : 1;
  const pageSize = limit ? Number(limit) : 6;
  const offset = (pageNumber - 1) * pageSize;
  let query = `SELECT * FROM doctors WHERE 1=1`;
  let values = [];
  let countQuery = `SELECT COUNT(*) FROM doctors WHERE 1=1`;
  //The problem here is that we need to check whether WHERE already exists before adding AND,so we used 1=1

  let countValues = [];

  if (searchTerm) {
    const searchPattern = `%${searchTerm}%`;
    query += ` AND (
      REPLACE(name, 'Dr. ', '') ILIKE $${values.length + 1} 
      OR specialty ILIKE $${values.length + 2} 
      OR EXISTS (
          SELECT 1
          FROM unnest(diseases) AS disease
          WHERE disease ILIKE $${values.length + 3}
      )
    )`;
    //select 1 checks existance , unnest is used to convert the diseases array into separate rows

    values.push(searchPattern, searchPattern, searchPattern);

    countQuery += ` AND (
      REPLACE(name, 'Dr. ', '') ILIKE $${countValues.length + 1} 
      OR specialty ILIKE $${countValues.length + 2} 
      OR EXISTS (
          SELECT 1
          FROM unnest(diseases) AS disease
          WHERE disease ILIKE $${countValues.length + 3}
      )
    )`;
    countValues.push(searchPattern, searchPattern, searchPattern);
  }

  if (ratingValue) {
    const lowerBound = ratingValue - 0.5;
    const upperBound = ratingValue + 0.5;
    query += ` AND average_rating >= $${values.length + 1} AND average_rating < $${values.length + 2}`;
    values.push(lowerBound, upperBound);
    countQuery += ` AND average_rating >= $${countValues.length + 1} AND average_rating < $${countValues.length + 2}`;
    countValues.push(lowerBound, upperBound);
  }

  if (minExpValue !== null) {
    query += ` AND experience >= $${values.length + 1}`;
    values.push(minExpValue);
    countQuery += ` AND experience >= $${countValues.length + 1}`;
    countValues.push(minExpValue);
  }

  if (maxExpValue !== null) {
    query += ` AND experience < $${values.length + 1}`;
    values.push(maxExpValue);
    countQuery += ` AND experience < $${countValues.length + 1}`;
    countValues.push(maxExpValue);
  }

  if (gender) {
    query += ` AND gender = $${values.length + 1}`;
    values.push(gender);
    countQuery += ` AND gender = $${countValues.length + 1}`;
    countValues.push(gender);
  }

  if (!searchTerm && !rating && !experience && !gender) {
    query += ` ORDER BY average_rating DESC`;
  }

  query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(pageSize, offset);
  console.log("Executing Query:", query, values);
  console.log("Executing Count Query:", countQuery, countValues);

  const doctors = await pool.query(query, values);
  const totalCountResult = await pool.query(countQuery, countValues);
  const totalDoctors = parseInt(totalCountResult.rows[0].count, 10);
  const totalPages = Math.ceil(totalDoctors / pageSize) || 1;
  return {
    doctors: doctors.rows,
    totalDoctors,
    totalPages,
    currentPage: pageNumber,
  };
};
