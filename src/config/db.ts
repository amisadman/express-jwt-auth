import { Pool } from "pg";
import config from ".";

//db
export const pool = new Pool({
  connectionString: `${config.connection_string}`,
});

const initDb = async () => {
  await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password TEXT,
            age INT,
            address TEXT,
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

  await pool.query(
    `CREATE TABLE IF NOT EXISTS todos(
             id SERIAL PRIMARY KEY,
             userid INT REFERENCES users(id) ON DELETE CASCADE,
             title VARCHAR(200) NOT NULL,
             description TEXT,
             completed BOOLEAN DEFAULT false,
             due_date DATE,
             created_at TIMESTAMP DEFAULT NOW(),
             updated_at TIMESTAMP DEFAULT NOW()

            )
            `
  );
};
export default initDb;
