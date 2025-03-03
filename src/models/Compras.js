import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const Compras = sequelize.define("Compras", {
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
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  precioVenta: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  responsable: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
export default Compras;
