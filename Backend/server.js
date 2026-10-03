import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 8080;

// CORS configuration
const allowedOrigins = [
  "https://nova-chat-chi-sandy.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));


app.options("*", cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. API Routes
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB_URI);
    console.log("Connected with Database!");
  } catch (err) {
    console.error("Failed to connect with DB:", err.message);
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});