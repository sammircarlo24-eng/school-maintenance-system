document.getElementById("adminLoginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value;
    const message = document.getElementById("adminLoginMessage");

    if (username === "Patricia" && password === "admin123") {

        localStorage.setItem("userRole", "admin");
        localStorage.setItem("username", username);

        message.textContent = "Admin login successful!";
        message.style.color = "#86efac";

        setTimeout(function() {
            window.location.href = "School_Maintenance.html";
        }, 800);

    } else {

        message.textContent = "Invalid admin username or password.";
        message.style.color = "#f87171";

    }
});