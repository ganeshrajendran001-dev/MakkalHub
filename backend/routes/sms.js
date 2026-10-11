const express = require("express");
const router = express.Router();
const db = require("../database/db");
const { translate } = require("@vitalets/google-translate-api");

require("dotenv").config();


// ========================================
// BILINGUAL MESSAGE TRANSLATION
// ========================================

async function createBilingualMessage(message) {

    try {

        const hasTamil =
            /[\u0B80-\u0BFF]/.test(message);

        if (hasTamil) {

            const translated =
                await translate(message, {
                    to: "en"
                });

            return `${message}\n\n${translated.text}`;

        } else {

            const translated =
                await translate(message, {
                    to: "ta"
                });

            return `${message}\n\n${translated.text}`;
        }

    } catch (error) {

        console.error(
            "Translation Error:",
            error.message
        );

        return message;
    }
}


// ========================================
// SEND SMS
// ========================================

router.post("/", async (req, res) => {

    try {

        const {
            area,
            memberIds,
            message
        } = req.body;


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !area ||
            !Array.isArray(memberIds) ||
            memberIds.length === 0 ||
            !message
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Area, members and message are required"
            });

        }


        if (message.length > 500) {

            return res.status(400).json({
                success: false,
                message:
                    "Message cannot exceed 500 characters"
            });

        }


        // ========================================
        // GET MEMBERS
        // ========================================

        const placeholders =
            memberIds.map(() => "?").join(",");


        const [members] =
            await db.query(
                `SELECT
                    pu.user_id,
                    pu.name,
                    pu.mobile_number,
                    a.area_name
                 FROM public_users pu
                 INNER JOIN areas a
                 ON pu.area_id = a.area_id
                 WHERE pu.user_id IN (${placeholders})
                 AND a.area_name = ?`,
                [
                    ...memberIds,
                    area
                ]
            );


        if (members.length === 0) {

            return res.status(404).json({
                success: false,
                message:
                    "No valid members found"
            });

        }


        // ========================================
        // TRACCAR CONFIGURATION
        // ========================================

        const traccarUrl =
            process.env.TRACCAR_SMS_URL;

        const traccarToken =
            process.env.TRACCAR_SMS_TOKEN;


        console.log(
            "========================================"
        );

        console.log(
            "SMS GATEWAY CHECK"
        );

        console.log(
            "TRACCAR_SMS_URL:",
            traccarUrl || "NOT SET"
        );

        console.log(
            "TRACCAR_SMS_TOKEN:",
            traccarToken
                ? "TOKEN FOUND"
                : "TOKEN NOT SET"
        );

        console.log(
            "========================================"
        );


        if (!traccarUrl || !traccarToken) {

            return res.status(500).json({
                success: false,
                message:
                    "SMS gateway configuration is missing. Check TRACCAR_SMS_URL and TRACCAR_SMS_TOKEN."
            });

        }


        let successCount = 0;
        let failedCount = 0;


        // ========================================
        // SEND SMS TO EACH MEMBER
        // ========================================

        for (const member of members) {

            let status = "Failed";

            let bilingualMessage =
                message;


            try {

                // ========================================
                // MOBILE NUMBER
                // ========================================

                let mobileNumber =
                    String(
                        member.mobile_number
                    ).trim();


                if (
                    mobileNumber.length === 10 &&
                    !mobileNumber.startsWith("+")
                ) {

                    mobileNumber =
                        "+91" + mobileNumber;

                }


                console.log(
                    "----------------------------------------"
                );

                console.log(
                    "Sending SMS to:",
                    mobileNumber
                );


                // ========================================
                // CREATE BILINGUAL MESSAGE
                // ========================================

                bilingualMessage =
                    await createBilingualMessage(
                        message
                    );


                console.log(
                    "SMS Message:",
                    bilingualMessage
                );


                // ========================================
                // TRACCAR REQUEST
                // ========================================

                const requestUrl =
                    `${traccarUrl}/`;


                console.log(
                    "Traccar URL:",
                    requestUrl
                );


                const response =
                    await fetch(
                        requestUrl,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json; charset=utf-8",

                                "Authorization":
                                    traccarToken
                            },

                            body:
                                JSON.stringify({
                                    to:
                                        mobileNumber,

                                    message:
                                        bilingualMessage
                                })
                        }
                    );


                // ========================================
                // READ RESPONSE
                // ========================================

                const responseText =
                    await response.text();


                console.log(
                    "Traccar HTTP Status:",
                    response.status
                );

                console.log(
                    "Traccar Response:",
                    responseText
                );


                if (response.ok) {

                    status =
                        "Sent";

                    successCount++;

                    console.log(
                        "✅ SMS SENT:",
                        mobileNumber
                    );

                } else {

                    failedCount++;

                    console.error(
                        "❌ SMS FAILED"
                    );

                    console.error(
                        "Number:",
                        mobileNumber
                    );

                    console.error(
                        "HTTP Status:",
                        response.status
                    );

                    console.error(
                        "Response:",
                        responseText
                    );
                }


            } catch (smsError) {

                failedCount++;

                console.error(
                    "❌ SMS REQUEST ERROR"
                );

                console.error(
                    "Number:",
                    member.mobile_number
                );

                console.error(
                    "Error:",
                    smsError
                );

            }


            // ========================================
            // SAVE SMS HISTORY
            // ========================================

            const now =
                new Date();


            const sentDate =
                now.toLocaleDateString(
                    "en-CA",
                    {
                        timeZone:
                            "Asia/Kolkata"
                    }
                );


            const sentTime =
                now.toLocaleTimeString(
                    "en-GB",
                    {
                        timeZone:
                            "Asia/Kolkata",

                        hour12:
                            false
                    }
                );


            await db.query(
                `INSERT INTO sms_logs
                (
                    mobile_number,
                    message,
                    sent_date,
                    sent_time,
                    status
                )
                VALUES (?, ?, ?, ?, ?)`,
                [
                    member.mobile_number,

                    bilingualMessage,

                    sentDate,

                    sentTime,

                    status
                ]
            );

        }


        // ========================================
        // FINAL RESPONSE
        // ========================================

        res.json({

            success: true,

            message:
                `SMS sending completed. Sent: ${successCount}, Failed: ${failedCount}`,

            sentCount:
                successCount,

            failedCount:
                failedCount

        });


    } catch (error) {

        console.error(
            "SMS Route Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to send SMS"

        });

    }

});


