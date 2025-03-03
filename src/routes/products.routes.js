import express from "express";
import Productos from "../models/Productos.js";

const router = express.Router();

// Crear un producto
router.post("/", async (req, res) => {
  try {
    const producto = await Productos.create(parseProduct(req.body));
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//Editar un producto
router.put("/:id", async (req, res) => {
  try {
    const producto = await Productos.findByPk(req.params.id);
    if (producto) {
      await producto.update(parseProduct(req.body));
      res.status(200).json(producto);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
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

const parseProduct = (body) => {
  if (body.presentation.toLowerCase() !== "unidad") {
    body.cantidad = body.cantidad * body.units;
  }
  return body;
};

export default router;
