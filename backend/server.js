const express = require("express");
const cors = require("cors");
const db = require("./database/db");

const itemsRoutes = require("./routes/items");
const shopRoutes = require("./routes/shop");
const scheduleRoutes = require("./routes/schedule");
const specialIssueRoutes = require("./routes/specialIssue");
const publicNumbersRoutes = require("./routes/publicNumbers");
const smsRoutes = require("./routes/sms");
const publicRoutes = require("./routes/public");
const authRoutes = require("./routes/auth");


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.use("/api/items", itemsRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/special-issue", specialIssueRoutes);
app.use("/api/public-numbers", publicNumbersRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.json({
        message:
            "Smart Ration Shop Backend is running successfully!"
    });

});


// ==========================================
// DATABASE TEST
// ==========================================

app.get("/api/db-test", async (req, res) => {

    try {

        const [rows] =
            await db.query(
                "SELECT 1 AS connected"
            );

        res.json({

            success: true,

            message:
                "MySQL database connected successfully!",

            result: rows

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Database connection failed"

        });

    }

});


// ==========================================
// CLEAR TODAY'S INFORMATION
// ==========================================

app.delete("/api/clear-today", async (req, res) => {

    let connection;

    try {

        // Get dedicated database connection
        connection = await db.getConnection();


        // Start transaction
        await connection.beginTransaction();


        // ==========================================
        // 1. CLEAR TODAY'S ITEMS
        // ==========================================

        const [itemsResult] =
            await connection.query(
                `DELETE FROM daily_items
                 WHERE item_date = CURDATE()`
            );


        // ==========================================
        // 2. CLEAR TODAY'S SHOP INFORMATION
        // ==========================================

        const [shopResult] =
            await connection.query(
                `DELETE FROM shop_schedule
                 WHERE schedule_date = CURDATE()`
            );


        // ==========================================
        // 3. CLEAR TODAY'S AREA DISTRIBUTION
        // ==========================================

        const [scheduleResult] =
            await connection.query(
                `DELETE FROM distribution
                 WHERE distribution_date = CURDATE()`
            );


        // ==========================================
        // CONFIRM ALL CHANGES
        // ==========================================

        await connection.commit();


        console.log(
            "Today's information cleared successfully."
        );


        res.json({

            success: true,

            message:
                "Today's information cleared successfully!",

            deleted: {

                items:
                    itemsResult.affectedRows,

                shop:
                    shopResult.affectedRows,

                schedule:
                    scheduleResult.affectedRows

            }

        });


    } catch (error) {

        console.error(
            "Clear Today Error:",
            error
        );


        // Rollback if something goes wrong

        if (connection) {

            try {

                await connection.rollback();

            } catch (rollbackError) {

                console.error(
                    "Rollback Error:",
                    rollbackError
                );

            }

        }


        res.status(500).json({

            success: false,

            message:
                "Failed to clear today's information"

        });


    } finally {

        // Release connection

        if (connection) {

            connection.release();

        }

    }

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Backend server running at http://localhost:${PORT}`
    );

});