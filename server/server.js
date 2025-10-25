const express = require("express");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectDB = require("./config/db"); // MongoDB connection
const authRoutes = require("./routes/authroutes");
require("./config/passport"); // GoogleStrategy setup

// Initialize Express
const app = express();

// Connect to MongoDB Atlas
connectDB();

// ✅ Robust CORS middleware for Express 5
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Respond immediately to preflight requests
  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ✅ Register your routes AFTER CORS setup
app.use("/api/auth", authRoutes);

// Google OAuth callback
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

// Default route
app.get("/", (req, res) => {
  res.send("✅ Server is running and connected to MongoDB Atlas!");
});

// Start server
const PORT = process.env.PORT || 8787;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
