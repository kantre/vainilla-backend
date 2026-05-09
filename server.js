import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";

import { query } from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";

const app = express();

// ✅ CORS
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://vainilla-store.netlify.app"
  ],
  credentials: true
}));

// ✅ JSON
app.use(express.json());

// ✅ ruta base
app.get("/", (req, res) => {
  res.send("🚀 API funcionando");
});

// ✅ rutas
app.use("/api/users", userRoutes);

// ✅ iniciar DB
async function initDB() {

  try {

    // ✅ crear tabla
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
      )
    `);

    console.log("🟢 Tabla users lista");

    // ✅ password admin
    const hashedPassword = await bcrypt.hash(
      "123456",
      10
    );

    // ✅ crear admin si no existe
    await query(
      `
      INSERT INTO users
      (name, email, password, role)

      VALUES ($1, $2, $3, $4)

      ON CONFLICT (email)
      DO NOTHING
      `,
      [
        "Admin",
        "vainilla.deco.eventos@gmail.com",
        hashedPassword,
        "admin"
      ]
    );

    console.log("🟢 Admin verificado");

  } catch (error) {

    console.error("🔴 Error initDB:", error);
  }
}

// ✅ iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {

  console.log(`🚀 Servidor en puerto ${PORT}`);

  await initDB();
});