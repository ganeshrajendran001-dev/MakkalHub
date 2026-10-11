const scheduleForm = document.getElementById("scheduleForm");
const scheduleMessage = document.getElementById("scheduleMessage");
const scheduleList = document.getElementById("scheduleList");


// ==========================================
// CURRENT EDITING SCHEDULE ID
// ==========================================

let editingScheduleId = null;


// ==========================================
// FORMAT TIME TO AM/PM
// ==========================================

function formatTime(time) {

    if (!time) {
        return "--";
    }

    const parts = String(time).split(":");

    let hour = parseInt(parts[0], 10);
    const minute = parts[1] || "00";

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
        hour = 12;
    }

    return (
        String(hour).padStart(2, "0") +
        ":" +
        minute +
        " " +
        ampm
    );
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "--";
    }

    const date = new Date(dateValue);

    if (!isNaN(date.getTime())) {

        const day =
            String(date.getDate()).padStart(2, "0");

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        const year =
            date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const parts =
        String(dateValue)
            .split("T")[0]
            .split("-");

    if (parts.length === 3) {

        return (
            parts[2] +
            "/" +
            parts[1] +
            "/" +
            parts[0]
        );
    }

    return dateValue;
}


// ==========================================
// GET FORM ELEMENTS
// ==========================================

function getFormValues() {

    const selectedItems = [];

    document
        .querySelectorAll(".itemCheck:checked")
        .forEach(function (item) {

            selectedItems.push(item.value);

        });


    return {

        id: editingScheduleId,

        date:
            document.getElementById(
                "scheduleDate"
            ).value,

        area:
            document.getElementById(
                "area"
            ).value,

        startTime:
            document.getElementById(
                "startTime"
            ).value,

        endTime:
            document.getElementById(
                "endTime"
            ).value,

        items: selectedItems,

        status:
            document.getElementById(
                "scheduleStatus"
            ).value,

        notes:
            document.getElementById(
                "notes"
            ).value

    };
}


// ==========================================
// SHOW MESSAGE
// ==========================================

function showScheduleMessage(
    message,
    color
) {

    scheduleMessage.textContent = message;

    scheduleMessage.style.color = color;
}


// ==========================================
// LOAD ALL SCHEDULES
// ==========================================

async function loadSchedules() {

    try {

        const response = await fetch(
            "https://makkalhub-backend.onrender.com/api/schedule"
        );

        const data = await response.json();


        if (!data.success) {

            scheduleList.innerHTML = `
                <p>
                    Failed to load schedules.
                </p>
            `;

            return;
        }


        if (
            !data.schedules ||
            data.schedules.length === 0
        ) {

            scheduleList.innerHTML = `
                <div class="schedule-empty">

                    <p>
                        No saved schedules found.
                    </p>

                </div>
            `;

            return;
        }


        scheduleList.innerHTML = "";


        data.schedules.forEach(
            function (schedule) {

                const card =
                    document.createElement("div");

                card.className =
                    "saved-schedule-card";


                // ==================================
                // INFORMATION SECTION
                // ==================================

                const info =
                    document.createElement("div");

                info.className =
                    "saved-schedule-info";


                info.innerHTML = `

                    <h3>
                        📅 ${formatDate(
                            schedule.distribution_date
                        )}
                    </h3>

                    <p>
                        📍 <strong>Area:</strong>
                        ${schedule.area_name}
                    </p>

                    <p>
                        🕐 <strong>Time:</strong>
                        ${formatTime(
                            schedule.start_time
                        )}
                        -
                        ${formatTime(
                            schedule.end_time
                        )}
                    </p>

                    <p>
                        📦 <strong>Status:</strong>
                        ${schedule.status}
                    </p>

                    ${
                        schedule.notes
                            ? `
                                <p>
                                    📝 <strong>Notes:</strong>
                                    ${schedule.notes}
                                </p>
                            `
                            : ""
                    }

                `;


                // ==================================
                // ACTION BUTTON SECTION
                // ==================================

                const actions =
                    document.createElement("div");

                actions.className =
                    "saved-schedule-actions";


                // ==================================
                // EDIT BUTTON
                // ==================================

                const editButton =
                    document.createElement("button");

                editButton.type = "button";

                editButton.className =
                    "edit-button";

                editButton.textContent =
                    "✏️ Edit";


                editButton.addEventListener(
                    "click",
                    function () {

                        editSchedule(
                            schedule
                        );

                    }
                );


                // ==================================
                // DELETE BUTTON
                // ==================================

                const deleteButton =
                    document.createElement("button");

                deleteButton.type = "button";

                deleteButton.className =
                    "delete-button";

                deleteButton.textContent =
                    "🗑️ Delete";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteSchedule(
                            schedule.distribution_id
                        );

                    }
                );


                actions.appendChild(
                    editButton
                );

                actions.appendChild(
                    deleteButton
                );


                card.appendChild(info);

                card.appendChild(actions);


                scheduleList.appendChild(card);

            }
        );


    } catch (error) {

        console.error(
            "Load schedules error:",
            error
        );


        scheduleList.innerHTML = `

            <p style="color:red;">

                Unable to load schedules.

            </p>

        `;
    }
}


