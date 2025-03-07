import express from "express";
import Compras from "../models/Compras.js";
import Productos from "../models/Productos.js";
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
          [Op.between]: [
            new Date(initialDate),
            new Date(finalDate).setHours(23, 59, 59, 999),
          ],
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
    //Actualizar la cantidad del producto existente en la base de datos
    const productoUpdate = await Productos.findByPk(productoId);
    productoUpdate.cantidad += cantidad;
    await Productos.update(
      {
        cantidad: productoUpdate.cantidad,
        precio: precio,
        precioVenta: precioVenta,
      },
      { where: { id: productoId } }
    );
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
    const { productoId, cantidad } = await Compras.findByPk(id);
    await restoreProduct(productoId, cantidad);
    await Compras.destroy({ where: { id: id } });
    res.status(200).json({ message: "Compra eliminada" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const restoreProduct = async (productoId, cantidad) => {
  const productoUpdate = await Productos.findByPk(productoId);

  Productos.update(
    {
      cantidad: (productoUpdate.cantidad += cantidad * -1),
    },
    {
      where: { id: productoId },
    }
  );
};

export default router;
