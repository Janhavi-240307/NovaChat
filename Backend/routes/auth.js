import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

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
            return res.status(200).json({
                message: "Login successful!"
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

export default router;