import express from "express";
import Productos from "../models/Productos.js";

const router = express.Router();

// Crear un producto
router.post("/", async (req, res) => {
  try {
    const producto = await Productos.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Productos.findAll();
    res.status(200).json(productos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
