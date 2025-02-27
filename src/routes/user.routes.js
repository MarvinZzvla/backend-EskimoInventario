import express from "express";
import User from "../models/User.js";
import { encrypt, comparePassword } from "../utils/encrypt.js";
import authMiddleware from "../utils/authMiddleware.js";
const router = express.Router();

// Crear un usuario
router.post("/register", authMiddleware, async (req, res) => {
  try {
    req.body.password = await encrypt(req.body.password);
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
