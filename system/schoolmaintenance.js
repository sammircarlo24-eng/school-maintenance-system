const userRole = localStorage.getItem("userRole");
const username = localStorage.getItem("username");

if (!userRole) {
    window.location.href = "login.html";
}

const maintenanceForm = document.getElementById("maintenanceForm");
const requestList = document.getElementById("requestList");
const searchRequest = document.getElementById("searchRequest");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");

const requestSection = document.getElementById("requests");
const requestLink = document.querySelector('nav a[href="#requests"]');
const submitLink = document.querySelector('nav a[href="#request"]');
const heroButton = document.querySelector(".hero-btn");

let reports = JSON.parse(localStorage.getItem("maintenanceReports")) || [];

if (userRole === "student") {
    setupStudent();
} else if (userRole === "admin") {
    setupAdmin();
}

function setupStudent() {

    document.querySelector(".system-label").textContent =
        "AITE STUDENT MAINTENANCE SYSTEM";

    document.querySelector(".hero-content h2").textContent =
        "Report a School Facility Problem";

    document.querySelector(".hero-content p").textContent =
        "Submit a maintenance report and monitor the status of your request.";

    heroButton.textContent = "Submit a Report";

    if (requestLink) {
        requestLink.textContent = "My Reports";
    }

    document.querySelector("#requests .section-label").textContent =
        "MY REPORTS";

    document.querySelector("#requests h2").textContent =
        "My Maintenance Reports";

    document.querySelector("#requests p").textContent =
        "View the status of your submitted maintenance reports.";

    if (maintenanceForm) {
        document.getElementById("name").value = username || "";
        document.getElementById("name").readOnly = true;

        document.getElementById("role").value = "Student";
        document.getElementById("role").disabled = true;
    }

    if (searchRequest) {
        searchRequest.placeholder = "Search my reports...";
    }

    updateDashboard();
    displayReports();
}

function setupAdmin() {

    document.querySelector(".system-label").textContent =
        "AITE ADMIN MAINTENANCE SYSTEM";

    document.querySelector(".hero-content h2").textContent =
        "School Maintenance Request Management";

    document.querySelector(".hero-content p").textContent =
        "Manage, update, and resolve school maintenance reports.";

    heroButton.textContent = "Manage Reports";

    if (submitLink) {
        submitLink.style.display = "none";
    }

    if (requestLink) {
        requestLink.textContent = "Manage Reports";
    }

    document.querySelector("#request").style.display = "none";

    document.querySelector("#requests .section-label").textContent =
        "ADMIN MANAGEMENT";

    document.querySelector("#requests h2").textContent =
        "Manage Maintenance Reports";

    document.querySelector("#requests p").textContent =
        "Search, edit, update, and resolve maintenance reports.";

    updateDashboard();
    displayReports();
}

maintenanceForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (userRole !== "student") {
        return;
    }

    const name = document.getElementById("name").value.trim();
    const role = "Student";
    const location = document.getElementById("location").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();

    if (!name || !location || !category || !description) {
        return;
    }

    const newReport = {
        id: Date.now(),
        name: name,
        role: role,
        location: location,
        category: category,
        description: description,
        status: "Pending",
        date: new Date().toLocaleString()
    };

    reports.push(newReport);

    localStorage.setItem(
        "maintenanceReports",
        JSON.stringify(reports)
    );

    maintenanceForm.reset();

    document.getElementById("name").value = username || "";
    document.getElementById("name").readOnly = true;

    document.getElementById("role").value = "Student";
    document.getElementById("role").disabled = true;

    alert("Maintenance report submitted successfully.");

    updateDashboard();
    displayReports();

    document.getElementById("requests").scrollIntoView({
        behavior: "smooth"
    });
});

