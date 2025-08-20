import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PS,
  port: process.env.PG_PORT,
});

app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM keeper");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
 
});

app.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  console.log(req.body);
  try {
    const result = await pool.query(
      "INSERT INTO keeper(title, content) VALUES($1, $2) RETURNING *",
      [title, content]
    );


    
    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM keeper WHERE id=$1", [id]);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
