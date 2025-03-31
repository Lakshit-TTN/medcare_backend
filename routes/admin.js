import express from "express";
import { addDoctor, deleteDoctor, getAllDoctorsForAdmin, getDoctorCount, updateDoctor } from "../controller/admin.controller.js";
import { cancelOtherAppointments, getAllAppointments, getAppointments, updateAppointmentStatus } from "../controller/adminAppointment.controller.js";

const router = express.Router();

router.get("/doctors/count", getDoctorCount); //to get all doctors count
router.get("/all",  getAllDoctorsForAdmin); // to get all doctors
router.delete("/delete/:id" ,deleteDoctor); // to delete a doc
router.patch("/doctors/:id" ,updateDoctor);// to update a doc
router.get('/appointments',getAppointments);//to get appointments with pending status
router.patch('/appointments/cancel',cancelOtherAppointments);//to cancel other conflicting appointmnts
router.get("/allapp" ,getAllAppointments);//to get all appointments including pending,approved,cancelled
router.patch('/appointments/:id', updateAppointmentStatus);//to accept or reject appointment
router.post("/doctors",  addDoctor);//to add a doctor

export default router;
