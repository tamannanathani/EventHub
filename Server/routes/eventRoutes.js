import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  myEvents,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, createEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);
router.get("/my/events", protect, admin, myEvents);
router.put("/:id", protect, admin, updateEvent);
router.delete("/:id", protect, admin, deleteEvent);


export default router;
