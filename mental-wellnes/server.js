import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 Serve static frontend files (index.html, css, js)
app.use(express.static(__dirname));

// Routes
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  // temporary mock response
  res.json({ reply: `You said: ${message}` });
});

// 👉 Default route for index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
