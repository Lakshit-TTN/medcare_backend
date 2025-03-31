import express from "express";
import { getDoctorById } from "../controller/doctorId.controller.js";
import { getDoctors } from "../controller/doctorGet.controller.js";
import { getDoctorReviews } from "../controller/getReview.controller.js";
import { rateAndReviewDoctor } from "../controller/review.controller.js";

const router = express.Router();

router.get("/", getDoctors);//get doctors for appointment page
router.get("/:id", getDoctorById); // get particular doc
router.get("/reviews/:doctorId", getDoctorReviews);//to get reviews
router.post("/rate/:doctorId",rateAndReviewDoctor); // to handle rating
export default router;
