import express from "express";
import Ventas from "../models/Ventas.js";

const router = express.Router();

// Crear una venta
router.post("/", async (req, res) => {
  try {
    const venta = await Ventas.create(req.body);
    res.status(201).json(venta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//Obtener todas las ventas
router.get("/", async (req, res) => {
  try {
    const ventas = await Ventas.findAll();
    res.status(200).json(ventas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
