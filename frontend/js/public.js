// =========================================
// MAKKALHUB PUBLIC PAGE
// ENGLISH / TAMIL DYNAMIC TRANSLATION
// =========================================


// =========================================
// GET CURRENT LANGUAGE
// =========================================

function getCurrentLanguage() {

    return localStorage.getItem("makkalhubLanguage") || "en";

}


// =========================================
// TRANSLATE ITEM NAMES
// =========================================

function translateItemName(itemName) {

    const language = getCurrentLanguage();

    if (language !== "ta") {
        return itemName;
    }

    const translations = {

        "rice": "அரிசி",
        "sugar": "சர்க்கரை",
        "wheat": "கோதுமை",
        "oil": "எண்ணெய்",
        "dal": "பருப்பு",
        "kerosene": "மண்ணெண்ணெய்"

    };

    return translations[
        String(itemName || "").trim().toLowerCase()
    ] || itemName;

}


// =========================================
// TRANSLATE AREA NAMES
// =========================================

function translateAreaName(areaName) {

    const language = getCurrentLanguage();

    if (language !== "ta") {
        return areaName;
    }

    const translations = {

        "killinjikuppam":
            "கிளிஞ்சிக்குப்பம்",

        "killinjikuppam pt":
            "கிளிஞ்சிக்குப்பம் PT",

        "puthu poonjolaikuppam":
            "புதுப்பூஞ்சோலைக்குப்பம்"

    };

    return translations[
        String(areaName || "").trim().toLowerCase()
    ] || areaName;

}


// =========================================
// TRANSLATE SHOP STATUS
// =========================================

function translateShopStatus(status) {

    const language = getCurrentLanguage();

    if (language !== "ta") {
        return status;
    }

    const translations = {

        "open": "திறந்துள்ளது",
        "closed": "மூடப்பட்டுள்ளது",
        "holiday": "விடுமுறை"

    };

    return translations[
        String(status || "").trim().toLowerCase()
    ] || status;

}


// =========================================
// TRANSLATE ADMIN STATUS
// =========================================

function translateAdminStatus(status) {

    const language = getCurrentLanguage();

    if (language !== "ta") {
        return status;
    }

    const translations = {

        "available": "கிடைக்கிறது",
        "leave": "விடுப்பில்"

    };

    return translations[
        String(status || "").trim().toLowerCase()
    ] || status;

}


// =========================================
// TRANSLATE SCHEDULE STATUS
// =========================================

function translateScheduleStatus(status) {

    const language = getCurrentLanguage();

    if (language !== "ta") {
        return status;
    }

    const translations = {

        "available": "கிடைக்கிறது",
        "upcoming": "வரவுள்ளது",
        "not available": "கிடைக்கவில்லை"

    };

    return translations[
        String(status || "").trim().toLowerCase()
    ] || status;

}


// =========================================
// TRANSLATE UNIT
// =========================================

function translateUnit(unit) {

    const language = getCurrentLanguage();

    if (language !== "ta") {
        return unit;
    }

    const translations = {

        "kg": "கிலோ",
        "kilogram": "கிலோ",
        "litre": "லிட்டர்",
        "liter": "லிட்டர்",
        "litres": "லிட்டர்",
        "liters": "லிட்டர்",
        "number": "எண்ணிக்கை",
        "nos": "எண்ணிக்கை"

    };

    return translations[
        String(unit || "").trim().toLowerCase()
    ] || unit;

}


// =========================================
// TRANSLATE STATIC DYNAMIC PHRASES
// =========================================

