import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const InventarioEmpleado = sequelize.define("Inventario", {
  idEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idProducto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default InventarioEmpleado;
