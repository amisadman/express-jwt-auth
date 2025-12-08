import { pool } from "../../config/db";

type TParams = string | undefined;

const createTodo = async (userid: TParams, title: TParams) => {
  const result = await pool.query(
    `INSERT INTO todos (userid,title) VALUES($1,$2) RETURNING *`,
    [userid, title]
  );
  return result;
};

const getTodos = async () => {
  const todoData = await pool.query(`
      SELECT * FROM todos
    `);
  return todoData;
};

const getTodosById = async (id: TParams) => {
  const todoData = await pool.query(
    `
      SELECT * FROM todos WHERE id=$1
    `,
    [id]
  );
  return todoData;
};
const getTodosByUser = async (id: TParams) => {
  const todoData = await pool.query(
    `
      SELECT * FROM todos WHERE userid=$1
    `,
    [id]
  );
  return todoData;
};
const editTodo = async (title: TParams, id: TParams) => {
  const todoData = await pool.query(
    `
      UPDATE todos SET title=$1 WHERE id=$2 RETURNING *
    `,
    [title, id]
  );
  return todoData;
};
const deleteTodo = async (id: TParams) => {
  const todoData = await pool.query(
    `
      DELETE FROM todos WHERE id=$1 RETURNING *
    `,
    [id]
  );
  return todoData;
};

export const todosService = {
  createTodo,
  getTodos,
  getTodosById,
  getTodosByUser,
  editTodo,
  deleteTodo,
};
