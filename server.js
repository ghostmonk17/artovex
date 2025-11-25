const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- MONGODB CONNECTION ----------

const MONGODB_URI =
  "mongodb+srv://artovex_user:Sachin123@cluster0.y5muwfv.mongodb.net/artovex?appName=Cluster0";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));


// ---------- USER MODEL ----------

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// ---------- MIDDLEWARE ----------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "artovex-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// ---------- STATIC FILES ----------

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const DATA_FILE = path.join(__dirname, "data", "artworks.json");

// ---------- ARTWORKS HELPERS (JSON FILE) ----------

function readArtworks() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading artworks.json:", err);
    return [];
  }
}

function saveArtworks(artworks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(artworks, null, 2), "utf8");
}

// ---------- AUTH HELPERS ----------

function ensureAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect("/login");
}

// ---------- MULTER SETUP (FILE UPLOAD) ----------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

// ---------- PAGE ROUTES ----------

// Home (index.html) is served automatically from /public

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/dashboard", ensureAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// ---------- AUTH ROUTES (MONGODB USERS) ----------

// Signup (create user)
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("<p>All fields are required.</p><a href='/signup'>Back</a>");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .send("<p>Email already registered. Try logging in.</p><a href='/login'>Go to Login</a>");
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    // Log the user in immediately after signup
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.redirect("/dashboard");
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).send("<p>Signup failed.</p><a href='/signup'>Try again</a>");
  }
});

// Login (check user)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .send("<p>User not found.</p><a href='/login'>Back to Login</a>");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .send("<p>Incorrect password.</p><a href='/login'>Back to Login</a>");
    }

    // Store user in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.redirect("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send("<p>Login failed.</p><a href='/login'>Try again</a>");
  }
});

// ---------- API ROUTES ----------

// Get all artworks
app.get("/api/artworks", (req, res) => {
  const artworks = readArtworks();
  res.json(artworks);
});

// Upload new artwork (only logged-in users)
app.post("/api/upload", ensureAuth, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }

  const { title, description, category } = req.body;

  const artworks = readArtworks();

  const userId = req.session.user ? req.session.user.id : null;

  const newArtwork = {
    id: Date.now().toString(),
    title: title || "Untitled",
    description: description || "",
    category: category || "",
    fileUrl: "/uploads/" + req.file.filename,
    userId, // who uploaded it
  };

  artworks.push(newArtwork);
  saveArtworks(artworks);

  res.json({ success: true, artwork: newArtwork });
});

// ---------- START SERVER ----------

app.listen(PORT, () => {
  console.log(`Artovex server running at http://localhost:${PORT}`);
});
