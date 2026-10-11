
const API_URL = "http://https://makkalhub-backend.onrender.com/api/shop";

const form = document.getElementById("shopStatusForm");
const statusMessage = document.getElementById("statusMessage");
const historyMessage = document.getElementById("historyMessage");
const recordIdInput = document.getElementById("recordId");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelEditButton");
const activeCards = document.getElementById("historyCards");


let shopRecords = [];

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;",
        '"': "&quot;", "'": "&#39;"
    })[c]);
}

function formatDate(value) {
    if (!value) return "-";
    return String(value).slice(0, 10);
}

function formatTime(value) {
    if (!value) return "-";
    const [h, m] = String(value).slice(0, 5).split(":");
    const hour = Number(h);
    return `${String(hour % 12 || 12).padStart(2, "0")}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

function to24Hour(hour, minute, period) {
    let h = Number(hour);
    if (period === "AM" && h === 12) h = 0;
    if (period === "PM" && h !== 12) h += 12;
    return `${String(h).padStart(2, "0")}:${minute}`;
}

function setTimeFields(prefix, value) {
    if (!value) return;
    const [rawHour, minute] = String(value).slice(0, 5).split(":");
    const raw = Number(rawHour);
    document.getElementById(prefix + "Hour").value = String(raw % 12 || 12).padStart(2, "0");
    document.getElementById(prefix + "Minute").value = minute;
    document.getElementById(prefix + "Period").value = raw >= 12 ? "PM" : "AM";
}

async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.message || "Request failed.");
    }
    return data;
}


function renderCard(record) {
    const id = Number(record.schedule_id);

    return `
        <article class="status-card">
            <div class="status-details">
                <h3>📅 ${escapeHTML(formatDate(record.schedule_date))}</h3>
                <p>🏪 <strong>Status:</strong> ${escapeHTML(record.shop_status || "-")}</p>
                <p>🕒 <strong>Time:</strong> ${escapeHTML(formatTime(record.in_time))} - ${escapeHTML(formatTime(record.out_time))}</p>
                <p>📦 <strong>Admin Status:</strong> ${escapeHTML(record.admin_status || "-")}</p>
                ${record.leave_date ? `<p>🗓️ <strong>Leave Date:</strong> ${escapeHTML(formatDate(record.leave_date))}</p>` : ""}
                ${record.leave_reason ? `<p>📝 <strong>Reason:</strong> ${escapeHTML(record.leave_reason)}</p>` : ""}
                ${record.next_available_date ? `<p>➡️ <strong>Next Available:</strong> ${escapeHTML(formatDate(record.next_available_date))}</p>` : ""}
            </div>
            <div class="status-actions">
                <button class="action-button edit-button"
                    data-action="edit" data-id="${id}">✏️ Edit</button>
                <button class="action-button delete-button"
                    data-action="delete" data-id="${id}">🗑️ Delete</button>
            </div>
        </article>
    `;
}


async function loadShopHistory() {
    activeCards.innerHTML = `<p class="empty-message">Loading records...</p>`;

    try {
        const data = await apiRequest(API_URL);
        shopRecords = (data.records || []).filter(
            record => Number(record.is_archived) === 0
        );

        activeCards.innerHTML = shopRecords.length
            ? shopRecords.map(record => renderCard(record)).join("")
            : `<p class="empty-message">No shop status records found.</p>`;

    } catch (error) {
        console.error(error);
        activeCards.innerHTML =
            `<p class="empty-message">Unable to load shop status. Check backend.</p>`;
    }
}
function resetForm() {
    form.reset();
    recordIdInput.value = "";
    document.getElementById("inHour").value = "08";
    document.getElementById("inMinute").value = "00";
    document.getElementById("inPeriod").value = "AM";
    document.getElementById("outHour").value = "05";
    document.getElementById("outMinute").value = "00";
    document.getElementById("outPeriod").value = "PM";
    saveButton.textContent = "💾 Save Shop Information";
    cancelButton.hidden = true;
}

function editRecord(record) {
    recordIdInput.value = record.schedule_id;
    document.getElementById("scheduleDate").value = formatDate(record.schedule_date);
    document.getElementById("shopStatus").value = record.shop_status || "Open";
    document.getElementById("adminStatus").value = record.admin_status || "Available";
    document.getElementById("leaveDate").value = record.leave_date ? formatDate(record.leave_date) : "";
    document.getElementById("leaveReason").value = record.leave_reason || "";
    document.getElementById("nextAvailableDate").value = record.next_available_date ? formatDate(record.next_available_date) : "";

    setTimeFields("in", record.in_time);
    setTimeFields("out", record.out_time);

    saveButton.textContent = "💾 Update Shop Information";
    cancelButton.hidden = false;
    statusMessage.textContent = "Editing selected record.";
    statusMessage.style.color = "#1746a2";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const payload = {
        scheduleDate: document.getElementById("scheduleDate").value,
        shopStatus: document.getElementById("shopStatus").value,
        inTime: to24Hour(
            document.getElementById("inHour").value,
            document.getElementById("inMinute").value,
            document.getElementById("inPeriod").value
        ),
        outTime: to24Hour(
            document.getElementById("outHour").value,
            document.getElementById("outMinute").value,
            document.getElementById("outPeriod").value
        ),
        adminStatus: document.getElementById("adminStatus").value,
        leaveDate: document.getElementById("leaveDate").value || null,
        leaveReason: document.getElementById("leaveReason").value.trim() || null,
        nextAvailableDate: document.getElementById("nextAvailableDate").value || null
    };

    if (recordIdInput.value) payload.id = Number(recordIdInput.value);

    saveButton.disabled = true;

    try {
        const data = await apiRequest(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        statusMessage.textContent = data.message;
        statusMessage.style.color = "green";
        resetForm();
        await loadShopHistory();

    } catch (error) {
        statusMessage.textContent = error.message;
        statusMessage.style.color = "red";
    } finally {
        saveButton.disabled = false;
    }
});

cancelButton.addEventListener("click", () => {
    resetForm();
    statusMessage.textContent = "Edit cancelled.";
    statusMessage.style.color = "#555";
});

document.querySelector(".history-container").addEventListener("click", async event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const record = shopRecords.find(r =>
        Number(r.schedule_id) === id && Number(r.is_archived) === 0
    );

    if (!record) {
        historyMessage.textContent = "Active record not found. Refresh the page.";
        historyMessage.style.color = "red";
        return;
    }

    if (action === "edit") {
        editRecord(record);
        return;
    }

    if (action === "delete") {
        if (!confirm("Permanently delete this shop status? This cannot be undone.")) return;
        try {
            const data = await apiRequest(`${API_URL}/${id}`, { method: "DELETE" });
            historyMessage.textContent = data.message;
            historyMessage.style.color = "green";

            if (Number(recordIdInput.value) === id) resetForm();

            await loadShopHistory();

        } catch (error) {
            historyMessage.textContent = error.message;
            historyMessage.style.color = "red";
        }
    }
});

loadShopHistory();