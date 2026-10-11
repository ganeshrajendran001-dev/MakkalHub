const express = require("express");
const router = express.Router();
const db = require("../database/db");


// ==========================================
// GET TODAY'S SAVED DAILY ITEMS
// ==========================================

router.get("/", async (req, res) => {

    try {

        // Get today's date in India
        const today = new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: "Asia/Kolkata"
            }
        ).format(new Date());


        const [items] = await db.query(

            `SELECT
                d.daily_item_id,
                d.item_date,
                i.item_name,
                d.quantity,
                d.unit,
                d.price,
                d.availability
             FROM daily_items d
             INNER JOIN items i
                ON d.item_id = i.item_id
             WHERE d.item_date = ?
             ORDER BY
                d.daily_item_id DESC`,

            [today]

        );


        res.json({

            success: true,

            date: today,

            items: items

        });

    }

    catch (error) {

        console.error(
            "Get Today's Daily Items Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to load today's item information"

        });

    }

});



// ==========================================
// SAVE TODAY'S DAILY ITEM
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            itemName,
            itemPrice,
            itemUnit,
            itemQuantity,
            availability
        } = req.body;


        // ==========================================
        // AUTOMATIC TODAY'S DATE
        // ==========================================

        const today = new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: "Asia/Kolkata"
            }
        ).format(new Date());


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !itemName ||
            itemPrice === "" ||
            itemPrice === undefined ||
            itemPrice === null
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Item name and price are required"

            });

        }


        // ==========================================
        // FIND MASTER ITEM
        // ==========================================

        const [items] =
            await db.query(

                `SELECT item_id
                 FROM items
                 WHERE item_name = ?`,

                [itemName]

            );


        if (items.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Item not found"

            });

        }


        const itemId =
            items[0].item_id;


        // ==========================================
        // CHECK DUPLICATE TODAY'S ITEM
        // ==========================================

        const [existingItem] =
            await db.query(

                `SELECT daily_item_id
                 FROM daily_items
                 WHERE item_date = ?
                 AND item_id = ?`,

                [
                    today,
                    itemId
                ]

            );


        if (existingItem.length > 0) {

            return res.status(409).json({

                success: false,

                message:
                    `${itemName} is already added for today.`

            });

        }


        // ==========================================
        // SAVE TODAY'S ITEM
        // ==========================================

        await db.query(

            `INSERT INTO daily_items
            (
                item_date,
                item_id,
                quantity,
                unit,
                price,
                availability
            )
            VALUES (?, ?, ?, ?, ?, ?)`,

            [
                today,
                itemId,
                itemQuantity || 0,
                itemUnit || "Kg",
                itemPrice,
                availability || "Available"
            ]

        );


        res.json({

            success: true,

            date: today,

            message:
                "Today's item information saved successfully!"

        });

    }

    catch (error) {

        console.error(
            "Save Today's Item Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to save today's item information"

        });

    }

});



// ==========================================
// DELETE TODAY'S DAILY ITEM
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const dailyItemId =
            req.params.id;


        // ==========================================
        // VALIDATE ID
        // ==========================================

        if (!dailyItemId) {

            return res.status(400).json({

                success: false,

                message:
                    "Daily item ID is required"

            });

        }


        // ==========================================
        // GET TODAY'S DATE
        // ==========================================

        const today = new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: "Asia/Kolkata"
            }
        ).format(new Date());


        // ==========================================
        // CHECK TODAY'S ITEM EXISTS
        // ==========================================

        const [existingItem] =
            await db.query(

                `SELECT daily_item_id
                 FROM daily_items
                 WHERE daily_item_id = ?
                 AND item_date = ?`,

                [
                    dailyItemId,
                    today
                ]

            );


        if (existingItem.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Today's item not found"

            });

        }


        // ==========================================
        // DELETE TODAY'S ITEM ONLY
        // ==========================================

        await db.query(

            `DELETE FROM daily_items
             WHERE daily_item_id = ?
             AND item_date = ?`,

            [
                dailyItemId,
                today
            ]

        );


        res.json({

            success: true,

            message:
                "Today's item deleted successfully!"

        });

    }

    catch (error) {

        console.error(
            "Delete Today's Item Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to delete today's item"

        });

    }

});


module.exports = router;