const clearTodayBtn =
    document.getElementById("clearTodayBtn");

const clearTodayMessage =
    document.getElementById("clearTodayMessage");


if (clearTodayBtn) {

    clearTodayBtn.addEventListener(
        "click",
        async function () {

            // Confirmation
            const confirmed = confirm(
                "⚠️ Are you sure?\n\n" +
                "Today's items, shop information and today's area schedule will be cleared from the public website.\n\n" +
                "History, SMS history, public numbers, special issue and upcoming schedules will NOT be deleted.\n\n" +
                "Continue?"
            );


            if (!confirmed) {
                return;
            }


            // Disable button
            clearTodayBtn.disabled = true;

            clearTodayBtn.textContent =
                "🧹 Clearing...";


            clearTodayMessage.textContent = "";


            try {

                const response =
                    await fetch(
                        "https://makkalhub-backend.onrender.com/api/clear-today",
                        {
                            method: "DELETE"
                        }
                    );


                const data =
                    await response.json();


                if (data.success) {

                    clearTodayMessage.textContent =
                        "✅ " + data.message;

                    clearTodayMessage.style.color =
                        "green";


                    clearTodayBtn.textContent =
                        "✅ Today's Information Cleared";


                    clearTodayBtn.style.background =
                        "#198754";


                    alert(
                        "Today's information has been cleared successfully."
                    );


                } else {

                    clearTodayMessage.textContent =
                        "❌ " + data.message;

                    clearTodayMessage.style.color =
                        "red";


                    clearTodayBtn.textContent =
                        "🧹 Clear Today";

                }


            } catch (error) {

                console.error(
                    "Clear Today Error:",
                    error
                );


                clearTodayMessage.textContent =
                    "❌ Unable to connect to backend server.";

                clearTodayMessage.style.color =
                    "red";


                clearTodayBtn.textContent =
                    "🧹 Clear Today";

            }


            clearTodayBtn.disabled = false;

        }
    );

}