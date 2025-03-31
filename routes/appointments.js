import express from 'express';
import {
    bookAppointment,
    getAppointmentById,
    getAllAppointments,
    getAvailableDates,
    getBookedSlots
} from '../controller/appointment.controller.js';
import authenticateUser from '../middleware/authMiddleware.js';
import { getAvailableSlotsController } from '../controller/appointmentSlot.controller.js';

const router = express.Router();

router.get('/', getAllAppointments); // to et all appointments
router.get("/available-dates", getAvailableDates); // to get all avaialbe dates
router.post('/book', authenticateUser, bookAppointment);  // to book appointment
router.get("/booked-slots", authenticateUser, getBookedSlots); // to get booked slots approved by admin
router.get('/available-slots',getAvailableSlotsController);  // to get an appointment
router.get('/:id', getAppointmentById);  // to get an appointment
export default router;
