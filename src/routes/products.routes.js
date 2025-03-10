import express from "express";
import Productos from "../models/Productos.js";
import Ventas from "../models/Ventas.js";
import sequelize from "../database/database.js";

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
      await producto.update(req.body);
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
// Obtener reporte del producto mas vendido
router.get("/reporte", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = `
      SELECT v.id,v.producto as name, SUM(v.cantidad) as quantitySold FROM Ventas v 
 WHERE DATE(v.createdAt) BETWEEN :startDate AND :endDate
GROUP BY v.productoId 
ORDER BY quantitySold DESC;
    `;
    const productos = await Ventas.sequelize.query(query, {
      replacements: { startDate, endDate },
      type: Ventas.sequelize.QueryTypes.SELECT,
    });
    res.status(200).json(productos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Obtener todos los productos por empleado
router.get("/:id", async (req, res) => {
  try {
    const query = `SELECT i.productoId as id, i.producto,p.precio as precioCompra, p.precioVenta as precio,SUM(i.cantidad) as cantidad FROM Inventarios i 
  INNER JOIN Productos p ON i.productoId = p.id 
  WHERE i.empleadoId = ${req.params.id}
  GROUP BY i.productoId`;

    const [productos] = await sequelize.query(query);

    res.status(200).json(productos);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

const parseProduct = (body) => {
  if (body.presentation.toLowerCase() !== "unidad") {
    body.cantidad = body.cantidad * body.units;
  }
  return body;
};

export default router;
