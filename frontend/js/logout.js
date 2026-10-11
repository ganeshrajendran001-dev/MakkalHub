document.addEventListener("DOMContentLoaded", function () {

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                // Clear admin login session
                sessionStorage.removeItem("admin");

                // Go to public website
                window.location.href = "index.html";
            }
        );

    }

});