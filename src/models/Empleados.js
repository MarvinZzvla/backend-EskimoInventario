import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";

const Empleados = sequelize.define("Empleados", {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Empleados;
