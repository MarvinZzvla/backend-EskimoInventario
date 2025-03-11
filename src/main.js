// main.js
import { app as electronApp, BrowserWindow, Menu } from "electron";
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

const PORT = process.env.PORT || 3000;

// Función para obtener la IP local (opcional, para logs o configuraciones)
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

// Obtener __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar Express
const expressApp = express();

// Servir los archivos estáticos del frontend (carpeta dist)
expressApp.use(express.static(path.join(__dirname, "../dist")));

// Middlewares
expressApp.use(
  cors({
    origin: ["http://localhost:5173", `http://${LOCAL_IP}:5173`],
    credentials: true,
  })
);
expressApp.use(bodyParser.json());
expressApp.use(cookieParser());

// Rutas API
expressApp.use("/api", routes);

// Para todas las demás rutas, se envía el index.html (aplicación SPA)
expressApp.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// Declarar variable para la ventana de Electron
let mainWindow;

// Función para crear la ventana principal de Electron
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      // Si usas un preload, descomenta la siguiente línea y crea el archivo preload.js
      // preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      nodeIntegration: true,
      devTools: true,
    },
  });

  // Cargar el backend (servido por Express) en la ventana
  mainWindow.loadURL(`http://localhost:${PORT}`);

  const menu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(menu); // Establece el menú vacío para la aplicación

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Sincronizar la base de datos y levantar el servidor Express
sequelize
  .sync()
  .then(() => {
    expressApp.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor corriendo en http://${LOCAL_IP}:${PORT}`);
      // Una vez que Express está corriendo, iniciar Electron
      electronApp.whenReady().then(createWindow);
    });
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });

// Eventos de Electron
electronApp.on("window-all-closed", () => {
  // En macOS es común que la app permanezca activa hasta que se cierre manualmente
  if (process.platform !== "darwin") {
    electronApp.quit();
  }
});

electronApp.on("activate", () => {
  // En macOS, recrear la ventana cuando se hace clic en el icono de la app
  if (mainWindow === null) {
    createWindow();
  }
});
