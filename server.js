import express from "express";
import cors from "cors";             
import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

});


app.get("/notes", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM keeper ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/notes", async (req, res) => {
  const { title, content } = req.body ?? {};
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
  try {
    await pool.query("DELETE FROM keeper WHERE id=$1", [req.params.id]);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuild = path.join(__dirname, "dist"); 

app.use(express.static(clientBuild));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientBuild, "index.html"));
});


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on :${PORT}`));
