const changePasswordForm =
    document.getElementById("changePasswordForm");

const passwordMessage =
    document.getElementById("passwordMessage");

const adminUsername =
    document.getElementById("adminUsername");


// ================================
// CHECK ADMIN LOGIN
// ================================

const storedAdmin =
    sessionStorage.getItem("admin");

if (!storedAdmin) {

    window.location.href = "login.html";

} else {

    try {

        const adminData =
            JSON.parse(storedAdmin);

        if (!adminData || !adminData.username) {

            sessionStorage.removeItem("admin");

            window.location.href = "login.html";

        } else {

            adminUsername.textContent =
                adminData.username;

        }

    } catch (error) {

        console.error(
            "Admin session error:",
            error
        );

        sessionStorage.removeItem("admin");

        window.location.href = "login.html";
    }
}


// ================================
// PASSWORD EYE
// ================================

const eyeButtons =
    document.querySelectorAll(".password-eye");

eyeButtons.forEach(function (button) {

    button.addEventListener("mouseenter", function () {

        const targetId =
            button.getAttribute("data-target");

        const passwordInput =
            document.getElementById(targetId);

        if (passwordInput) {
            passwordInput.type = "text";
        }
    });


    button.addEventListener("mouseleave", function () {

        const targetId =
            button.getAttribute("data-target");

        const passwordInput =
            document.getElementById(targetId);

        if (passwordInput) {
            passwordInput.type = "password";
        }
    });

});


// ================================
// CHANGE PASSWORD
// ================================

changePasswordForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const storedAdmin =
            sessionStorage.getItem("admin");

        if (!storedAdmin) {

            window.location.href =
                "login.html";

            return;
        }


        let adminData;

        try {

            adminData =
                JSON.parse(storedAdmin);

        } catch (error) {

            sessionStorage.removeItem("admin");

            window.location.href =
                "login.html";

            return;
        }


        const currentPassword =
            document.getElementById(
                "currentPassword"
            ).value;

        const newPassword =
            document.getElementById(
                "newPassword"
            ).value;

        const confirmPassword =
            document.getElementById(
                "confirmPassword"
            ).value;


        // Check current password

        if (!currentPassword) {

            passwordMessage.textContent =
                "Please enter your current password.";

            passwordMessage.style.color =
                "red";

            return;
        }


        // Check new password

        if (!newPassword) {

            passwordMessage.textContent =
                "Please enter a new password.";

            passwordMessage.style.color =
                "red";

            return;
        }


        // Check password match

        if (newPassword !== confirmPassword) {

            passwordMessage.textContent =
                "New password and confirm password do not match.";

            passwordMessage.style.color =
                "red";

            return;
        }


        // Minimum password length

        if (newPassword.length < 6) {

            passwordMessage.textContent =
                "New password must contain at least 6 characters.";

            passwordMessage.style.color =
                "red";

            return;
        }


        // Prevent same password

        if (currentPassword === newPassword) {

            passwordMessage.textContent =
                "New password must be different from the current password.";

            passwordMessage.style.color =
                "red";

            return;
        }


        passwordMessage.textContent =
            "Changing password...";

        passwordMessage.style.color =
            "#555";


        try {

            const response =
                await fetch(
                    "https://makkalhub-backend.onrender.com/api/auth/change-password",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username:
                                adminData.username,

                            currentPassword:
                                currentPassword,

                            newPassword:
                                newPassword
                        })
                    }
                );


            const data =
                await response.json();


            if (data.success) {

                passwordMessage.textContent =
                    "Password changed successfully!";

                passwordMessage.style.color =
                    "green";


                changePasswordForm.reset();


            } else {

                passwordMessage.textContent =
                    data.message ||
                    "Failed to change password.";

                passwordMessage.style.color =
                    "red";
            }


        } catch (error) {

            console.error(
                "Password Change Error:",
                error
            );

            passwordMessage.textContent =
                "Unable to connect to backend server.";

            passwordMessage.style.color =
                "red";
        }

    }
);