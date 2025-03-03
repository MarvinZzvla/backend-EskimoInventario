import express from "express";
import Compras from "../models/Compras.js";
import { Op } from "sequelize";

const router = express.Router();

//Crear una compra
router.post("/", async (req, res) => {
  try {
    const { initialDate, finalDate } = req.body;
    console.log(req.body);
    const compras = await Compras.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(initialDate), new Date(finalDate)],
        },
      },
    });
    res.status(200).json(compras);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.post("/create", async (req, res) => {
  try {
    const { cantidad, precio, precioVenta, producto, productoId, responsable } =
      req.body;
    const compraBody = {
      cantidad,
      precio,
      precioVenta,
      producto,
      productoId,
      responsable,
    };
    const compra = await Compras.create(compraBody);
    res.status(201).json(compra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Actualizar una compra
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const compra = await Compras.update(req.body, {
      where: { id: id },
    });
    res.status(200).json(compra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//Borrar una compra
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Compras.destroy({ where: { id: id } });
    res.status(200).json({ message: "Compra eliminada" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
