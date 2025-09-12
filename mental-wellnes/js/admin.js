// This script is ONLY for the admin.html page

// Reusable function to load components
async function loadAdminComponent(containerId, file) {
    try {
        const response = await fetch(`/components/${file}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const content = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = content;
        }
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
    }
}

// When the admin page loads, fetch the dashboard
document.addEventListener("DOMContentLoaded", () => {
    // For now, we are just loading the dashboard.
    // You could also load an admin-specific header or navigation bar.
    loadAdminComponent("admin-content", "admin-dashboard.html");
});