import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to MySQL Database");
});

// ✅ Contact Form 
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Message saved!");
  });
});

// ✅ Register
app.post("/api/register", async (req, res) => {
  const { name, email, password, role = "guest" } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email is already registered" });
        }
        console.error(err);
        return res.status(500).json({ message: "Registration failed" });
      }
      res.json({ message: "User registered successfully" });
    }
  );
});


// ✅ Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  });
});

// ✅ Middleware for protected routes
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

// ✅ Admin-only route to fetch messages
app.get("/api/admin/messages", verifyToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const sql = "SELECT * FROM messages ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// ✅ Guest-only route to fetch their own messages
app.get("/api/messages/me", verifyToken, (req, res) => {
  const sql = "SELECT * FROM messages WHERE email = ? ORDER BY id DESC";
  db.query(sql, [req.user.email], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});
