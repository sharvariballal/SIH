// This script is ONLY for the counselor.html page

// Reusable function to load components for the counselor portal
async function loadCounselorComponent(containerId, file) {
    try {
        const response = await fetch(`/components/${file}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = content;
        } else {
            console.error(`Container #${containerId} not found.`);
        }
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
    }
}

// When the counselor page loads, fetch the dashboard component
document.addEventListener("DOMContentLoaded", () => {
    // This loads the main dashboard into the <main> tag
    loadCounselorComponent("counselor-content", "counselor-dashboard.html");
    
    // You could also load a counselor-specific header here if you create one
    // loadCounselorComponent("counselor-header", "counselor-header.html");
});