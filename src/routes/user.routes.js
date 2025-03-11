import express from "express";
import User from "../models/User.js";
import { encrypt, comparePassword } from "../utils/encrypt.js";
import authMiddleware from "../utils/authMiddleware.js";
const router = express.Router();

// Crear un usuario
router.post("/register", authMiddleware, async (req, res) => {
  try {
    const user = createUser(req.body);
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
// Obtener todos los usuarios
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.body);
    const users = await User.update(req.body, {
      where: { id },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    await User.destroy({ where: { id: id } });
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export const createUser = async (user) => {
  user.password = await encrypt(user.password);
  const usercreated = await User.create(user);
  return usercreated;
};

export default router;
