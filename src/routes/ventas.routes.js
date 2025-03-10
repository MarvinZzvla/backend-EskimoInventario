import express from "express";
import Ventas from "../models/Ventas.js";
import Inventario from "../models/InventarioEmpleado.js";
import { Op } from "sequelize";

const router = express.Router();

// Crear múltiples ventas (Bulk Insert)
router.post("/", async (req, res) => {
  try {
    // req.body debe ser un array de ventas
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        error: "El cuerpo de la petición debe ser un array de ventas.",
      });
    }

    await addToInventario(req.body);
    const ventas = await Ventas.bulkCreate(req.body);
    res.status(201).json(ventas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//Obtener todas las ventas
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const ventas = await Ventas.findAll({
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      },
    });
    res.status(200).json(ventas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Obtener todas las ventas
router.get("/reporte", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = `
      SELECT v.id, v.empleado as name, SUM(v.precioVenta * v.cantidad) as totalSales 
      FROM Ventas v 
      WHERE DATE(v.createdAt) BETWEEN :startDate AND :endDate
      GROUP BY v.empleadoId 
      ORDER BY totalSales DESC;
    `;
    const ventas = await Ventas.sequelize.query(query, {
      replacements: { startDate, endDate },
      type: Ventas.sequelize.QueryTypes.SELECT,
    });
    res.status(200).json(ventas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
//Obtener todas las ventas por empleado
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    const query = `
      SELECT v.id, v.producto, v.cantidad, (v.precioVenta * v.cantidad) as totalAmount, v.createdAt as saleDate 
      FROM Ventas v 
      WHERE DATE(v.createdAt) BETWEEN :startDate AND :endDate AND v.empleadoId = :id
    `;
    const ventas = await Ventas.sequelize.query(query, {
      replacements: { startDate, endDate, id },
      type: Ventas.sequelize.QueryTypes.SELECT,
    });
    res.status(200).json(ventas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Register into Inventario
const addToInventario = async (cart) => {
  const ventas = parseToInventario(cart);
  try {
    await Inventario.bulkCreate(ventas);
  } catch (error) {
    return;
  }
};
const parseToInventario = (cart) => {
  const ventasInventario = [];
  cart.map((item) => {
    const inventario = {
      productoId: item.productoId,
      producto: item.producto,
      empleadoId: item.empleadoId,
      empleado: item.empleado,
      cantidad: item.cantidad * -1,
    };
    ventasInventario.push(inventario);
  });
  return ventasInventario;
};

export default router;
