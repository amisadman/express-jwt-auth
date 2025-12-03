import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = 5000;
//parser
app.use(express.json());
// app.use(express.urlencoded());

//db
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STRING}`,
});

const initDb = async () => {
  await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
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

initDb();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello sadman!");
});

//users CRUD
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const q = await pool.query(
      `
            INSERT INTO users(name,email) VALUES ($1,$2) RETURNING *
            `,
      [name, email]
    );

    res.status(201).json({
      success: true,
      message: q.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const usersData = await pool.query(`
      SELECT * FROM users
    `);

    res.status(201).json({
      success: true,
      message: "Data fetched successfully",
      data: usersData.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);

  try {
    const user = await pool.query(
      `
      SELECT * FROM users WHERE id = $1
    `,
      [id]
    );

    if (user.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Data fetched successfully",
        data: user.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