// ==========================================
// EDIT SCHEDULE
// ==========================================

function editSchedule(schedule) {

    console.log(
        "Editing schedule:",
        schedule
    );


    // Store exact database ID
    editingScheduleId =
        Number(
            schedule.distribution_id
        );


    // =========================================
    // DATE
    // =========================================

    const scheduleDate =
        document.getElementById(
            "scheduleDate"
        );


    if (scheduleDate) {

        const dateObject =
            new Date(
                schedule.distribution_date
            );


        if (!isNaN(dateObject.getTime())) {

            const year =
                dateObject.getFullYear();

            const month =
                String(
                    dateObject.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    dateObject.getDate()
                ).padStart(2, "0");


            scheduleDate.value =
                `${year}-${month}-${day}`;

        } else {

            scheduleDate.value =
                String(
                    schedule.distribution_date
                ).split("T")[0];

        }
    }


    // =========================================
    // AREA
    // =========================================

    const area =
        document.getElementById(
            "area"
        );


    if (area) {

        area.value =
            schedule.area_name;

    }


    // =========================================
    // START TIME
    // =========================================

    const startTime =
        document.getElementById(
            "startTime"
        );


    if (startTime) {

        startTime.value =
            String(
                schedule.start_time || ""
            ).substring(0, 5);

    }


    // =========================================
    // END TIME
    // =========================================

    const endTime =
        document.getElementById(
            "endTime"
        );


    if (endTime) {

        endTime.value =
            String(
                schedule.end_time || ""
            ).substring(0, 5);

    }


    // =========================================
    // STATUS
    // =========================================

    const status =
        document.getElementById(
            "scheduleStatus"
        );


    if (status) {

        status.value =
            schedule.status;

    }


    // =========================================
    // NOTES
    // =========================================

    const notes =
        document.getElementById(
            "notes"
        );


    if (notes) {

        notes.value =
            schedule.notes || "";

    }


    // =========================================
    // EDIT MESSAGE
    // =========================================

    showScheduleMessage(
        "✏️ Schedule loaded for editing. Change the details and click Save.",
        "blue"
    );


    // =========================================
    // SCROLL TO FORM
    // =========================================

    scheduleForm.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });


    console.log(
        "Editing Schedule ID:",
        editingScheduleId
    );
}


// ==========================================
// SAVE / UPDATE SCHEDULE
// ==========================================

scheduleForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const scheduleData =
            getFormValues();


        console.log(
            "Sending schedule:",
            scheduleData
        );


        // =====================================
        // VALIDATION
        // =====================================

        if (!scheduleData.date) {

            showScheduleMessage(
                "Please select a date.",
                "red"
            );

            return;
        }


        if (!scheduleData.area) {

            showScheduleMessage(
                "Please select an area.",
                "red"
            );

            return;
        }


        if (
            !scheduleData.startTime ||
            !scheduleData.endTime
        ) {

            showScheduleMessage(
                "Please enter start and end time.",
                "red"
            );

            return;
        }


        if (
            scheduleData.startTime >=
            scheduleData.endTime
        ) {

            showScheduleMessage(
                "End time must be after start time.",
                "red"
            );

            return;
        }


        try {

            const response =
                await fetch(
                    "https://makkalhub-backend.onrender.com/api/schedule",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                scheduleData
                            )

                    }
                );


            const data =
                await response.json();


            console.log(
                "Backend response:",
                data
            );


            if (data.success) {

                showScheduleMessage(
                    data.message,
                    "green"
                );


                // Clear edit mode
                editingScheduleId = null;


                // Reset form
                scheduleForm.reset();


                // Reload schedules
                await loadSchedules();

            } else {

                showScheduleMessage(
                    data.message ||
                    "Failed to save schedule.",
                    "red"
                );

            }


        } catch (error) {

            console.error(
                "Save schedule error:",
                error
            );


            showScheduleMessage(
                "Unable to connect to backend server.",
                "red"
            );

        }

    }
);


// ==========================================
// DELETE SCHEDULE
// ==========================================

async function deleteSchedule(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this schedule?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `https://makkalhub-backend.onrender.com/api/schedule/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (data.success) {

            showScheduleMessage(
                data.message,
                "green"
            );


            if (
                Number(editingScheduleId) ===
                Number(id)
            ) {

                editingScheduleId = null;

                scheduleForm.reset();

            }


            await loadSchedules();


        } else {

            showScheduleMessage(
                data.message ||
                "Failed to delete schedule.",
                "red"
            );

        }


    } catch (error) {

        console.error(
            "Delete schedule error:",
            error
        );


        showScheduleMessage(
            "Unable to delete schedule.",
            "red"
        );

    }

}


// ==========================================
// LOAD SCHEDULES WHEN PAGE OPENS
// ==========================================

loadSchedules();