const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database/db");

const router = express.Router();

// ADMIN LOGIN
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const [rows] = await db.query(
            `SELECT admin_id, username, password
             FROM admin
             WHERE username = ?
             LIMIT 1`,
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const admin = rows[0];

        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        res.json({
            success: true,
            message: "Login successful",
            admin: {
                admin_id: admin.admin_id,
                username: admin.username
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});


// CHANGE ADMIN PASSWORD
router.post("/change-password", async (req, res) => {
    try {
        const {
            username,
            currentPassword,
            newPassword
        } = req.body;

        if (!username || !currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must contain at least 6 characters"
            });
        }

        const [rows] = await db.query(
            `SELECT admin_id, username, password
             FROM admin
             WHERE username = ?
             LIMIT 1`,
            [username]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin account not found"
            });
        }

        const admin = rows[0];

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const newHashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        await db.query(
            `UPDATE admin
             SET password = ?
             WHERE admin_id = ?`,
            [
                newHashedPassword,
                admin.admin_id
            ]
        );

        res.json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {

        console.error(
            "Change Password Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to change password"
        });
    }
});

module.exports = router;