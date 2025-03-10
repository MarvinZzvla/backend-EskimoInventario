import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import sequelize from "./database/database.js";
import routes from "./routes/index.js";
import os from "os";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.1.23:5173"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

// Rutas
app.use("/api", routes);

// Sincroniza la base de datos y levanta el servidor
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor corriendo en http://${LOCAL_IP}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
  return "localhost";
};

const LOCAL_IP = getLocalIP();
