document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;
    const message = document.getElementById("signupMessage");

    let accounts = JSON.parse(localStorage.getItem("studentAccounts")) || [];

    const exists = accounts.some(function(account) {
        return account.username.toLowerCase() === username.toLowerCase();
    });

    if (exists) {
        message.textContent = "Username already exists.";
        message.style.color = "#f87171";
        return;
    }

    if (password.length < 6) {
        message.textContent = "Password must be at least 6 characters.";
        message.style.color = "#f87171";
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        message.style.color = "#f87171";
        return;
    }

    const account = {
        name: name,
        username: username,
        password: password,
        role: "student"
    };

    accounts.push(account);

    localStorage.setItem(
        "studentAccounts",
        JSON.stringify(accounts)
    );

    localStorage.setItem("userRole", "student");
    localStorage.setItem("username", username);
    localStorage.setItem("studentName", name);

    message.textContent = "Account created! Opening Maintenance System...";
    message.style.color = "#86efac";

    setTimeout(function() {
        window.location.href = "School_Maintenance.html";
    }, 500);
});