function getTranslatedText(key) {

    const language = getCurrentLanguage();

    const translations = {

        en: {

            noInformation:
                "No Information",

            noSchedule:
                "No Schedule",

            noTodaySchedule:
                "No distribution scheduled for today",

            noTomorrowSchedule:
                "No distribution scheduled for tomorrow",

            quantity:
                "Quantity",

            status:
                "Status",

            availableItems:
                "Available Items",

            noItemsSpecified:
                "No items specified",

            noItemsAvailable:
                "No Items Available",

            todayItemsUnavailable:
                "Today's item information is not available.",

            date:
                "Date",

            area:
                "Area",

            time:
                "Time",

            scheduleStatus:
                "Status",

            noScheduleAvailable:
                "No distribution schedule available.",

            item:
                "Item",

            issueDate:
                "Issue Date",

            eligibleArea:
                "Eligible Area",

            allAreas:
                "All Areas",

            details:
                "Details",

            noSpecialIssue:
                "No special government issue information available."

        },


        ta: {

            noInformation:
                "தகவல் இல்லை",

            noSchedule:
                "அட்டவணை இல்லை",

            noTodaySchedule:
                "இன்றைக்கு விநியோகம் எதுவும் திட்டமிடப்படவில்லை",

            noTomorrowSchedule:
                "நாளைக்கு விநியோகம் எதுவும் திட்டமிடப்படவில்லை",

            quantity:
                "அளவு",

            status:
                "நிலை",

            availableItems:
                "கிடைக்கும் பொருட்கள்",

            noItemsSpecified:
                "பொருட்கள் குறிப்பிடப்படவில்லை",

            noItemsAvailable:
                "பொருட்கள் எதுவும் இல்லை",

            todayItemsUnavailable:
                "இன்றைய பொருள் தகவல்கள் கிடைக்கவில்லை.",

            date:
                "தேதி",

            area:
                "பகுதி",

            time:
                "நேரம்",

            scheduleStatus:
                "நிலை",

            noScheduleAvailable:
                "விநியோக அட்டவணை எதுவும் கிடைக்கவில்லை.",

            item:
                "பொருள்",

            issueDate:
                "வழங்கும் தேதி",

            eligibleArea:
                "தகுதியான பகுதி",

            allAreas:
                "அனைத்து பகுதிகளும்",

            details:
                "விவரங்கள்",

            noSpecialIssue:
                "சிறப்பு அரசு வழங்கல் தகவல்கள் எதுவும் கிடைக்கவில்லை."

        }

    };

    return translations[language][key] ||
           translations.en[key] ||
           key;

}


// =========================================
// CONVERT MYSQL TIME TO AM/PM
// =========================================

function formatTime(time) {

    if (!time) {
        return "--";
    }

    const parts = String(time).split(":");

    let hour = parseInt(parts[0], 10);
    let minute = parts[1] || "00";

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
        hour = 12;
    }

    return String(hour).padStart(2, "0") +
           ":" +
           minute +
           " " +
           ampm;
}


// =========================================
// GET LOCAL DATE YYYY-MM-DD
// =========================================

function getLocalDateString(date = new Date()) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// =========================================
// GET TOMORROW DATE
// =========================================

function getTomorrowDateString() {

    const tomorrow = new Date();

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );

    return getLocalDateString(tomorrow);
}


// =========================================
// CONVERT DATABASE DATE TO INDIA LOCAL DATE
// =========================================

function getScheduleDate(dateValue) {

    if (!dateValue) {
        return "";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return String(dateValue).substring(0, 10);
    }

    return getLocalDateString(date);
}


// =========================================
// FORMAT DATE FOR PUBLIC PAGE
// =========================================