function displayReports() {

    requestList.innerHTML = "";

    let visibleReports = [...reports];

    if (userRole === "student") {
        visibleReports = visibleReports.filter(function(report) {
            return report.name === username;
        });
    }

    const searchValue = searchRequest
        ? searchRequest.value.toLowerCase()
        : "";

    const selectedStatus = statusFilter
        ? statusFilter.value
        : "All";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "All";

    visibleReports = visibleReports.filter(function(report) {

        const searchMatch =
            report.name.toLowerCase().includes(searchValue) ||
            report.location.toLowerCase().includes(searchValue) ||
            report.category.toLowerCase().includes(searchValue) ||
            report.description.toLowerCase().includes(searchValue);

        const statusMatch =
            selectedStatus === "All" ||
            report.status === selectedStatus;

        const categoryMatch =
            selectedCategory === "All" ||
            report.category === selectedCategory;

        return searchMatch && statusMatch && categoryMatch;
    });

    if (visibleReports.length === 0) {

        requestList.innerHTML = `
            <div class="no-reports">
                No maintenance reports found.
            </div>
        `;

        return;
    }

    visibleReports.forEach(function(report) {

        const card = document.createElement("div");

        card.className = "request-card";

        const statusClass =
            report.status === "Pending"
                ? "pending"
                : report.status === "In Progress"
                    ? "progress"
                    : "resolved";

        let adminControls = "";

        if (userRole === "admin") {

            adminControls = `
                <div class="admin-report-controls">

                    <label>Update Status</label>

                    <select
                        onchange="updateStatus(${report.id}, this.value)"
                    >
                        <option value="Pending"
                            ${report.status === "Pending" ? "selected" : ""}>
                            Pending
                        </option>

                        <option value="In Progress"
                            ${report.status === "In Progress" ? "selected" : ""}>
                            In Progress
                        </option>

                        <option value="Resolved"
                            ${report.status === "Resolved" ? "selected" : ""}>
                            Resolved
                        </option>
                    </select>

                    <button
                        class="resolve-btn"
                        onclick="markDone(${report.id})"
                    >
                        Mark as Done
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteReport(${report.id})"
                    >
                        Delete
                    </button>

                </div>
            `;
        }

        card.innerHTML = `
            <div class="request-header">

                <h3>
                    ${escapeHTML(report.category)}
                </h3>

                <span class="status ${statusClass}">
                    ${escapeHTML(report.status)}
                </span>

            </div>

            <div class="request-info">

                <p>
                    <strong>Reported By:</strong>
                    ${escapeHTML(report.name)}
                </p>

                <p>
                    <strong>User Type:</strong>
                    ${escapeHTML(report.role)}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${escapeHTML(report.location)}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${escapeHTML(report.description)}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${escapeHTML(report.date)}
                </p>

            </div>

            ${adminControls}
        `;

        requestList.appendChild(card);
    });
}

function updateStatus(id, newStatus) {

    if (userRole !== "admin") {
        return;
    }

    const report = reports.find(function(item) {
        return item.id === id;
    });

    if (!report) {
        return;
    }

    report.status = newStatus;

    localStorage.setItem(
        "maintenanceReports",
        JSON.stringify(reports)
    );

    updateDashboard();
    displayReports();
}

function markDone(id) {

    if (userRole !== "admin") {
        return;
    }

    const report = reports.find(function(item) {
        return item.id === id;
    });

    if (!report) {
        return;
    }

    report.status = "Resolved";

    localStorage.setItem(
        "maintenanceReports",
        JSON.stringify(reports)
    );

    updateDashboard();
    displayReports();
}

function deleteReport(id) {

    if (userRole !== "admin") {
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) {
        return;
    }

    reports = reports.filter(function(report) {
        return report.id !== id;
    });

    localStorage.setItem(
        "maintenanceReports",
        JSON.stringify(reports)
    );

    updateDashboard();
    displayReports();
}

function updateDashboard() {

    let dashboardReports = [...reports];

    if (userRole === "student") {
        dashboardReports = dashboardReports.filter(function(report) {
            return report.name === username;
        });
    }

    const total = dashboardReports.length;

    const pending = dashboardReports.filter(function(report) {
        return report.status === "Pending";
    }).length;

    const progress = dashboardReports.filter(function(report) {
        return report.status === "In Progress";
    }).length;

    const resolved = dashboardReports.filter(function(report) {
        return report.status === "Resolved";
    }).length;

    document.getElementById("totalRequests").textContent = total;
    document.getElementById("pendingRequests").textContent = pending;
    document.getElementById("progressRequests").textContent = progress;
    document.getElementById("resolvedRequests").textContent = resolved;
}

function logout() {

    const role = localStorage.getItem("userRole");

    localStorage.removeItem("userRole");
    localStorage.removeItem("username");

    if (role === "admin") {
        window.location.replace("admin.html");
    } else {
        window.location.replace("login.html");
    }
}

if (searchRequest) {
    searchRequest.addEventListener("input", displayReports);
}

if (statusFilter) {
    statusFilter.addEventListener("change", displayReports);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", displayReports);
}

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}