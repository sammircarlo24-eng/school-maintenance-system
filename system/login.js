document.getElementById("loginForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");

    const accounts =
        JSON.parse(localStorage.getItem("studentAccounts")) || [];

    const account = accounts.find(function(user) {
        return (
            user.username.toLowerCase() === username.toLowerCase() &&
            user.password === password
        );
    });

    if (account) {

        localStorage.setItem("userRole", "student");
        localStorage.setItem("username", account.username);
        localStorage.setItem("studentName", account.name);

        message.textContent = "Login successful!";
        message.style.color = "#86efac";

        setTimeout(function() {
            window.location.href = "School_Maintenance.html";
        }, 800);

    } else {

        message.textContent = "Invalid username or password.";
        message.style.color = "#f87171";

    }
});