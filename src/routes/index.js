import { Router } from "express";
import userRoutes from "./user.routes.js";
//import productRoutes from './productRoutes.js';

const router = Router();

// Registrar rutas manualmente
router.use("/users", userRoutes); // Ruta base para usuarios
//router.use('/products', productRoutes); // Ruta base para productos

export default router;
