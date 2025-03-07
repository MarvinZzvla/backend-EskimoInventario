import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const InventarioEmpleado = sequelize.define("Inventario", {
  empleadoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  empleado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  producto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default InventarioEmpleado;
