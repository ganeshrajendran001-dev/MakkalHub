const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const eyeIcon =
    document.getElementById("eyeIcon");


// =========================================
// CLEAR LOGIN FIELDS WHEN PAGE OPENS
// =========================================

window.addEventListener("load", function () {

    const usernameField =
        document.getElementById("username");

    const passwordField =
        document.getElementById("password");


    if (usernameField) {
        usernameField.value = "";
    }


    if (passwordField) {
        passwordField.value = "";
    }

});


// =========================================
// SHOW PASSWORD WHEN MOUSE ENTERS EYE
// =========================================

if (togglePassword && passwordInput) {

    togglePassword.addEventListener(
        "mouseenter",
        function () {

            passwordInput.type = "text";


            togglePassword.setAttribute(
                "aria-label",
                "Hide password"
            );

            togglePassword.setAttribute(
                "title",
                "Password visible"
            );


            // Eye with slash
            eyeIcon.innerHTML = `
                <path
                    d="M3 3l18 18"
                />

                <path
                    d="M10.6 10.6
                       a2 2 0 0 0 2.8 2.8"
                />

                <path
                    d="M9.9 4.3
                       C10.6 4.1 11.3 4 12 4
                       C18.5 4 22 12 22 12
                       C21.3 13.6 20.2 15.2
                       18.8 16.5"
                />

                <path
                    d="M6.2 6.2
                       C4.3 7.5 3 9.5 2 12
                       C3.2 14.8 6.8 20 12 20
                       C13.8 20 15.4 19.5
                       16.8 18.7"
                />
            `;

        }
    );


    // =========================================
    // HIDE PASSWORD WHEN MOUSE LEAVES EYE
    // =========================================

    togglePassword.addEventListener(
        "mouseleave",
        function () {

            passwordInput.type = "password";


            togglePassword.setAttribute(
                "aria-label",
                "Show password"
            );

            togglePassword.setAttribute(
                "title",
                "Show password"
            );


            // Normal eye
            eyeIcon.innerHTML = `
                <path
                    d="M2 12s3.5-7 10-7
                       10 7 10 7
                       -3.5 7-10 7
                       -10-7-10-7z"
                />

                <circle
                    cx="12"
                    cy="12"
                    r="3"
                />
            `;

        }
    );

}


// =========================================
// LOGIN
// =========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const username =
            document
                .getElementById("username")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        // =========================================
        // VALIDATION
        // =========================================

        if (!username || !password) {

            loginMessage.textContent =
                "Please enter username and password.";

            loginMessage.style.color =
                "red";

            return;
        }


        loginMessage.textContent =
            "Checking login...";

        loginMessage.style.color =
            "#555";


        // =========================================
        // SEND LOGIN REQUEST
        // =========================================

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/auth/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                username:
                                    username,

                                password:
                                    password
                            })
                    }
                );


            const data =
                await response.json();


            // =========================================
            // LOGIN SUCCESS
            // =========================================

            if (data.success) {

                sessionStorage.setItem(
                    "admin",
                    JSON.stringify(data.admin)
                );


                loginMessage.textContent =
                    "Login successful!";

                loginMessage.style.color =
                    "green";


                setTimeout(
                    function () {

                        window.location.href =
                            "dashboard.html";

                    },
                    800
                );


            } else {

                loginMessage.textContent =
                    data.message ||
                    "Invalid username or password!";

                loginMessage.style.color =
                    "red";

            }


        } catch (error) {

            console.error(
                "Login Error:",
                error
            );


            loginMessage.textContent =
                "Unable to connect to backend server.";

            loginMessage.style.color =
                "red";

        }

    }
);