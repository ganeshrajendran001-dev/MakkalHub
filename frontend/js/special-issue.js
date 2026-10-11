const specialIssueForm =
    document.getElementById("specialIssueForm");

const issueMessage =
    document.getElementById("issueMessage");

const issueMonth =
    document.getElementById("issueMonth");

const issueDate =
    document.getElementById("issueDate");


// =========================================
// MONTH → ISSUE DATE RANGE
// =========================================

issueMonth.addEventListener("change", function () {

    const selectedMonth = issueMonth.value;

    if (!selectedMonth) {

        issueDate.removeAttribute("min");
        issueDate.removeAttribute("max");

        return;
    }


    // First date of selected month
    const firstDate =
        `${selectedMonth}-01`;


    // Find last date of selected month
    const [year, month] =
        selectedMonth.split("-").map(Number);

    const lastDay =
        new Date(
            year,
            month,
            0
        ).getDate();


    const lastDate =
        `${selectedMonth}-${String(lastDay).padStart(2, "0")}`;


    // Allow only selected month's dates
    issueDate.min = firstDate;
    issueDate.max = lastDate;


    // Clear date if previously selected date
    // does not belong to selected month
    if (
        issueDate.value &&
        (
            issueDate.value < firstDate ||
            issueDate.value > lastDate
        )
    ) {

        issueDate.value = "";
    }
});


// =========================================
// LOAD SAVED SPECIAL ISSUES
// =========================================

async function loadSpecialIssues() {

    try {

        const response =
            await fetch(
                "http://https://makkalhub-backend.onrender.com/api/special-issue"
            );


        const data =
            await response.json();


        const issueList =
            document.getElementById(
                "specialIssueList"
            );


        if (!issueList) {
            return;
        }


        if (
            !data.success ||
            !data.issues ||
            data.issues.length === 0
        ) {

            issueList.innerHTML = `
                <div class="schedule-empty">
                    <p>
                        No special government issues found.
                    </p>
                </div>
            `;

            return;
        }


        issueList.innerHTML = "";


        data.issues.forEach(function (issue) {

            const card =
                document.createElement("div");


            card.className =
                "saved-schedule-card";


            const displayDate =
                issue.issue_date
                    ? new Date(
                        issue.issue_date
                    ).toLocaleDateString("en-IN")
                    : "--";


            card.innerHTML = `

                <div class="saved-schedule-info">

                    <h3>
                        🏛️ ${issue.issue_month}
                    </h3>

                    <p>
                        📦 <strong>Item:</strong>
                        ${issue.item_name}
                    </p>

                    <p>
                        🔢 <strong>Quantity:</strong>
                        ${issue.quantity || 0}
                        ${issue.unit || ""}
                    </p>

                    <p>
                        📅 <strong>Issue Date:</strong>
                        ${displayDate}
                    </p>

                    <p>
                        📍 <strong>Eligible Area:</strong>
                        ${issue.eligible_area || "All Areas"}
                    </p>

                    ${
                        issue.description
                            ? `
                                <p>
                                    📝 <strong>Details:</strong>
                                    ${issue.description}
                                </p>
                            `
                            : ""
                    }

                </div>


                <div class="saved-schedule-actions">

                    <button
                        type="button"
                        class="delete-button"
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;


            const deleteButton =
                card.querySelector(
                    ".delete-button"
                );


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteSpecialIssue(
                        issue.issue_id
                    );

                }
            );


            issueList.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Load Special Issues Error:",
            error
        );


        const issueList =
            document.getElementById(
                "specialIssueList"
            );


        if (issueList) {

            issueList.innerHTML = `
                <p style="color:red;">
                    Unable to load special government issues.
                </p>
            `;
        }
    }
}


// =========================================
// DELETE SPECIAL ISSUE
// =========================================

async function deleteSpecialIssue(issueId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this special government issue?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://https://makkalhub-backend.onrender.com/api/special-issue/${issueId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (data.success) {

            issueMessage.textContent =
                data.message;

            issueMessage.style.color =
                "green";


            await loadSpecialIssues();

        } else {

            issueMessage.textContent =
                data.message ||
                "Failed to delete special issue.";

            issueMessage.style.color =
                "red";
        }


    } catch (error) {

        console.error(
            "Delete Special Issue Error:",
            error
        );


        issueMessage.textContent =
            "Unable to connect to backend server.";

        issueMessage.style.color =
            "red";
    }
}


// =========================================
// SAVE SPECIAL ISSUE
// =========================================

specialIssueForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const issueData = {

            issueMonth:
                issueMonth.value,

            itemName:
                document.getElementById(
                    "issueItem"
                ).value,

            quantity:
                document.getElementById(
                    "issueQuantity"
                ).value,

            unit:
                document.getElementById(
                    "issueUnit"
                ).value,

            issueDate:
                issueDate.value,

            eligibleArea:
                document.getElementById(
                    "eligibleArea"
                ).value,

            description:
                document.getElementById(
                    "issueDescription"
                ).value
        };


        try {

            const response =
                await fetch(
                    "http://https://makkalhub-backend.onrender.com/api/special-issue",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                issueData
                            )
                    }
                );


            const data =
                await response.json();


            if (data.success) {

                issueMessage.textContent =
                    data.message;

                issueMessage.style.color =
                    "green";


                specialIssueForm.reset();


                // Reset date restrictions
                issueDate.removeAttribute("min");
                issueDate.removeAttribute("max");


                // Reload all saved future issues
                await loadSpecialIssues();


            } else {

                issueMessage.textContent =
                    data.message ||
                    "Failed to save special government issue.";

                issueMessage.style.color =
                    "red";
            }


        } catch (error) {

            console.error(
                "Save Special Issue Error:",
                error
            );


            issueMessage.textContent =
                "Unable to connect to backend server.";

            issueMessage.style.color =
                "red";
        }
    }
);


// =========================================
// INITIAL LOAD
// =========================================

loadSpecialIssues();