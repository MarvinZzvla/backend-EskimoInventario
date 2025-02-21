import { Sequelize } from "sequelize";

// Configura la conexión a SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./src/database/database.sqlite", // Ruta del archivo SQLite
});

export default sequelize;
