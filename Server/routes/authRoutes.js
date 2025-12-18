import { register, login } from "../controllers/authController.js";
import express from "express";
const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

export default router;