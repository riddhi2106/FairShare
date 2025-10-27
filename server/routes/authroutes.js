const express = require("express");
const router = express.Router();
const passport = require("passport");
const { signup, login } = require("../controllers/authcontroller");

// Email/password routes
router.post("/signup", signup);
router.post("/login", login);

// ✅ Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Generate JWT token
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ✅ Add this route
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});


module.exports = router;
