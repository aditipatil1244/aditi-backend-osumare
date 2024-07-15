const express = require('express');
const app = express();
app.use(express.json());

// In-memory task storage
let tasks = [];

// API Documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Task Management API',
    endpoints: [
      { method: 'GET', path: '/tasks', description: 'Retrieve a list of all tasks' },
      { method: 'GET', path: '/tasks/:id', description: 'Retrieve a specific task by ID' },
      { method: 'POST', path: '/tasks', description: 'Create a new task' },
      { method: 'PUT', path: '/tasks/:id', description: 'Update an existing task by ID' },
      { method: 'DELETE', path: '/tasks/:id', description: 'Delete a task by ID' }
    ]
  });
});

// GET /tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
  } else {
    res.json(task);
  }
});

// POST /tasks
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title ||!description) {
    res.status(400).json({ message: 'Title and description are required' });
  } else {
    const newTask = { id: tasks.length + 1, title, description };
    tasks.push(newTask);
    res.status(201).json(newTask);
  }
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
  } else {
    const { title, description } = req.body;
    if (!title ||!description) {
      res.status(400).json({ message: 'Title and description are required' });
    } else {
      task.title = title;
      task.description = description;
      res.json(task);
    }
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    res.status(404).json({ message: 'Task not found' });
  } else {
    tasks.splice(index, 1);
    res.status(204).json({ message: 'Task deleted' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Task Management API listening on port ${port}`);
});