// ========================================
// SMS HISTORY - GET
// ========================================

router.get(
    "/history",
    async (req, res) => {

        try {

            const [history] =
                await db.query(
                    `SELECT
                        sms_id,
                        mobile_number,
                        message,
                        sent_date,
                        sent_time,
                        status
                     FROM sms_logs
                     ORDER BY sms_id DESC`
                );


            res.json({

                success:
                    true,

                history:
                    history

            });


        } catch (error) {

            console.error(
                "SMS History Error:",
                error
            );


            res.status(500).json({

                success:
                    false,

                message:
                    "Failed to load SMS history"

            });

        }

    }
);


// ========================================
// DELETE ONE SMS HISTORY
// ========================================

router.delete(
    "/history/:id",
    async (req, res) => {

        try {

            const smsId =
                Number(req.params.id);


            if (
                !Number.isInteger(smsId) ||
                smsId <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid SMS history ID"

                });

            }


            const [result] =
                await db.query(
                    `DELETE FROM sms_logs
                     WHERE sms_id = ?`,
                    [smsId]
                );


            if (result.affectedRows === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "SMS history record not found"

                });

            }


            res.json({

                success: true,

                message:
                    "SMS history deleted successfully"

            });


        } catch (error) {

            console.error(
                "Delete SMS History Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to delete SMS history"

            });

        }

    }
);


// ========================================
// DELETE MULTIPLE SMS HISTORY
// ========================================

router.delete(
    "/history",
    async (req, res) => {

        try {

            const { ids } =
                req.body;


            // ========================================
            // VALIDATION
            // ========================================

            if (
                !Array.isArray(ids) ||
                ids.length === 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "No SMS history records selected"

                });

            }


            const validIds =
                ids
                    .map(id => Number(id))
                    .filter(
                        id =>
                            Number.isInteger(id) &&
                            id > 0
                    );


            if (validIds.length === 0) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid SMS history IDs"

                });

            }


            const placeholders =
                validIds
                    .map(() => "?")
                    .join(",");


            // ========================================
            // DELETE SELECTED RECORDS
            // ========================================

            const [result] =
                await db.query(
                    `DELETE FROM sms_logs
                     WHERE sms_id IN (${placeholders})`,
                    validIds
                );


            res.json({

                success: true,

                message:
                    `${result.affectedRows} SMS history record(s) deleted successfully.`,

                deletedCount:
                    result.affectedRows

            });


        } catch (error) {

            console.error(
                "Delete Multiple SMS History Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to delete selected SMS history"

            });

        }

    }
);


module.exports = router;