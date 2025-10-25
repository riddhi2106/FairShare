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

module.exports = router;
