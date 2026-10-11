// =====================================================
// MAKKALHUB - ENGLISH / TAMIL LANGUAGE TOGGLE
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const languageToggle = document.getElementById("languageToggle");
    const languageToggleText =
        document.getElementById("languageToggleText");

    // -------------------------------------------------
    // TRANSLATIONS
    // -------------------------------------------------

    const translations = {

        en: {

            brandName: "MakkalHub",

            navHome: "Home",
            navToday: "Today's Information",
            navItems: "Today's Items",
            navSchedule: "Schedule",
            navSpecial: "Special Issue",
            navAdmin: "Admin Login",

            heroEyebrow:
                "DIGITAL PUBLIC INFORMATION PORTAL",

            heroDescription:
                "Access the latest shop information, daily item prices, area-wise distribution schedules and special government issue updates in one place.",

            heroTodayButton:
                "View Today's Information",

            heroScheduleButton:
                "View Schedule",

            todayLabel:
                "TODAY",

            todayTitle:
                "Today's Information",

            todayDescription:
                "Quickly check today's shop status, distribution area and upcoming information.",

            shopStatusLabel:
                "SHOP STATUS",

            shopStatusTitle:
                "Shop Status",

            inTime:
                "In Time",

            outTime:
                "Out Time",

            availability:
                "Availability",

            leaveDate:
                "Leave Date",

            leaveReason:
                "Leave Reason",

            nextAvailable:
                "Next Available",

            distributionLabel:
                "DISTRIBUTION",

            todayDistributionTitle:
                "Today's Distribution",

            distributionTime:
                "Distribution Time",

            upcomingLabel:
                "UPCOMING",

            tomorrowTitle:
                "Tomorrow",

            tomorrowMessage:
                "Distribution information will be displayed here.",

            dailyItemsLabel:
                "DAILY ITEMS",

            todayItemsTitle:
                "Today's Items",

            todayItemsDescription:
                "Check the items, prices, quantity and availability updated for today.",

            itemLabel:
                "ITEM",

            loading:
                "Loading...",

            itemLoadingMessage:
                "Please wait while today's item information is loaded.",

            areaInformationLabel:
                "AREA-WISE INFORMATION",

            distributionScheduleTitle:
                "Distribution Schedule",

            distributionScheduleDescription:
                "View distribution information for each service area.",

            loadingSchedule:
                "Loading schedule...",

            governmentUpdateLabel:
                "GOVERNMENT UPDATE",

            specialIssueTitle:
                "Special Government Issue",

            specialIssueDescription:
                "Information about upcoming special government-issued items and benefits.",

            specialIssueLoading:
                "Loading special issue information...",

            footerDescription:
                "Digital Public Information & Notification Portal",

            footerCopyright:
                "© 2026 MakkalHub. All rights reserved."
        },


        // -------------------------------------------------
        // TAMIL
        // -------------------------------------------------

        ta: {

            brandName:
                "மக்கள்ஹப்",

            navHome:
                "முகப்பு",

            navToday:
                "இன்றைய தகவல்கள்",

            navItems:
                "இன்றைய பொருட்கள்",

            navSchedule:
                "விநியோக அட்டவணை",

            navSpecial:
                "சிறப்பு வழங்கல்",

            navAdmin:
                "நிர்வாக உள்நுழைவு",

            heroEyebrow:
                "டிஜிட்டல் பொது தகவல் மற்றும் அறிவிப்பு தளம்",

            heroDescription:
                "கடை தகவல்கள், தினசரி பொருட்களின் விலைகள், பகுதி வாரியான விநியோக அட்டவணைகள் மற்றும் சிறப்பு அரசு வழங்கல் தகவல்களை ஒரே இடத்தில் அறிந்து கொள்ளுங்கள்.",

            heroTodayButton:
                "இன்றைய தகவல்களைப் பார்க்க",

            heroScheduleButton:
                "அட்டவணையைப் பார்க்க",

            todayLabel:
                "இன்று",

            todayTitle:
                "இன்றைய தகவல்கள்",

            todayDescription:
                "இன்றைய கடை நிலை, விநியோக பகுதி மற்றும் அடுத்தடுத்த தகவல்களை விரைவாகப் பார்க்கலாம்.",

            shopStatusLabel:
                "கடை நிலை",

            shopStatusTitle:
                "கடை நிலை",

            inTime:
                "திறக்கும் நேரம்",

            outTime:
                "மூடும் நேரம்",

            availability:
                "கிடைக்கும் நிலை",

            leaveDate:
                "விடுப்பு தேதி",

            leaveReason:
                "விடுப்பு காரணம்",

            nextAvailable:
                "அடுத்த கிடைக்கும் தேதி",

            distributionLabel:
                "விநியோகம்",

            todayDistributionTitle:
                "இன்றைய விநியோகம்",

            distributionTime:
                "விநியோக நேரம்",

            upcomingLabel:
                "வரவுள்ளது",

            tomorrowTitle:
                "நாளை",

            tomorrowMessage:
                "விநியோக தகவல்கள் இங்கே காட்டப்படும்.",

            dailyItemsLabel:
                "தினசரி பொருட்கள்",

            todayItemsTitle:
                "இன்றைய பொருட்கள்",

            todayItemsDescription:
                "இன்றைய பொருட்கள், விலைகள், அளவு மற்றும் கிடைக்கும் நிலையைப் பார்க்கலாம்.",

            itemLabel:
                "பொருள்",

            loading:
                "ஏற்றப்படுகிறது...",

            itemLoadingMessage:
                "இன்றைய பொருள் தகவல்கள் ஏற்றப்படும் வரை காத்திருக்கவும்.",

            areaInformationLabel:
                "பகுதி வாரியான தகவல்",

            distributionScheduleTitle:
                "விநியோக அட்டவணை",

            distributionScheduleDescription:
                "ஒவ்வொரு சேவைப் பகுதிக்கும் உரிய விநியோக தகவல்களைப் பார்க்கலாம்.",

            loadingSchedule:
                "அட்டவணை ஏற்றப்படுகிறது...",

            governmentUpdateLabel:
                "அரசு அறிவிப்பு",

            specialIssueTitle:
                "சிறப்பு அரசு வழங்கல்",

            specialIssueDescription:
                "வரவிருக்கும் சிறப்பு அரசு வழங்கும் பொருட்கள் மற்றும் நலத்திட்டங்கள் பற்றிய தகவல்கள்.",

            specialIssueLoading:
                "சிறப்பு வழங்கல் தகவல்கள் ஏற்றப்படுகின்றன...",

            footerDescription:
                "டிஜிட்டல் பொது தகவல் மற்றும் அறிவிப்பு தளம்",

            footerCopyright:
                "© 2026 MakkalHub. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."
        }

    };


    // -------------------------------------------------
    // CURRENT LANGUAGE
    // -------------------------------------------------

    let currentLanguage =
        localStorage.getItem("makkalhubLanguage") || "en";


    // -------------------------------------------------
    // APPLY LANGUAGE
    // -------------------------------------------------

    function applyLanguage(language) {

        currentLanguage = language;

        const elements =
            document.querySelectorAll("[data-i18n]");

        elements.forEach(function (element) {

            const key =
                element.getAttribute("data-i18n");

            if (
                translations[language] &&
                translations[language][key]
            ) {

                element.textContent =
                    translations[language][key];

            }

        });


        // Change button text

        if (languageToggleText) {

            if (language === "en") {

                languageToggleText.textContent =
                    "தமிழ்";

            } else {

                languageToggleText.textContent =
                    "English";

            }

        }


        // Change HTML language

        document.documentElement.lang =
            language === "ta" ? "ta" : "en";


        // Save language

        localStorage.setItem(
            "makkalhubLanguage",
            language
        );

    }


    // -------------------------------------------------
    // TOGGLE LANGUAGE
    // -------------------------------------------------

    if (languageToggle) {

        languageToggle.addEventListener(
            "click",
            function () {

                if (currentLanguage === "en") {

                    applyLanguage("ta");

                } else {

                    applyLanguage("en");

                }

            }
        );

    }


    // -------------------------------------------------
    // INITIAL LANGUAGE
    // -------------------------------------------------

    applyLanguage(currentLanguage);

});