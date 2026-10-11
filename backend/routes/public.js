
const express = require("express");
const router = express.Router();
const db = require("../database/db");


// ==========================================
// GET PUBLIC SHOP INFORMATION
// ==========================================

router.get("/", async (req, res) => {

    try {

        // ==========================================
        // SHOP STATUS - TODAY
        // ==========================================

        
const [shopStatus] = await db.query(
    `SELECT
        schedule_date,
        shop_status,
        in_time,
        out_time,
        admin_status,
        leave_date,
        leave_reason,
        next_available_date
     FROM shop_schedule
     WHERE schedule_date = CURDATE()
       AND is_archived = 0
     ORDER BY schedule_id DESC
     LIMIT 1`
);

        // ==========================================
        // TODAY'S ITEMS
        // ==========================================

        const [items] = await db.query(
            `SELECT
                di.daily_item_id,
                i.item_name,
                di.quantity,
                di.unit,
                di.price,
                di.availability
             FROM daily_items di
             INNER JOIN items i
             ON di.item_id = i.item_id
             WHERE di.item_date = CURDATE()
             ORDER BY di.daily_item_id DESC`
        );


        // ==========================================
        // AREA-WISE NEXT NEAREST SCHEDULE
        // EXCLUDE SHOP LEAVE DATES
        // ==========================================

        const [schedule] = await db.query(
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
             INNER JOIN (
                 SELECT
                     dist.area_id,
                     MIN(dist.distribution_date) AS nearest_date
                 FROM distribution dist
                 WHERE dist.distribution_date >= CURDATE()
                   AND NOT EXISTS (
                       SELECT 1
                       FROM shop_schedule ss
                       WHERE ss.leave_date = dist.distribution_date
                   )
                 GROUP BY dist.area_id
             ) nearest
             ON d.area_id = nearest.area_id
             AND d.distribution_date = nearest.nearest_date
             WHERE d.distribution_date >= CURDATE()
               AND NOT EXISTS (
                   SELECT 1
                   FROM shop_schedule ss
                   WHERE ss.leave_date = d.distribution_date
               )
             ORDER BY
                 d.distribution_date ASC,
                 a.area_name ASC`
        );


        // ==========================================
        // TOMORROW'S SCHEDULE
        // EXCLUDE SHOP LEAVE DATE
        // ==========================================

        const [tomorrowSchedule] = await db.query(
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
             WHERE d.distribution_date =
                   DATE_ADD(CURDATE(), INTERVAL 1 DAY)
               AND NOT EXISTS (
                   SELECT 1
                   FROM shop_schedule ss
                   WHERE ss.leave_date = d.distribution_date
               )
             ORDER BY
                 a.area_name ASC,
                 d.distribution_id ASC`
        );


        // ==========================================
        // SPECIAL GOVERNMENT ISSUES
        // ==========================================

        const [specialIssues] = await db.query(
            `SELECT
                issue_id,
                issue_month,
                item_name,
                quantity,
                unit,
                issue_date,
                eligible_area,
                description
             FROM special_issue
             WHERE issue_date IS NULL
                OR issue_date >= CURDATE()
             ORDER BY
                issue_date ASC,
                issue_id DESC`
        );


        // ==========================================
        // SEND RESPONSE
        // ==========================================

        res.json({
            success: true,

            shopStatus:
                shopStatus.length > 0
                    ? shopStatus[0]
                    : null,

            items: items,

            schedule: schedule,

            tomorrowSchedule: tomorrowSchedule,

            specialIssues: specialIssues
        });


    } catch (error) {

        console.error(
            "Public Information Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load public information"
        });

    }

});


module.exports = router;