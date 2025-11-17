import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";


// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads"); // folder to save uploaded resumes
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

dotenv.config();

const app = express();
// Serve uploaded files from public/uploads
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

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
import nodemailer from "nodemailer";

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1️⃣ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use "Outlook", "Yahoo", or a custom SMTP config
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your app-specific password
      },
    });

    // 2️⃣ Create email content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "unabiaray0@gmail.com", // your receiving email
      subject: `📬 New Message from ${name}`,
      text: `You received a new message from ${name} (${email}):\n\n${message}`,
    };

    // 3️⃣ Send email
    await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully from ${email}`);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ message: "Failed to send email." });
  }
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
// ✅ Get Logged-in User
// ===================
app.get("/api/auth/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
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
    SELECT a.id, a.resume_path, a.applied_at, j.title AS job_title
    FROM applications a
    LEFT JOIN jobs j ON a.job_id = j.id
    WHERE a.applicant_email = ?
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
app.post("/api/careers/apply", verifyToken, upload.single("resume"), (req, res) => {
  const { jobId } = req.body;
  const resumeFile = req.file;

  const name = req.user.name;
  const email = req.user.email;

  if (!resumeFile) {
    return res.status(400).json({ message: "Resume file is required" });
  }

  const resumePath = `/uploads/${resumeFile.filename}`;

  const sql = "INSERT INTO applications (applicant_name, applicant_email, resume_path, job_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, resumePath, jobId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to submit application" });
    }
    res.status(200).json({ message: "Application submitted successfully!" });
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

// ===================
// Get All Jobs (Public)
// ===================

app.get("/api/jobs", (req, res) => {
  const sql = "SELECT * FROM jobs ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch jobs" });
    res.json(results);
  });
});

// ===================
// Get All Jobs (Admin)
// ===================

app.post("/api/admin/jobs", verifyToken, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const { title, description } = req.body;
  if (!title || !description) return res.status(400).json({ message: "Missing fields" });

  const sql = "INSERT INTO jobs (title, description) VALUES (?, ?)";
  db.query(sql, [title, description], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to add job" });
    res.status(201).json({ id: result.insertId, title, description });
  });
});

// ===================
// Delete Jobs (Admin)
// ===================

app.delete("/api/admin/jobs/:id", verifyToken, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });

  const { id } = req.params;
  const sql = "DELETE FROM jobs WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Failed to delete job" });
    res.status(204).end();
  });
});

