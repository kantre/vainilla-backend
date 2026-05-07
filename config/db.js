import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// ✅ probar conexión
pool.connect()
  .then(() => {
    console.log("🟢 PostgreSQL conectado");
  })
  .catch((err) => {
    console.error("🔴 Error DB:", err);
  });

// ✅ exportar query correctamente
export const query = (text, params) => {
  return pool.query(text, params);
};

export default pool;