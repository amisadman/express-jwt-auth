import express, { NextFunction, Request, Response } from "express";
import { Pool, Result } from "pg";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
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
//logger
const filePath = path.join(process.cwd(),"./src/logger.txt");
const logger = (req: Request,res:Response,next:NextFunction)=>{
  const log = `[${new Date().toISOString()}] ${req.method} ${req.path} \n`;
  fs.appendFile(filePath,log,(err)=>{
    if(err){
      console.log(err.message);
    }else{
      console.log("Log added successfully");
      console.log(log);
    }
  })
}

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello sadman!");
});

//users CRUD
app.post("/users",logger, async (req: Request, res: Response) => {
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

app.get("/users",logger, async (req: Request, res: Response) => {
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

app.get("/users/:id",logger, async (req: Request, res: Response) => {
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

app.put("/users/:id",logger, async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);

  try {
    const user = await pool.query(
      `
      UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *
    `,
      [req.body.name, req.body.email, req.params.id]
    );

    if (user.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Data updated successfully",
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

app.delete("/users/:id",logger, async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);

  try {
    const user = await pool.query(
      `
      DELETE FROM users WHERE id=$1
    `,
      [req.params.id]
    );

    if (user.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Data Deleted successfully",
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

//todo
app.post("/todos",logger, async (req: Request, res: Response) => {
  const todo = req.body;
  console.log(todo);
  try {
    const result = await pool.query(
      `INSERT INTO todos (userid,title) VALUES($1,$2) RETURNING *`,
      [req.body.userid, req.body.title]
    );
    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/todos",logger, async (req: Request, res: Response) => {
  try {
    const todoData = await pool.query(`
      SELECT * FROM todos
    `);

    res.status(201).json({
      success: true,
      message: "Data fetched successfully",
      data: todoData.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
app.get("/todos/:id",logger, async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const todoData = await pool.query(`
      SELECT * FROM todos WHERE id=$1
    `,[req.params.id]);

    res.status(201).json({
      success: true,
      message: "Data fetched successfully",
      data: todoData.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
app.get("/todos/user/:id",logger, async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const todoData = await pool.query(`
      SELECT * FROM todos WHERE userid=$1
    `,[req.params.id]);

    res.status(201).json({
      success: true,
      message: "Data fetched successfully",
      data: todoData.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
app.put("/todos/:id",logger, async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const todoData = await pool.query(`
      UPDATE todos SET title=$1 WHERE id=$2 RETURNING *
    `,[req.body.title,req.params.id]);

    res.status(201).json({
      success: true,
      message: "Data updated successfully",
      data: todoData.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
app.delete("/todos/:id",logger, async (req: Request, res: Response) => {
  console.log(req.params.id);
  try {
    const todoData = await pool.query(`
      DELETE FROM todos WHERE id=$1 RETURNING *
    `,[req.params.id]);

 if (todoData.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Data not found",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Data Deleted successfully",
        data: todoData.rows,
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
