import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";
import crypto from "crypto";
import transporter from "../utils/mailer.js";

const router = express.Router();


// ==================== SIGNUP ====================

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


// ==================== LOGIN ====================

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


// ==================== FORGOT PASSWORD ====================

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

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetToken = resetToken;

        // Token expires after 15 minutes
        user.resetTokenExpiry =
            Date.now() + 15 * 60 * 1000;

        await user.save();

        // Create reset password link
        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send email using Resend
        const { data, error } = await transporter.emails.send({
            from: "NovaChat <onboarding@resend.dev>",
            to: [user.email],
            subject: "NovaChat Password Reset",
            html: `
                <h2>NovaChat Password Reset</h2>

                <p>You requested to reset your NovaChat password.</p>

                <p>
                    Click the button below to reset your password:
                </p>

                <p>
                    <a
                        href="${resetLink}"
                        style="
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #171b32;
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                        "
                    >
                        Reset Password
                    </a>
                </p>

                <p>
                    This password reset link will expire in 15 minutes.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>
            `
        });

        // Resend returned an error
        if (error) {
            console.log("Resend error:", error);

            return res.status(500).json({
                error: "Failed to send password reset email"
            });
        }

        console.log("Password reset email sent:", data);

        res.json({
            message: "Password reset link sent to your email"
        });

    } catch (err) {
        console.log("Forgot password error:", err);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});


// ==================== RESET PASSWORD ====================

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

        // Remove reset token after successful password reset
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


// ==================== GET CURRENT USER ====================

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