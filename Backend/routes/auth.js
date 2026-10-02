import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import crypto from "crypto";
import transporter from "../utils/mailer.js";

const router = express.Router();


router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully!"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                error: "Invalid email or password!"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (isMatch) {
            const token = jwt.sign(
                { userId: existingUser._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                message: "Login successful!",
                token
            });
        }

        return res.status(400).json({
            error: "Invalid email or password!"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});


router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: "No account found with this email"
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetToken = resetToken;

        user.resetTokenExpiry =
            Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "NovaChat Password Reset",
            text: `Click this link to reset your NovaChat password: ${resetLink}`
        });

        res.json({
            message: "Password reset link sent to your email"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});


router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                error: "New password is required"
            });
        }

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: {
                $gt: Date.now()
            }
        });

        if (!user) {
            return res.status(400).json({
                error: "Invalid or expired reset token"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        user.resetToken = null;
        user.resetTokenExpiry = null;

        await user.save();

        res.json({
            message: "Password reset successfully"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});


router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("name email");

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.json({
            name: user.name,
            email: user.email
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: "Failed to fetch user"
        });
    }
});


export default router;