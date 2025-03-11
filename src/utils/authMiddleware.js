import jwt from "jsonwebtoken";
function authMiddleware(req, res, next) {
  const token = req.cookies.session;
  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

const JWT_SECRET = process.env.JWT_PASSWORD || "secreto"; // Usa el env o un valor por defecto
export const verifyToken = (req, res, next) => {
  const token = req.body.token; // Busca el token en el body

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado, token requerido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Guarda los datos del usuario en la request
    next(); // Continúa con la acción
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

export default authMiddleware;
