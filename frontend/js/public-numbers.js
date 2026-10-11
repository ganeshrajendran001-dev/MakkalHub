const areaSelect = document.getElementById("areaSelect");

const memberForm = document.getElementById("memberForm");

const memberName = document.getElementById("memberName");

const memberMobile = document.getElementById("memberMobile");

const memberMessage = document.getElementById("memberMessage");

const memberList = document.getElementById("memberList");

const memberListTitle =
    document.getElementById("memberListTitle");

const memberSearch =
    document.getElementById("memberSearch");

const memberCountBadge =
    document.getElementById("memberCountBadge");


// =====================================================
// STORE CURRENT MEMBERS
// =====================================================

let currentMembers = [];



// =====================================================
// ESCAPE HTML
// =====================================================

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



// =====================================================
// DISPLAY FILTERED MEMBERS
// =====================================================

function renderMembers() {

    const selectedArea =
        areaSelect.value;

    const searchText =
        memberSearch
            ? memberSearch.value
                .trim()
                .toLowerCase()
            : "";


    // No area selected

    if (!selectedArea) {

        memberList.innerHTML = `

            <div class="member-empty-state">

                <div class="empty-icon">
                    👥
                </div>

                <h3>
                    No Area Selected
                </h3>

                <p>
                    Select an area above to view
                    saved members.
                </p>

            </div>

        `;

        memberListTitle.textContent =
            "Members";


        if (memberCountBadge) {

            memberCountBadge.textContent =
                "0 Members";

        }

        return;
    }



    // Update total count

    if (memberCountBadge) {

        memberCountBadge.textContent =
            currentMembers.length +
            (currentMembers.length === 1
                ? " Member"
                : " Members");

    }



    // Search members

    const filteredMembers =
        currentMembers.filter(function(member) {

            const name =
                String(member.name || "")
                    .toLowerCase();

            const mobile =
                String(member.mobile_number || "")
                    .toLowerCase();

            return (
                name.includes(searchText) ||
                mobile.includes(searchText)
            );

        });



    // Title

    memberListTitle.textContent =
        selectedArea +
        " Members (" +
        currentMembers.length +
        ")";



    // No members

    if (currentMembers.length === 0) {

        memberList.innerHTML = `

            <div class="member-empty-state">

                <div class="empty-icon">
                    👥
                </div>

                <h3>
                    No Members Yet
                </h3>

                <p>
                    No members have been added
                    for this area.
                </p>

            </div>

        `;

        return;
    }



    // Search found nothing

    if (filteredMembers.length === 0) {

        memberList.innerHTML = `

            <div class="member-empty-state">

                <div class="empty-icon">
                    🔎
                </div>

                <h3>
                    No Members Found
                </h3>

                <p>
                    No member matches
                    "${escapeHtml(searchText)}".
                </p>

            </div>

        `;

        return;
    }



    // Clear list

    memberList.innerHTML = "";



    // Display cards

    filteredMembers.forEach(function(member) {

        const memberCard =
            document.createElement("div");

        memberCard.className =
            "member-card";



        memberCard.innerHTML = `

            <div class="member-card-info">

                <div class="member-avatar">
                    👤
                </div>


                <div class="member-details">

                    <h3>
                        ${escapeHtml(member.name)}
                    </h3>


                    <p class="member-phone">

                        <span>
                            📱
                        </span>

                        ${escapeHtml(
                            member.mobile_number
                        )}

                    </p>

                </div>

            </div>


            <button
                type="button"
                class="member-delete-btn"
                onclick="deleteMember(${member.user_id})"
            >

                🗑️
                <span>Delete</span>

            </button>

        `;


        memberList.appendChild(memberCard);

    });

}



// =====================================================
// LOAD MEMBERS FROM DATABASE
// =====================================================

async function displayMembers() {

    const selectedArea =
        areaSelect.value;


    currentMembers = [];


    // Clear search when area changes

    if (memberSearch) {
        memberSearch.value = "";
    }


    if (!selectedArea) {

        renderMembers();

        return;
    }


    try {

        const response =
            await fetch(
                "https://makkalhub-backend.onrender.com/api/public-numbers?area=" +
                encodeURIComponent(selectedArea)
            );


        const data =
            await response.json();



        if (!data.success) {

            memberList.innerHTML = `

                <div class="member-empty-state">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Unable to Load Members
                    </h3>

                    <p>
                        Please try again.
                    </p>

                </div>

            `;

            return;
        }



        currentMembers =
            data.members || [];


        renderMembers();


    } catch (error) {

        console.error(
            "Load Members Error:",
            error
        );


        memberList.innerHTML = `

            <div class="member-empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Connection Error
                </h3>

                <p>
                    Unable to connect to backend server.
                </p>

            </div>

        `;

    }

}



// =====================================================
// AREA CHANGE
// =====================================================

areaSelect.addEventListener(
    "change",
    function() {

        displayMembers();

    }
);



// =====================================================
// SEARCH MEMBERS
// =====================================================

if (memberSearch) {

    memberSearch.addEventListener(
        "input",
        function() {

            renderMembers();

        }
    );

}



// =====================================================
// ADD MEMBER
// =====================================================

memberForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const selectedArea =
            areaSelect.value;


        const name =
            memberName.value.trim();


        const mobile =
            memberMobile.value.trim();



        // Area validation

        if (!selectedArea) {

            memberMessage.textContent =
                "Please select an area first.";

            memberMessage.style.color =
                "red";

            return;
        }



        // Name validation

        if (!name) {

            memberMessage.textContent =
                "Please enter member name.";

            memberMessage.style.color =
                "red";

            return;
        }



        // Mobile validation

        if (!/^[0-9]{10}$/.test(mobile)) {

            memberMessage.textContent =
                "Please enter a valid 10 digit mobile number.";

            memberMessage.style.color =
                "red";

            return;
        }



        try {

            const response =
                await fetch(
                    "https://makkalhub-backend.onrender.com/api/public-numbers",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

                            mobileNumber: mobile,

                            area: selectedArea

                        })
                    }
                );



            const data =
                await response.json();



            if (data.success) {

                memberMessage.textContent =
                    name +
                    " added successfully to " +
                    selectedArea +
                    "!";


                memberMessage.style.color =
                    "green";


                memberForm.reset();


                // Reload members

                displayMembers();


            } else {

                memberMessage.textContent =
                    data.message ||
                    "Unable to add member.";


                memberMessage.style.color =
                    "red";

            }


        } catch (error) {

            console.error(
                "Add Member Error:",
                error
            );


            memberMessage.textContent =
                "Unable to connect to backend server.";


            memberMessage.style.color =
                "red";

        }

    }
);



// =====================================================
// DELETE MEMBER
// =====================================================

async function deleteMember(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this member?"
        );


    if (!confirmDelete) {

        return;

    }



    try {

        const response =
            await fetch(
                "https://makkalhub-backend.onrender.com/api/public-numbers/" +
                id,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();



        if (data.success) {

            memberMessage.textContent =
                "Member deleted successfully!";


            memberMessage.style.color =
                "green";


            displayMembers();


        } else {

            memberMessage.textContent =
                data.message ||
                "Unable to delete member.";


            memberMessage.style.color =
                "red";

        }


    } catch (error) {

        console.error(
            "Delete Member Error:",
            error
        );


        memberMessage.textContent =
            "Unable to connect to backend server.";


        memberMessage.style.color =
            "red";

    }

}