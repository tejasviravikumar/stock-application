const form = document.getElementById("signupForm");
const password = document.getElementById("password");
const confirmWrapper = document.getElementById("confirm-wrapper");
const confirmPassword = document.getElementById("confirmPassword");
const msg = document.getElementById("password-msg");

// show confirm password when user types password
password.addEventListener("input", () => {
    if (password.value.length > 0) {
        confirmWrapper.style.display = "block";
    } else {
        confirmWrapper.style.display = "none";
    }
});

// live match check
confirmPassword.addEventListener("input", () => {
    if (confirmPassword.value === password.value) {
        msg.textContent = "Passwords match";
        msg.style.color = "green";
    } else {
        msg.textContent = "Passwords do not match";
        msg.style.color = "red";
    }
});

// submit
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match");
        return;
    }

    const data = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: password.value,
    };

    try {
        const res = await fetch("http://127.0.0.1:8000/register/newuser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json();
            alert("Signup failed: " + (errorData.detail || "Unknown error"));
            return;
        }

        alert("Account created successfully! Redirecting to login page...");
        
        // Reset form
        form.reset();
        confirmWrapper.style.display = "none";
        msg.textContent = "";

        // Redirect to signin page after successful registration
        window.location.href = "../pages/signin.html";

    } catch (err) {
        console.error(err);
        alert("Error creating account");
    }
});