import config from "../../config";
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

type TParams = string | undefined;

const createUserInDb = async (payload: Record<string,unknown>) => {
  const { name, email,password } = payload;
  
  const hashedPass = await bcrypt.hash( password as string, Number(config.salt));
  console.log(hashedPass)

  const result = await pool.query(
    `
            INSERT INTO users(name,email,password) VALUES ($1,$2,$3) RETURNING *
            `,
    [name, email,hashedPass]
  );
  return result;
};

const getUsers = async () => {
  const result = await pool.query(`
      SELECT * FROM users
    `);
  return result;
};

const getUserById = async (id: TParams) => {
  const result = await pool.query(
    `
      SELECT * FROM users WHERE id = $1
    `,
    [id]
  );
  return result;
};
const editUser = async (name: TParams, email: TParams, id: TParams) => {
  const result = await pool.query(
    `
      UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *
    `,
    [name, email, id]
  );
  return result;
};
const deleteUser = async (id: TParams) => {
  const result = await pool.query(
    `
      DELETE FROM users WHERE id=$1
    `,
    [id]
  );
  return result;
};

export const userServices = {
  createUserInDb,
  getUsers,
  getUserById,
  editUser,
  deleteUser,
};
