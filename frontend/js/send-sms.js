const smsArea = document.getElementById("smsArea");
const smsMembers = document.getElementById("smsMembers");
const selectAllBtn = document.getElementById("selectAllBtn");
const smsMessage = document.getElementById("smsMessage");
const characterCount = document.getElementById("characterCount");
const sendSmsBtn = document.getElementById("sendSmsBtn");
const smsStatus = document.getElementById("smsStatus");


// Show members from database
async function displaySmsMembers() {

    const selectedArea = smsArea.value;

    smsMembers.innerHTML = "";

    // Reset Select All button
    selectAllBtn.textContent = "☑ Select All";

    if (!selectedArea) {

        smsMembers.innerHTML =
            "<p>Select an area to view members.</p>";

        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/public-numbers?area=" +
            encodeURIComponent(selectedArea)
        );

        const data = await response.json();

        if (!data.success) {

            smsMembers.innerHTML =
                "<p>Unable to load members.</p>";

            return;
        }

        const areaMembers = data.members || [];

        if (areaMembers.length === 0) {

            smsMembers.innerHTML =
                "<p>No members found in this area.</p>";

            return;
        }


        // Display area members
        areaMembers.forEach(function(member) {

            const memberRow =
                document.createElement("label");

            memberRow.className =
                "sms-member-row";

            memberRow.innerHTML = `
                <input
                    type="checkbox"
                    class="member-checkbox"
                    value="${member.user_id}"
                    checked
                >

                <span>
                    <strong>${member.name}</strong>
                    <br>
                    📱 ${member.mobile_number}
                </span>
            `;

            smsMembers.appendChild(memberRow);

        });


        // Since all members are automatically selected
        selectAllBtn.textContent =
            "☐ Unselect All";


    } catch (error) {

        console.error(error);

        smsMembers.innerHTML =
            "<p>Unable to connect to backend server.</p>";

    }
}


// Area change
smsArea.addEventListener("change", function() {

    displaySmsMembers();

});


// Select All / Unselect All
selectAllBtn.addEventListener("click", function() {

    const checkboxes =
        document.querySelectorAll(".member-checkbox");

    if (checkboxes.length === 0) {
        return;
    }

    const allSelected =
        [...checkboxes].every(
            checkbox => checkbox.checked
        );


    if (allSelected) {

        // Unselect all
        checkboxes.forEach(function(checkbox) {

            checkbox.checked = false;

        });

        selectAllBtn.textContent =
            "☑ Select All";

    } else {

        // Select all
        checkboxes.forEach(function(checkbox) {

            checkbox.checked = true;

        });

        selectAllBtn.textContent =
            "☐ Unselect All";
    }

});


// Character count
smsMessage.addEventListener("input", function() {

    characterCount.textContent =
        smsMessage.value.length + " / 500";

});


// Send SMS
sendSmsBtn.addEventListener("click", async function() {

    const selectedArea =
        smsArea.value;

    const message =
        smsMessage.value.trim();

    const selectedCheckboxes =
        document.querySelectorAll(
            ".member-checkbox:checked"
        );


    // Validate area
    if (!selectedArea) {

        smsStatus.textContent =
            "Please select an area.";

        smsStatus.style.color = "red";

        return;
    }


    // Validate members
    if (selectedCheckboxes.length === 0) {

        smsStatus.textContent =
            "Please select at least one member.";

        smsStatus.style.color = "red";

        return;
    }


    // Validate message
    if (!message) {

        smsStatus.textContent =
            "Please enter a message.";

        smsStatus.style.color = "red";

        return;
    }


    // Disable button while sending
    sendSmsBtn.disabled = true;

    sendSmsBtn.textContent =
        "📤 Sending SMS...";


    const selectedMemberIds = [];


    selectedCheckboxes.forEach(function(checkbox) {

        selectedMemberIds.push(
            Number(checkbox.value)
        );

    });


    try {

        const response = await fetch(
            "http://localhost:5000/api/sms",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    area: selectedArea,

                    memberIds:
                        selectedMemberIds,

                    message:
                        message

                })
            }
        );


        const data =
            await response.json();


        if (data.success) {

            smsStatus.textContent =
                data.message;

            smsStatus.style.color =
                "green";


            // Clear message
            smsMessage.value = "";

            characterCount.textContent =
                "0 / 500";


            // Unselect all after successful sending
            const checkboxes =
                document.querySelectorAll(
                    ".member-checkbox"
                );

            checkboxes.forEach(function(checkbox) {

                checkbox.checked = false;

            });


            selectAllBtn.textContent =
                "☑ Select All";


        } else {

            smsStatus.textContent =
                data.message;

            smsStatus.style.color =
                "red";

        }


    } catch (error) {

        console.error(
            "SMS sending error:",
            error
        );

        smsStatus.textContent =
            "Unable to connect to backend server.";

        smsStatus.style.color =
            "red";

    }


    // Enable button again
    sendSmsBtn.disabled = false;

    sendSmsBtn.textContent =
        "📩 Send SMS";

});