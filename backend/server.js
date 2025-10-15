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

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) console.error("❌ Database connection failed:", err);
  else console.log("✅ Connected to MySQL Database");
});

// ===================
// ✅ Helper: JWT Middleware
// ===================
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

// ===================
// ✅ Contact Form
// ===================
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  const sql = "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to save message" });
    res.status(200).json({ message: "Message saved successfully" });
  });
});

// ===================
// ✅ Register
// ===================
app.post("/api/register", async (req, res) => {
  const { name, email, password, role = "guest" } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email is already registered" });
        }
        console.error(err);
        return res.status(500).json({ message: "Registration failed" });
      }
      res.json({ message: "User registered successfully" });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ===================
// ✅ Login
// ===================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0) return res.status(401).json({ message: "Invalid credentials" });

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

// ===================
// ✅ Fetch Guest Messages
// ===================
app.get("/api/messages/me", verifyToken, (req, res) => {
  const sql = "SELECT * FROM messages WHERE email = ? ORDER BY id DESC";
  db.query(sql, [req.user.email], (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch submissions" });
    res.json(results);
  });
});

// ===================
// ✅ Fetch Guest Applications
// ===================
app.get("/api/careers/me", verifyToken, (req, res) => {
  const sql = `
    SELECT a.id, a.resume, a.created_at, j.title AS job_title
    FROM applications a
    LEFT JOIN jobs j ON a.job_id = j.id
    WHERE a.email = ?
    ORDER BY a.id DESC
  `;
  db.query(sql, [req.user.email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch applications" });
    }
    res.json(results);
  });
});

// ===================
// ✅ Submit Career Application
// ===================
app.post("/api/careers/apply", (req, res) => {
  const { name, email, resume, jobId } = req.body;
  const sql = "INSERT INTO applications (name, email, resume, job_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, resume, jobId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to submit application" });
    }
    res.status(200).json({ message: "Application submitted successfully" });
  });
});

// ===================
// ✅ Admin: Fetch All Messages
// ===================
app.get("/api/admin/messages", verifyToken, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const sql = "SELECT * FROM messages ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch messages" });
    res.json(results);
  });
});

// ===================
// ✅ Start Server
// ===================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
