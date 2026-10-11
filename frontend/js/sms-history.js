const smsHistoryTable = document.getElementById("smsHistoryTable");
const historyMessage = document.getElementById("historyMessage");

const selectAllHistory = document.getElementById("selectAllHistory");
const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
const selectedCount = document.getElementById("selectedCount");


// ========================================
// FORMAT DATE
// ========================================

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata"
    });
}


// ========================================
// FORMAT TIME - AM / PM
// ========================================

function formatTime(timeValue) {

    if (!timeValue) {
        return "-";
    }

    const parts = String(timeValue).split(":");

    if (parts.length < 2) {
        return timeValue;
    }

    let hour = parseInt(parts[0], 10);
    const minute = parts[1];

    const period = hour >= 12 ? "PM" : "AM";

    if (hour === 0) {
        hour = 12;
    } else if (hour > 12) {
        hour -= 12;
    }

    return `${String(hour).padStart(2, "0")}:${minute} ${period}`;
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// UPDATE SELECTION
// ========================================

function updateSelectionState() {

    const checkboxes =
        document.querySelectorAll(".history-checkbox");

    const checkedBoxes =
        document.querySelectorAll(
            ".history-checkbox:checked"
        );

    const total =
        checkboxes.length;

    const selected =
        checkedBoxes.length;


    selectedCount.textContent =
        `${selected} selected`;


    deleteSelectedBtn.disabled =
        selected === 0;


    if (total === 0) {

        selectAllHistory.checked = false;

        selectAllHistory.indeterminate = false;

        return;
    }


    if (selected === total) {

        selectAllHistory.checked = true;

        selectAllHistory.indeterminate = false;

    } else if (selected > 0) {

        selectAllHistory.checked = false;

        selectAllHistory.indeterminate = true;

    } else {

        selectAllHistory.checked = false;

        selectAllHistory.indeterminate = false;
    }
}


// ========================================
// SELECT ALL
// ========================================

selectAllHistory.addEventListener(
    "change",
    function () {

        const checkboxes =
            document.querySelectorAll(
                ".history-checkbox"
            );


        checkboxes.forEach(function (checkbox) {

            checkbox.checked =
                selectAllHistory.checked;

        });


        updateSelectionState();

    }
);


// ========================================
// LOAD SMS HISTORY
// ========================================

async function loadSmsHistory() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/sms/history"
        );


        const data =
            await response.json();


        if (!data.success) {

            smsHistoryTable.innerHTML = `
                <tr>
                    <td colspan="8">
                        Unable to load SMS history.
                    </td>
                </tr>
            `;

            return;
        }


        const history =
            data.history || [];


        if (history.length === 0) {

            smsHistoryTable.innerHTML = `
                <tr>
                    <td colspan="8">
                        No SMS history found.
                    </td>
                </tr>
            `;

            updateSelectionState();

            return;
        }


        smsHistoryTable.innerHTML = "";


        history.forEach(function (sms, index) {

            const row =
                document.createElement("tr");


            const statusClass =
                String(sms.status).toLowerCase() === "sent"
                    ? "sent"
                    : "failed";


            row.innerHTML = `

                <td>

                    <input
                        type="checkbox"
                        class="history-checkbox"
                        value="${sms.sms_id}"
                    >

                </td>


                <td>
                    ${index + 1}
                </td>


                <td>
                    ${escapeHtml(
                        sms.mobile_number
                    )}
                </td>


                <td>

                    <div class="history-message-preview">

                        ${escapeHtml(
                            sms.message
                        )}

                    </div>

                </td>


                <td>
                    ${formatDate(
                        sms.sent_date
                    )}
                </td>


                <td>
                    ${formatTime(
                        sms.sent_time
                    )}
                </td>


                <td>

                    <span
                        class="history-status ${statusClass}"
                    >
                        ${escapeHtml(
                            sms.status
                        )}
                    </span>

                </td>


                <td>

                    <button
                        type="button"
                        class="delete-history-btn"
                        data-id="${sms.sms_id}"
                    >
                        🗑️ Delete
                    </button>

                </td>

            `;


            smsHistoryTable.appendChild(row);

        });


        // ========================================
        // INDIVIDUAL CHECKBOX EVENTS
        // ========================================

        document
            .querySelectorAll(".history-checkbox")
            .forEach(function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    updateSelectionState
                );

            });


        // ========================================
        // INDIVIDUAL DELETE EVENTS
        // ========================================

        document
            .querySelectorAll(".delete-history-btn")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    async function () {

                        const smsId =
                            this.dataset.id;


                        const confirmDelete =
                            confirm(
                                "Are you sure you want to delete this SMS history?"
                            );


                        if (!confirmDelete) {
                            return;
                        }


                        await deleteSingleHistory(
                            smsId
                        );

                    }
                );

            });


        updateSelectionState();

    } catch (error) {

        console.error(
            "SMS History Error:",
            error
        );


        smsHistoryTable.innerHTML = `
            <tr>
                <td colspan="8">
                    Unable to connect to backend server.
                </td>
            </tr>
        `;

    }
}


// ========================================
// DELETE ONE HISTORY
// ========================================

async function deleteSingleHistory(smsId) {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/sms/history/${smsId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (data.success) {

            historyMessage.textContent =
                "SMS history deleted successfully.";

            historyMessage.style.color =
                "green";


            await loadSmsHistory();

        } else {

            historyMessage.textContent =
                data.message ||
                "Unable to delete SMS history.";

            historyMessage.style.color =
                "red";

        }

    } catch (error) {

        console.error(
            "Delete History Error:",
            error
        );


        historyMessage.textContent =
            "Unable to connect to backend server.";

        historyMessage.style.color =
            "red";
    }
}


// ========================================
// DELETE SELECTED HISTORY
// ========================================

deleteSelectedBtn.addEventListener(
    "click",
    async function () {

        const selectedCheckboxes =
            document.querySelectorAll(
                ".history-checkbox:checked"
            );


        const ids =
            Array.from(
                selectedCheckboxes
            ).map(function (checkbox) {

                return Number(
                    checkbox.value
                );

            });


        if (ids.length === 0) {
            return;
        }


        const confirmDelete =
            confirm(
                `Are you sure you want to delete ${ids.length} selected SMS history record(s)?`
            );


        if (!confirmDelete) {
            return;
        }


        try {

            deleteSelectedBtn.disabled = true;


            const response =
                await fetch(
                    "http://localhost:5000/api/sms/history",
                    {
                        method: "DELETE",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            ids: ids
                        })
                    }
                );


            const data =
                await response.json();


            if (data.success) {

                historyMessage.textContent =
                    `${ids.length} SMS history record(s) deleted successfully.`;

                historyMessage.style.color =
                    "green";


                selectAllHistory.checked =
                    false;


                selectAllHistory.indeterminate =
                    false;


                await loadSmsHistory();

            } else {

                historyMessage.textContent =
                    data.message ||
                    "Unable to delete selected history.";

                historyMessage.style.color =
                    "red";

                updateSelectionState();
            }

        } catch (error) {

            console.error(
                "Delete Selected History Error:",
                error
            );


            historyMessage.textContent =
                "Unable to connect to backend server.";

            historyMessage.style.color =
                "red";


            updateSelectionState();

        }

    }
);


// ========================================
// INITIAL LOAD
// ========================================

loadSmsHistory();