import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

// 🚫 REGISTRO DESHABILITADO
export async function register(req, res) {

  return res.status(403).json({
    message: "Registro deshabilitado"
  });
}

// 🔐 LOGIN ADMIN
export async function login(req, res) {

  try {

    const { email, password } = req.body;

    // ✅ validar
    if (!email || !password) {

      return res.status(400).json({
        message: "Email y contraseña requeridos"
      });
    }

    // ✅ buscar usuario
    const user = await User.findByEmail(email);

    if (!user) {

      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    // ✅ verificar rol
    if (user.role !== "admin") {

      return res.status(403).json({
        message: "Acceso solo admin"
      });
    }

    // ✅ verificar password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(401).json({
        message: "Contraseña incorrecta"
      });
    }

    // ✅ token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // ✅ ocultar password
    const { password: _, ...userSafe } = user;

    // ✅ respuesta
    res.status(200).json({
      token,
      user: userSafe
    });

  } catch (error) {

    console.error("🔴 Error login:", error);

    res.status(500).json({
      message: "Error interno del servidor"
    });
  }
}