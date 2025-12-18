import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createBooking } from "../controllers/bookingController.js";

const router = express.Router();

// Book tickets
router.post("/", protect, createBooking);

export default router;
