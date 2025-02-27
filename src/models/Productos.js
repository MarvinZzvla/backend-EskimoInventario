import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";

const Productos = sequelize.define("Productos", {
  producto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  presentacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unidades: {
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
});

export default Productos;
