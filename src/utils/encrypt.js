import bcrypt from "bcryptjs";
export const encrypt = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// 🔹 Comparar una contraseña con su hash almacenado
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
