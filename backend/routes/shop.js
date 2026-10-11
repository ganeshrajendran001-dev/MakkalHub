
const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET SHOP STATUS HISTORY
router.get("/", async (req, res) => {
    try {
        const [records] = await db.query(
            `SELECT
                schedule_id,
                schedule_date,
                shop_status,
                in_time,
                out_time,
                admin_status,
                leave_date,
                leave_reason,
                next_available_date,
                is_archived
             FROM shop_schedule
             ORDER BY schedule_date DESC, schedule_id DESC`
        );

        res.json({ success: true, records });
    } catch (error) {
        console.error("Shop History Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load shop status history"
        });
    }
});

// SAVE / UPDATE SHOP STATUS
router.post("/", async (req, res) => {
    try {
        const {
            id,
            scheduleDate,
            shopStatus,
            inTime,
            outTime,
            adminStatus,
            leaveDate,
            leaveReason,
            nextAvailableDate
        } = req.body;

        if (!scheduleDate || !shopStatus) {
            return res.status(400).json({
                success: false,
                message: "Date and shop status are required"
            });
        }

        const values = [
            scheduleDate,
            shopStatus,
            inTime || null,
            outTime || null,
            adminStatus || "Available",
            leaveDate || null,
            leaveReason || null,
            nextAvailableDate || null
        ];

        // EDIT A SPECIFIC RECORD
        if (id) {
            const [existing] = await db.query(
                `SELECT schedule_id
                 FROM shop_schedule
                 WHERE schedule_id = ?
                 AND is_archived = 0`,
                [id]
            );

            if (existing.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Active shop status record not found"
                });
            }

            await db.query(
                `UPDATE shop_schedule
                 SET
                    schedule_date = ?,
                    shop_status = ?,
                    in_time = ?,
                    out_time = ?,
                    admin_status = ?,
                    leave_date = ?,
                    leave_reason = ?,
                    next_available_date = ?
                 WHERE schedule_id = ?`,
                [...values, id]
            );

            return res.json({
                success: true,
                message: "Shop information updated successfully!"
            });
        }

        // PRESERVE ORIGINAL SAVE BEHAVIOUR:
        // Update the latest active record for this date.
        const [existing] = await db.query(
            `SELECT schedule_id
             FROM shop_schedule
             WHERE schedule_date = ?
               AND is_archived = 0
             ORDER BY schedule_id DESC
             LIMIT 1`,
            [scheduleDate]
        );

        if (existing.length > 0) {
            await db.query(
                `UPDATE shop_schedule
                 SET
                    shop_status = ?,
                    in_time = ?,
                    out_time = ?,
                    admin_status = ?,
                    leave_date = ?,
                    leave_reason = ?,
                    next_available_date = ?
                 WHERE schedule_id = ?`,
                [
                    shopStatus,
                    inTime || null,
                    outTime || null,
                    adminStatus || "Available",
                    leaveDate || null,
                    leaveReason || null,
                    nextAvailableDate || null,
                    existing[0].schedule_id
                ]
            );

            return res.json({
                success: true,
                message: "Shop information updated successfully!"
            });
        }

        await db.query(
            `INSERT INTO shop_schedule
            (
                schedule_date,
                shop_status,
                in_time,
                out_time,
                admin_status,
                leave_date,
                leave_reason,
                next_available_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            values
        );

        res.json({
            success: true,
            message: "Shop information saved successfully!"
        });

    } catch (error) {
        console.error("Shop Status Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save shop information"
        });
    }
});

// ARCHIVE SHOP STATUS — KEEP RECORD IN DATABASE

router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid shop status ID"
            });
        }

        const [result] = await db.query(
            `DELETE FROM shop_schedule WHERE schedule_id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Shop status record not found"
            });
        }

        res.json({
            success: true,
            message: "Shop status permanently deleted."
        });

    } catch (error) {
        console.error("Delete Shop Status Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete shop status"
        });
    }
});
module.exports = router;