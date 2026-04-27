// server.js
require("dotenv").config(); // ✅ load env vars first

const cors = require("cors");
const express = require("express");
const session = require("express-session");
const passport = require("./config/PassportConfig");
const mongoose = require("./config/Database"); // ⬅️ import mongoose (already connected)

const UserRouter = require("./routes/UserRoutes");
const ResumeRouter = require("./routes/ResumeRoutes");
const profileRouter = require("./routes/profile");
const paymentRouter = require("./routes/payment");
const aiRouter = require("./routes/aiRoutes");

// Environment variable validation
const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET_KEY",
  "SESSION_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET"
];

const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`❌ Missing required environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // only set cookie over https in production
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/test", (req, res) => {
  res.status(201).json({ message: "This is test route" });
});

app.use("/", profileRouter);
app.use("/users", UserRouter);
app.use("/Resume", ResumeRouter);
app.use("/", paymentRouter);
app.use("/ai", aiRouter);

app.use((req, res) => {
  res.status(200).json({ message: "This request is undefined" });
});

app.get("/login", (req, res) => {
  res.send("Please Login again.....");
});

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
