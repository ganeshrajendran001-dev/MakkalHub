const express = require("express");
const router = express.Router();
const db = require("../database/db");


// ADD MEMBER
router.post("/", async (req, res) => {
    try {
        const {
            name,
            mobileNumber,
            area
        } = req.body;

        if (!name || !mobileNumber || !area) {
            return res.status(400).json({
                success: false,
                message: "Name, mobile number and area are required"
            });
        }

        if (!/^[0-9]{10}$/.test(mobileNumber)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid 10-digit mobile number"
            });
        }

        const [areas] = await db.query(
            "SELECT area_id FROM areas WHERE area_name = ?",
            [area]
        );

        if (areas.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Area not found"
            });
        }

        const areaId = areas[0].area_id;

        await db.query(
            `INSERT INTO public_users
            (name, mobile_number, area_id)
            VALUES (?, ?, ?)`,
            [
                name,
                mobileNumber,
                areaId
            ]
        );

        res.json({
            success: true,
            message: "Member added successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add member"
        });
    }
});


// GET MEMBERS BY AREA
router.get("/", async (req, res) => {
    try {

        const { area } = req.query;

        if (!area) {
            return res.status(400).json({
                success: false,
                message: "Area is required"
            });
        }

        const [members] = await db.query(
            `SELECT
                pu.user_id,
                pu.name,
                pu.mobile_number,
                a.area_name
             FROM public_users pu
             INNER JOIN areas a
             ON pu.area_id = a.area_id
             WHERE a.area_name = ?
             ORDER BY pu.user_id DESC`,
            [area]
        );

        res.json({
            success: true,
            members: members
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to load members"
        });
    }
});


// DELETE MEMBER
router.delete("/:id", async (req, res) => {
    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM public_users WHERE user_id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        res.json({
            success: true,
            message: "Member deleted successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete member"
        });
    }
});


module.exports = router;