import express from "express";
import InventarioEmpleado from "../models/InventarioEmpleado.js";

const router = express.Router();

// Crear un inventario de empleado
router.post("/", async (req, res) => {
  try {
    const inventarioempleado = await InventarioEmpleado.create(req.body);
    res.status(201).json(inventarioempleado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Obtener todos los inventarios de empleados
router.get("/", async (req, res) => {
  try {
    const inventarios = await InventarioEmpleado.findAll();
    res.status(200).json(inventarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
