const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../db/schema/schema");
const auth = require("../middleware/auth");

const router = express.Router();

// Define user-related routes
router.get("/", (req, res) => {
    res.send("User route");
});

// Register route
router.post("/register", async (req, res) => {
    const { username, inGameName, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            inGameName,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Login route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid password");
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Change password route
router.post("/change-password", auth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(400).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid old password");
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).send("Password changed successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
