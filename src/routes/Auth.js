const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignupData } = require("../utils/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

// Detect environment
const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

// -------------------- LOGIN --------------------
authRouter.post("/login", async (req, res) => {
  try {
    const { password, emailId } = req.body;
    const user = await User.findOne({ emailId });

    if (!user || !user.password) throw new Error("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 24 * 3600000),
    });

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// -------------------- SIGNUP --------------------
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { password, firstName, lastName, emailId, age, gender, skills, photoUrl } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      password: passwordHash,
      firstName,
      lastName,
      emailId,
      age,
      gender,
      skills,
      photoUrl,
    });

    const user = await newUser.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 24 * 3600000),
    });

    res.json({ message: "User added successfully!!", data: user });
  } catch (err) {
    res.status(400).send("error in saving the user:" + err.message);
  }
});

// -------------------- LOGOUT --------------------
authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now()),
    });
    res.send("Logout successful");
  } catch (err) {
    console.log(err.message);
  }
});

// -------------------- GOOGLE AUTH --------------------
authRouter.get("/auth/google", (req, res) => {
  const scopes = ["profile", "email"];
  const authUrl = googleClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
  res.redirect(authUrl);
});

// -------------------- GOOGLE CALLBACK --------------------
authRouter.get("/auth/google/callback", async (req, res) => {
  try {
    const code = req.query.code;

    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);

    // Decode user info
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ emailId: email });

    if (!user) {
      user = new User({
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1] || "",
        emailId: email,
        googleId: sub,
        photoUrl: picture,
      });
      await user.save();
    } else {
      if (!user.googleId) user.googleId = sub;
      if (!user.photoUrl) user.photoUrl = picture;
      await user.save();
    }

    // JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      expires: new Date(Date.now() + 24 * 3600000),
    });

    // ✅ Redirect based on env
    res.redirect(`${FRONTEND_URL}/feed`);
  } catch (err) {
    console.error("Google OAuth error:", err);
    res.status(400).send("Google login failed");
  }
});

module.exports = { authRouter };
