import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        })

        await newUser.save();
        res.status(201).json({ message: "User created successfully!" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" })
    }


});



router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ error: "Invalid email or password!" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

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
        res.status(500).json({ error: "Something went wrong" })
    }
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("name email");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
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