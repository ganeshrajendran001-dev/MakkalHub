const express = require("express");
const router = express.Router();
const db = require("../database/db");


// =========================================
// DELETE EXPIRED SPECIAL ISSUES
// =========================================

async function deleteExpiredIssues() {
    try {

        await db.query(
            `DELETE FROM special_issue
             WHERE issue_date IS NOT NULL
             AND issue_date < CURDATE()`
        );

    } catch (error) {

        console.error(
            "Delete Expired Special Issues Error:",
            error
        );
    }
}


// =========================================
// GET ALL SPECIAL GOVERNMENT ISSUES
// =========================================

router.get("/", async (req, res) => {

    try {

        // Delete expired issues before loading
        await deleteExpiredIssues();


        const [issues] = await db.query(
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
             ORDER BY issue_date ASC, issue_id DESC`
        );


        res.json({
            success: true,
            issues: issues
        });


    } catch (error) {

        console.error(
            "Load Special Issues Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to load special government issues"
        });
    }
});


// =========================================
// SAVE SPECIAL GOVERNMENT ISSUE
// =========================================

router.post("/", async (req, res) => {

    try {

        const {
            issueMonth,
            itemName,
            quantity,
            unit,
            issueDate,
            eligibleArea,
            description
        } = req.body;


        // Required fields
        if (!issueMonth || !itemName) {

            return res.status(400).json({
                success: false,
                message:
                    "Month and item name are required"
            });
        }


        // =========================================
        // CHECK ISSUE DATE BELONGS TO SELECTED MONTH
        // =========================================

        if (issueDate) {

            const selectedMonth =
                String(issueMonth).substring(0, 7);

            const selectedDate =
                String(issueDate).substring(0, 7);


            if (selectedMonth !== selectedDate) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Issue date must belong to the selected month"
                });
            }
        }


        // =========================================
        // PREVENT EXPIRED ISSUE DATE
        // =========================================

        if (issueDate) {

            const [expiredCheck] = await db.query(
                `SELECT
                    CASE
                        WHEN ? < CURDATE()
                        THEN 1
                        ELSE 0
                    END AS expired`,
                [issueDate]
            );


            if (
                expiredCheck.length > 0 &&
                expiredCheck[0].expired === 1
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Issue date has already passed"
                });
            }
        }


        // =========================================
        // SAVE ISSUE
        // =========================================

        await db.query(
            `INSERT INTO special_issue
            (
                issue_month,
                item_name,
                quantity,
                unit,
                issue_date,
                eligible_area,
                description
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                issueMonth,
                itemName,
                quantity || 0,
                unit || null,
                issueDate || null,
                eligibleArea || "All Areas",
                description || null
            ]
        );


        res.json({
            success: true,
            message:
                "Special government issue saved successfully!"
        });


    } catch (error) {

        console.error(
            "Save Special Issue Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to save special government issue"
        });
    }
});


// =========================================
// DELETE SPECIAL GOVERNMENT ISSUE MANUALLY
// =========================================

router.delete("/:id", async (req, res) => {

    try {

        const issueId =
            Number(req.params.id);


        if (!issueId) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid special issue ID"
            });
        }


        const [result] = await db.query(
            `DELETE FROM special_issue
             WHERE issue_id = ?`,
            [issueId]
        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "Special government issue not found"
            });
        }


        res.json({
            success: true,
            message:
                "Special government issue deleted successfully!"
        });


    } catch (error) {

        console.error(
            "Delete Special Issue Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to delete special government issue"
        });
    }
});


// =========================================
// AUTOMATIC EXPIRED ISSUE CLEANUP
// =========================================

// Check every 1 hour
setInterval(
    deleteExpiredIssues,
    60 * 60 * 1000
);


// Run once when backend starts
deleteExpiredIssues();


module.exports = router;