const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// SQLite setup
const db = new sqlite3.Database("database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      name TEXT PRIMARY KEY,
      age INTEGER,
      height INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted INTEGER DEFAULT 0
    )
  `);
});

// API to add user
app.post("/api/users", (req, res) => {
  const { name, age, height } = req.body;

  if (!name || !age || !height) {
    return res.status(400).send("All fields are required.");
  }

  const query = `INSERT INTO users (name, age, height, created_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                 ON CONFLICT(name) DO UPDATE SET age=excluded.age, height=excluded.height, updated_at=CURRENT_TIMESTAMP`;

  db.run(query, [name, age, height], function (err) {
    if (err) {
      return res.status(500).send("Database error.");
    }
    res.send("User saved successfully.");
  });
});

// API to search user
app.get("/api/users/:name", (req, res) => {
  const name = req.params.name;

  const query = `SELECT * FROM users WHERE name = ? AND deleted = 0`;

  db.get(query, [name], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error." });
    }

    if (!row) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(row);
  });
});

// API to get all users
app.get("/api/users", (req, res) => {
  const query = `SELECT * FROM users WHERE deleted = 0`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error." });
    }
    res.json(rows);
  });
});

// API to update user
app.put("/api/users/:name", (req, res) => {
  const name = req.params.name;
  const { age, height } = req.body;

  if (!age || !height) {
    return res.status(400).send("Age and height are required.");
  }

  const query = `UPDATE users SET age = ?, height = ?, updated_at = CURRENT_TIMESTAMP WHERE name = ?`;

  db.run(query, [age, height, name], function (err) {
    if (err) {
      return res.status(500).send("Database error.");
    }
    if (this.changes === 0) {
      return res.status(404).send("User not found.");
    }
    res.send("User updated successfully.");
  });
});

// API to delete user
app.delete("/api/users/:name", (req, res) => {
  const name = req.params.name;

  const query = `UPDATE users SET deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE name = ?`;

  db.run(query, [name], function (err) {
    if (err) {
      return res.status(500).send("Database error.");
    }
    if (this.changes === 0) {
      return res.status(404).send("User not found.");
    }
    res.send("User deleted successfully.");
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});