const express = require("express");
const serverless = require("serverless-http");
const router = express.Router();
const todos = require("../db");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to list all todo items
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// Route to get a specific todo item by ID
app.get("/api/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === todoId);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  res.json(todo);
});

// Route to create a new todo item
app.post("/api/todos", (req, res) => {
  const { title, checked } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  const newTodo = {
    id: todos.length + 1,
    title,
    checked: checked || false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Route to update a todo item by ID
app.put("/api/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === todoId);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  const { title, checked } = req.body;
  if (title) {
    todo.title = title;
  }
  if (checked !== undefined) {
    todo.checked = checked;
  }
  res.json(todo);
});

// Route to delete a todo item by ID
app.delete("/api/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const index = todos.findIndex((todo) => todo.id === todoId);
  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  todos.splice(index, 1);
  res.status(204).send();
});

// Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

app.use("/.netlify/functions/app", router);
module.exports.handler = serverless(app);
