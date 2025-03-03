import { Router } from "express";
import ventasRoutes from "./ventas.routes.js";
import productsRoutes from "./products.routes.js";
import empleadosRoutes from "./empleados.routes.js";
import comprasRoutes from "./compras.routes.js";
import inventarioEmpleadoRoutes from "./inventarioempleado.routes.js";
import userRoutes from "./user.routes.js";
import User from "../models/User.js";
import { comparePassword } from "../utils/encrypt.js";
import jwt from "jsonwebtoken";

const router = Router();
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "Correo Invalido" });
  }
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Contraseña incorrecta" });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT
  );
  res.cookie("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.json({ name: user.name });
});
// Registrar rutas manualmente
router.use("/ventas", ventasRoutes); // Ruta base para ventas
router.use("/products", productsRoutes); // Ruta base para productos
router.use("/compras", comprasRoutes); // Ruta base para compras
router.use("/empleados", empleadosRoutes); // Ruta base para empleados
router.use("/inventarioempleado", inventarioEmpleadoRoutes); // Ruta base para inventario de empleados
router.use("/users", userRoutes); // Ruta base para usuarios
//router.use('/products', productRoutes); // Ruta base para productos

export default router;
