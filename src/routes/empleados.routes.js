import express from "express";
import Empleados from "../models/Empleados.js";

const router = express.Router();

//Actualizar un empleado
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const empleado = await Empleados.update(req.body, {
      where: { id: id },
    });
    res.status(200).json(empleado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Crear un empleado
router.post("/", async (req, res) => {
  try {
    const empleado = await Empleados.create(req.body);
    res.status(201).json(empleado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//Obtener todos los empleados
router.get("/", async (req, res) => {
  try {
    const empleados = await Empleados.findAll();
    res.status(200).json(empleados);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Eliminar un empleado
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Empleados.destroy({ where: { id: id } });
    res.status(200).json({ message: "Empleado eliminado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
export default router;
