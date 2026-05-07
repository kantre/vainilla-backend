import { query } from "../config/db.js";

const User = {

  // ✅ crear usuario
  create: async (name, email, password, role = "user") => {

    const result = await query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, email, password, role]
    );

    return result.rows[0];
  },

  // ✅ buscar por email
  findByEmail: async (email) => {

    const result = await query(
      `
      SELECT * FROM users
      WHERE email = $1
      `,
      [email]
    );

    return result.rows[0];
  }
};

export default User;