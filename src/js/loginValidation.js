
const form = document.getElementById("loginForm");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const generalError = document.getElementById("error");

const togglePasswordBtn = document.getElementById("togglePasswordBtn");

// Check email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Clear validation messages
function clearErrors() {
    emailError.textContent = "";
    passwordError.textContent = "";
    generalError.textContent = "";

    emailInput.removeAttribute("aria-invalid");
    passwordInput.removeAttribute("aria-invalid");
}

// Validate email and password
function validateForm() {
    clearErrors();

    let isValid = true;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (email === "") {
        emailError.textContent = "Email is required.";
        emailInput.setAttribute("aria-invalid", "true");
        isValid = false;
    } else if (!isValidEmail(email)) {
        emailError.textContent = "Please enter a valid email address.";
        emailInput.setAttribute("aria-invalid", "true");
        isValid = false;
    }

    if (password.trim() === "") {
        passwordError.textContent = "Password is required.";
        passwordInput.setAttribute("aria-invalid", "true");
        isValid = false;
    }

    return isValid;
}

// Show or hide password
togglePasswordBtn.addEventListener("click", function () {
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";

    togglePasswordBtn.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
    );
});

// Clear email error while typing
emailInput.addEventListener("input", function () {
    emailError.textContent = "";
    emailInput.removeAttribute("aria-invalid");
    generalError.textContent = "";
});

// Clear password error while typing
passwordInput.addEventListener("input", function () {
    passwordError.textContent = "";
    passwordInput.removeAttribute("aria-invalid");
    generalError.textContent = "";
});

// Handle form submission
form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    generalError.textContent =
        "Form validated successfully. Backend login is not connected yet.";
});
