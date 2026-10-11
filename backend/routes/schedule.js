
const express = require("express");
const router = express.Router();
const db = require("../database/db");


// ==========================================
// SAVE / UPDATE SCHEDULE
// ==========================================
router.post("/", async (req, res) => {

    try {

        const {
            id,
            date,
            area,
            startTime,
            endTime,
            items,
            status,
            notes
        } = req.body;


        // ==========================================
        // BASIC VALIDATION
        // ==========================================

        if (!date || !area || !startTime || !endTime) {

            return res.status(400).json({
                success: false,
                message: "Date, area, start time and end time are required"
            });

        }


        // ==========================================
        // BLOCK SCHEDULE ON SHOP LEAVE DATE
        // ==========================================

        const [leaveRecords] = await db.query(
            `SELECT schedule_id
             FROM shop_schedule
             WHERE leave_date = ?
             LIMIT 1`,
            [date]
        );

        if (leaveRecords.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Shop is on leave on this date. Distribution schedule cannot be created or updated."
            });

        }


        // ==========================================
        // TIME VALIDATION
        // ==========================================

        if (startTime >= endTime) {

            return res.status(400).json({
                success: false,
                message: "End time must be after start time"
            });

        }


        // ==========================================
        // AVAILABLE ITEMS
        // ==========================================

        const selectedItems = Array.isArray(items)
            ? items
            : [];

        const availableItems = selectedItems.join(", ");


        // ==========================================
        // FIND AREA ID
        // ==========================================

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


        // ==========================================
        // UPDATE EXISTING SCHEDULE BY ID
        // ==========================================

        if (id) {

            const [existingSchedule] = await db.query(
                `SELECT distribution_id
                 FROM distribution
                 WHERE distribution_id = ?`,
                [id]
            );


            if (existingSchedule.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Schedule not found"
                });

            }


            await db.query(
                `UPDATE distribution
                 SET
                    distribution_date = ?,
                    area_id = ?,
                    start_time = ?,
                    end_time = ?,
                    status = ?,
                    notes = ?,
                    available_items = ?
                 WHERE distribution_id = ?`,
                [
                    date,
                    areaId,
                    startTime,
                    endTime,
                    status || "Upcoming",
                    notes || null,
                    availableItems,
                    id
                ]
            );


            return res.json({
                success: true,
                message: "Distribution schedule updated successfully!"
            });

        }


        // ==========================================
        // CHECK EXISTING SCHEDULE
        // SAME DATE + SAME AREA
        // ==========================================

        const [existingSchedule] = await db.query(
            `SELECT distribution_id
             FROM distribution
             WHERE distribution_date = ?
             AND area_id = ?
             ORDER BY distribution_id DESC
             LIMIT 1`,
            [date, areaId]
        );


        // ==========================================
        // UPDATE EXISTING SAME DATE + AREA
        // ==========================================

        if (existingSchedule.length > 0) {

            await db.query(
                `UPDATE distribution
                 SET
                    start_time = ?,
                    end_time = ?,
                    status = ?,
                    notes = ?,
                    available_items = ?
                 WHERE distribution_id = ?`,
                [
                    startTime,
                    endTime,
                    status || "Upcoming",
                    notes || null,
                    availableItems,
                    existingSchedule[0].distribution_id
                ]
            );


            return res.json({
                success: true,
                message: "Distribution schedule updated successfully!"
            });

        }


        // ==========================================
        // CREATE NEW SCHEDULE
        // ==========================================

        await db.query(
            `INSERT INTO distribution
            (
                distribution_date,
                area_id,
                start_time,
                end_time,
                status,
                notes,
                available_items
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                date,
                areaId,
                startTime,
                endTime,
                status || "Upcoming",
                notes || null,
                availableItems
            ]
        );


        res.json({
            success: true,
            message: "Distribution schedule saved successfully!"
        });


    } catch (error) {

        console.error("Schedule Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save distribution schedule"
        });

    }

});


// ==========================================
// GET ALL SCHEDULES
// ADMIN HISTORY - KEEP ALL RECORDS
// ==========================================
router.get("/", async (req, res) => {

    try {

        const [schedules] = await db.query(
            `SELECT
                d.distribution_id,
                d.distribution_date,
                a.area_name,
                d.start_time,
                d.end_time,
                d.status,
                d.notes,
                d.available_items
             FROM distribution d
             INNER JOIN areas a
             ON d.area_id = a.area_id
             ORDER BY
                d.distribution_date ASC,
                d.start_time ASC`
        );


        res.json({
            success: true,
            schedules: schedules
        });


    } catch (error) {

        console.error("Get Schedule Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load schedules"
        });

    }

});


// ==========================================
// DELETE SCHEDULE
// ==========================================
router.delete("/:id", async (req, res) => {

    try {

        const scheduleId = req.params.id;


        // CHECK SCHEDULE EXISTS

        const [schedule] = await db.query(
            `SELECT distribution_id
             FROM distribution
             WHERE distribution_id = ?`,
            [scheduleId]
        );


        if (schedule.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Schedule not found"
            });

        }


        // DELETE

        await db.query(
            `DELETE FROM distribution
             WHERE distribution_id = ?`,
            [scheduleId]
        );


        res.json({
            success: true,
            message: "Schedule deleted successfully!"
        });


    } catch (error) {

        console.error("Delete Schedule Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete schedule"
        });

    }

});


module.exports = router;