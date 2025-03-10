import express from "express";
import InventarioEmpleado from "../models/InventarioEmpleado.js";
import Productos from "../models/Productos.js";
import sequelize from "../database/database.js";
import { Op } from "sequelize";

const router = express.Router();

// Crear un inventario de empleado
router.post("/", async (req, res) => {
  try {
    const inventarioempleado = await InventarioEmpleado.create(req.body);
    const producto = await Productos.findByPk(req.body.productoId);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    // Actualizar la cantidad sumándole la cantidad del request
    producto.cantidad += req.body.cantidad * -1;
    // Guardar los cambios en la base de datos
    await producto.save();
    res.status(201).json(inventarioempleado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Obtener todos los inventarios de empleados con cantidad mayor a 0
router.get("/", async (req, res) => {
  try {
    const inventarios = await InventarioEmpleado.findAll({
      where: {
        cantidad: {
          [Op.gt]: 0,
        },
      },
      limit: 10,
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(inventarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Obtener todos los inventarios de empleados con cantidad mayor a 0
router.get("/:id", async (req, res) => {
  try {
    const empleadoId = req.params.id;
    const query = `
    SELECT i.id, i.producto, SUM(i.cantidad) as cantidad 
    FROM Inventarios i 
    WHERE i.empleadoId = ${empleadoId}
    GROUP BY i.productoId  
    `;
    const [results, metadata] = await sequelize.query(query);
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { productoId, cantidad } = await InventarioEmpleado.findByPk(id);
    await restoreProduct(productoId, cantidad);
    const response = InventarioEmpleado.destroy({ where: { id: id } });
    res.status(200).json({ message: response });
  } catch (error) {}
});

const restoreProduct = async (productoId, cantidad) => {
  const productoUpdate = await Productos.findByPk(productoId);

  Productos.update(
    {
      cantidad: (productoUpdate.cantidad += cantidad),
    },
    {
      where: { id: productoId },
    }
  );
};
export default router;
