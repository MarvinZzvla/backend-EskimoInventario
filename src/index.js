import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import sequelize from "./database/database.js";
import routes from "./routes/index.js";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", `http://${LOCAL_IP}:5173`],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

// Rutas
app.use("/api", routes);

// app.use(express.static(path.join(__dirname, "../dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist", "index.html"));
// });
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
