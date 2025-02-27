import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const Ventas = sequelize.define("Ventas", {
  producto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  empleado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  empleadoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  precioVenta: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Ventas;