function formatDisplayDate(dateValue) {

    if (!dateValue) {
        return "--";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return String(dateValue).substring(0, 10);
    }

    const language = getCurrentLanguage();

    return date.toLocaleDateString(
        language === "ta" ? "ta-IN" : "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// =========================================
// GET ITEM IMAGE
// =========================================

function getItemImage(itemName) {

    const item = String(itemName || "")
        .trim()
        .toLowerCase();

    const itemImages = {

        "rice": "images/rice.jpg",

        "oil": "images/oil.jpg",

        "sugar": "images/sugar.jpg",

        "wheat": "images/wheat.jpg",

        "dal": "images/dhal.jpg",

        "kerosene": "images/kerosene.png"

    };

    return itemImages[item] ||
           "images/item-default.jpg";
}


// =========================================
// LOAD PUBLIC INFORMATION
// =========================================

async function loadPublicInformation() {

    try {

        const response = await fetch(
           https://makkalhub-backend.onrender.com/api/public
        );

        const data = await response.json();

        if (!data.success) {

            console.error(
                "Failed to load public information"
            );

            return;
        }

        console.log(
            "Public information loaded:",
            data
        );


        // =========================================
        // TODAY & TOMORROW
        // =========================================

        const todayDate =
            getLocalDateString();

        const tomorrowDate =
            getTomorrowDateString();


        // =========================================
        // SHOP STATUS
        // =========================================

        const publicShopStatus =
            document.getElementById(
                "publicShopStatus"
            );

        const publicInTime =
            document.getElementById(
                "publicInTime"
            );

        const publicOutTime =
            document.getElementById(
                "publicOutTime"
            );


        if (data.shopStatus) {

            if (publicShopStatus) {

                publicShopStatus.textContent =
                    translateShopStatus(
                        data.shopStatus.shop_status
                    );

            }


            if (publicInTime) {

                publicInTime.textContent =
                    formatTime(
                        data.shopStatus.in_time
                    );

            }


            if (publicOutTime) {

                publicOutTime.textContent =
                    formatTime(
                        data.shopStatus.out_time
                    );

            }


            // =====================================
            // ADMIN AVAILABILITY / LEAVE
            // =====================================

            const publicAdminStatus =
                document.getElementById(
                    "publicAdminStatus"
                );

            if (publicAdminStatus) {

                publicAdminStatus.textContent =
                    translateAdminStatus(
                        data.shopStatus.admin_status ||
                        "Available"
                    );

            }


            // =====================================
            // LEAVE DATE
            // =====================================

            const publicLeaveDate =
                document.getElementById(
                    "publicLeaveDate"
                );

            if (publicLeaveDate) {

                if (data.shopStatus.leave_date) {

                    publicLeaveDate.textContent =
                        formatDisplayDate(
                            data.shopStatus.leave_date
                        );

                } else {

                    publicLeaveDate.textContent =
                        "--";

                }

            }


            // =====================================
            // LEAVE REASON
            // =====================================

            const publicLeaveReason =
                document.getElementById(
                    "publicLeaveReason"
                );

            if (publicLeaveReason) {

                publicLeaveReason.textContent =
                    data.shopStatus.leave_reason ||
                    "--";

            }


            // =====================================
            // NEXT AVAILABLE DATE
            // =====================================

            const publicNextAvailableDate =
                document.getElementById(
                    "publicNextAvailableDate"
                );

            if (publicNextAvailableDate) {

                if (
                    data.shopStatus
                        .next_available_date
                ) {

                    publicNextAvailableDate.textContent =
                        formatDisplayDate(
                            data.shopStatus
                                .next_available_date
                        );

                } else {

                    publicNextAvailableDate.textContent =
                        "--";

                }

            }

        } else {

            if (publicShopStatus) {

                publicShopStatus.textContent =
                    getTranslatedText(
                        "noInformation"
                    );

            }

            if (publicInTime) {

                publicInTime.textContent =
                    "--";

            }

            if (publicOutTime) {

                publicOutTime.textContent =
                    "--";

            }


            const publicAdminStatus =
                document.getElementById(
                    "publicAdminStatus"
                );

            if (publicAdminStatus) {

                publicAdminStatus.textContent =
                    "--";

            }


            const publicLeaveDate =
                document.getElementById(
                    "publicLeaveDate"
                );

            if (publicLeaveDate) {

                publicLeaveDate.textContent =
                    "--";

            }


            const publicLeaveReason =
                document.getElementById(
                    "publicLeaveReason"
                );

            if (publicLeaveReason) {

                publicLeaveReason.textContent =
                    "--";

            }


            const publicNextAvailableDate =
                document.getElementById(
                    "publicNextAvailableDate"
                );

            if (publicNextAvailableDate) {

                publicNextAvailableDate.textContent =
                    "--";

            }

        }


        // =========================================
        // ALL SCHEDULE DATA
        // =========================================

        const allSchedules =
            data.schedule || [];


        // =========================================
        // TODAY'S DISTRIBUTION
        // =========================================

        const todaySchedules =
            allSchedules.filter(
                function (schedule) {

                    return (
                        getScheduleDate(
                            schedule.distribution_date
                        ) === todayDate
                    );

                }
            );


        const todayAreaElement =
            document.getElementById(
                "todayArea"
            );

        const todayTimeElement =
            document.getElementById(
                "todayDistributionTime"
            );


        if (todaySchedules.length > 0) {

            if (todayAreaElement) {

                todayAreaElement.innerHTML =
                    todaySchedules
                        .map(function (schedule) {

                            return `
                                <div>
                                    📍 ${translateAreaName(
                                        schedule.area_name
                                    )}
                                </div>
                            `;

                        })
                        .join("");

            }


            if (todayTimeElement) {

                todayTimeElement.innerHTML =
                    todaySchedules
                        .map(function (schedule) {

                            return `
                                <div>
                                    ${formatTime(
                                        schedule.start_time
                                    )}
                                    -
                                    ${formatTime(
                                        schedule.end_time
                                    )}
                                </div>
                            `;

                        })
                        .join("");

            }

        } else {

            if (todayAreaElement) {

                todayAreaElement.textContent =
                    getTranslatedText(
                        "noSchedule"
                    );

            }

            if (todayTimeElement) {

                todayTimeElement.textContent =
                    getTranslatedText(
                        "noTodaySchedule"
                    );

            }

        }


        // =========================================
        // TOMORROW'S DISTRIBUTION
        // =========================================

        const tomorrowSchedules =
            allSchedules.filter(
                function (schedule) {

                    return (
                        getScheduleDate(
                            schedule.distribution_date
                        ) === tomorrowDate
                    );

                }
            );


        const tomorrowAreaElement =
            document.getElementById(
                "tomorrowArea"
            );

        const tomorrowMessageElement =
            document.getElementById(
                "tomorrowMessage"
            );


        if (tomorrowSchedules.length > 0) {

            if (tomorrowAreaElement) {

                tomorrowAreaElement.innerHTML =
                    tomorrowSchedules
                        .map(function (schedule) {

                            return `
                                <div>
                                    📍 ${translateAreaName(
                                        schedule.area_name
                                    )}
                                </div>
                            `;

                        })
                        .join("");

            }


            if (tomorrowMessageElement) {

                tomorrowMessageElement.innerHTML =
                    tomorrowSchedules
                        .map(function (schedule) {

                            return `
                                <div>
                                    ${formatTime(
                                        schedule.start_time
                                    )}
                                    -
                                    ${formatTime(
                                        schedule.end_time
                                    )}
                                </div>
                            `;

                        })
                        .join("");

            }

        } else {

            if (tomorrowAreaElement) {

                tomorrowAreaElement.textContent =
                    getTranslatedText(
                        "noSchedule"
                    );

            }

            if (tomorrowMessageElement) {

                tomorrowMessageElement.textContent =
                    getTranslatedText(
                        "noTomorrowSchedule"
                    );

            }

        }


        // =========================================
        // TODAY'S ITEMS
        // =========================================

        const publicItemsGrid =
            document.getElementById(
                "publicItemsGrid"
            );


        if (
            publicItemsGrid &&
            data.items &&
            data.items.length > 0
        ) {

            publicItemsGrid.innerHTML = "";


            data.items.forEach(
                function (item) {

                    const itemCard =
                        document.createElement(
                            "div"
                        );

                    itemCard.className =
                        "item-card";


                    const itemUnit =
                        item.unit || "Kg";


                    const translatedItemName =
                        translateItemName(
                            item.item_name
                        );


                    const translatedUnit =
                        translateUnit(
                            itemUnit
                        );


                    // =================================
                    // ITEM IMAGE
                    // =================================

                    const itemImage =
                        getItemImage(
                            item.item_name
                        );


                    itemCard.innerHTML = `

                        <div class="item-visual">

                            <img
                                src="${itemImage}"
                                alt="${translatedItemName}"
                                class="item-image"
                                onerror="this.style.display='none';"
                            >

                        </div>


                        <div class="item-content">

                            <span class="info-label">
                                ${getTranslatedText("item")}
                            </span>


                            <h3>
                                ${translatedItemName}
                            </h3>


                            <p>
                                ₹${item.price} /
                                ${translatedUnit}
                            </p>


                            <small>
                                ${getTranslatedText("quantity")}:
                                ${item.quantity}
                                ${translatedUnit}
                            </small>


                            <br>


                            <small>
                                ${getTranslatedText("status")}:
                                ${translateScheduleStatus(
                                    item.availability
                                )}
                            </small>

                        </div>

                    `;


                    publicItemsGrid.appendChild(
                        itemCard
                    );

                }
            );

        } else if (publicItemsGrid) {

            publicItemsGrid.innerHTML = `

                <div class="item-card">

                    <div class="item-visual">
                        📦
                    </div>

                    <div class="item-content">

                        <h3>
                            ${getTranslatedText(
                                "noItemsAvailable"
                            )}
                        </h3>

                        <p>
                            ${getTranslatedText(
                                "todayItemsUnavailable"
                            )}
                        </p>

                    </div>

                </div>

            `;

        }


        // =========================================
        // AREA-WISE DISTRIBUTION SCHEDULE
        // =========================================

        const publicScheduleTable =
            document.getElementById(
                "publicScheduleTable"
            );


        if (
            publicScheduleTable &&
            allSchedules &&
            allSchedules.length > 0
        ) {

            publicScheduleTable.innerHTML = `

                <div class="schedule-row schedule-header">

                    <div>
                        ${getTranslatedText("date")}
                    </div>

                    <div>
                        ${getTranslatedText("area")}
                    </div>

                    <div>
                        ${getTranslatedText("time")}
                    </div>

                    <div>
                        ${getTranslatedText("scheduleStatus")}
                    </div>

                </div>

            `;


            allSchedules.forEach(
                function (schedule) {

                    const row =
                        document.createElement("div");

                    row.className =
                        "schedule-row";


                    const displayDate =
                        formatDisplayDate(
                            schedule.distribution_date
                        );


                    const availableItems =
                        schedule.available_items
                            ? schedule.available_items
                                .split(",")
                                .map(function (item) {
                                    return translateItemName(
                                        item.trim()
                                    );
                                })
                                .join(", ")
                            : getTranslatedText(
                                "noItemsSpecified"
                            );


                    row.innerHTML = `

                        <div>
                            ${displayDate}
                        </div>


                        <div>

                            <strong>
                                ${translateAreaName(
                                    schedule.area_name
                                )}
                            </strong>

                            <br>

                            <small>
                                📦
                                ${getTranslatedText(
                                    "availableItems"
                                )}:
                                ${availableItems}
                            </small>

                        </div>


                        <div>

                            ${formatTime(
                                schedule.start_time
                            )}

                            -

                            ${formatTime(
                                schedule.end_time
                            )}

                        </div>


                        <div class="${
                            schedule.status ===
                            "Available"
                                ? "available"
                                : "upcoming"
                        }">

                            ${translateScheduleStatus(
                                schedule.status
                            )}

                        </div>

                    `;


                    publicScheduleTable.appendChild(
                        row
                    );

                }
            );

        } else if (publicScheduleTable) {

            publicScheduleTable.innerHTML = `

                <div class="schedule-row">

                    <div>
                        ${getTranslatedText(
                            "noScheduleAvailable"
                        )}
                    </div>

                </div>

            `;

        }


        // =========================================
        // ALL SPECIAL GOVERNMENT ISSUES
        // =========================================

        const publicSpecialIssue =
            document.getElementById(
                "publicSpecialIssue"
            );


        const specialIssues =
            data.specialIssues || [];


        if (
            publicSpecialIssue &&
            specialIssues.length > 0
        ) {

            publicSpecialIssue.innerHTML = "";


            specialIssues.forEach(
                function (issue) {

                    const issueCard =
                        document.createElement(
                            "div"
                        );


                    issueCard.className =
                        "public-special-issue-card";


                    const translatedItemName =
                        translateItemName(
                            issue.item_name
                        );


                    const translatedUnit =
                        translateUnit(
                            issue.unit || ""
                        );


                    const translatedArea =
                        issue.eligible_area
                            ? translateAreaName(
                                issue.eligible_area
                            )
                            : getTranslatedText(
                                "allAreas"
                            );


                    issueCard.innerHTML = `

                        <div class="special-issue-item">

                            <p>

                                <strong>
                                    📦
                                    ${getTranslatedText(
                                        "item"
                                    )}:
                                </strong>

                                ${translatedItemName}

                            </p>


                            <p>

                                <strong>
                                    🔢
                                    ${getTranslatedText(
                                        "quantity"
                                    )}:
                                </strong>

                                ${issue.quantity || 0}

                                ${translatedUnit}

                            </p>


                            <p>

                                <strong>
                                    📅
                                    ${getTranslatedText(
                                        "issueDate"
                                    )}:
                                </strong>

                                ${
                                    issue.issue_date
                                        ? formatDisplayDate(
                                            issue.issue_date
                                        )
                                        : "--"
                                }

                            </p>


                            <p>

                                <strong>
                                    📍
                                    ${getTranslatedText(
                                        "eligibleArea"
                                    )}:
                                </strong>

                                ${translatedArea}

                            </p>


                            ${
                                issue.description
                                    ? `

                                        <p>

                                            <strong>
                                                📝
                                                ${getTranslatedText(
                                                    "details"
                                                )}:
                                            </strong>

                                            ${issue.description}

                                        </p>

                                      `
                                    : ""
                            }

                        </div>

                    `;


                    publicSpecialIssue.appendChild(
                        issueCard
                    );

                }
            );

        } else if (publicSpecialIssue) {

            publicSpecialIssue.innerHTML = `

                <p>
                    ${getTranslatedText(
                        "noSpecialIssue"
                    )}
                </p>

            `;

        }


    } catch (error) {

        console.error(
            "Unable to connect to backend:",
            error
        );

    }

}


// =========================================
// RELOAD PUBLIC DATA WHEN LANGUAGE CHANGES
// =========================================

// The language.js changes localStorage.
// This event makes dynamic data refresh
// immediately when the user switches language.

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key ===
            "makkalhubLanguage"
        ) {

            loadPublicInformation();

        }

    }
);


// =========================================
// DETECT LANGUAGE BUTTON CLICK
// =========================================

// Since the language toggle is on the same page,
// watch for the button and reload dynamic content
// immediately after the language changes.

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const languageToggle =
            document.getElementById(
                "languageToggle"
            );

        if (languageToggle) {

            languageToggle.addEventListener(
                "click",
                function () {

                    setTimeout(
                        function () {

                            loadPublicInformation();

                        },
                        50
                    );

                }
            );

        }

    }
);


// =========================================
// START
// =========================================

loadPublicInformation();