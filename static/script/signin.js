const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Collect form values
    const formData = new URLSearchParams();
    formData.append("username", document.getElementById("username").value);
    formData.append("password", document.getElementById("password").value);

    try {
        const response = await fetch("http://127.0.0.1:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString(), // send as URL-encoded
            credentials: "include" // Important! Sends/receives cookies
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Login failed: " + errorData.detail);
            return;
        }

        const data = await response.json();
        console.log("Login success:", data);
        alert("Login successful! Redirecting to main page...");

        // Redirect to main page after successful login
        window.location.href = "../pages/Mainpage.html";

    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during login.");
    }
});


