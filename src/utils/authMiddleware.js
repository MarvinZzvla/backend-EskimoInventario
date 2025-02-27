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

export default authMiddleware;
