// Load component
async function loadComponent(containerId, file) {
  const response = await fetch(`components/${file}`);
  const content = await response.text();
  document.getElementById(containerId).innerHTML = content;

  // Re-attach navigation after loading
  attachNavListeners();
}

// Handle page routing
function loadPage(page) {
  switch (page) {
    case "hero":
      loadComponent("content", "hero.html");
      break;
    case "features":
      loadComponent("content", "features.html");
      break;
    case "about":
      loadComponent("content", "about.html");
      break;
    case "login":
      loadComponent("content", "login.html");
      break;
    case "ai_chat":
      loadComponent("content", "ai_chat.html");
      break;
    case "booking":
      loadComponent("content", "booking.html");
      break;
    case "journal":
      loadComponent("content", "journal.html");
      break;
    case "meditation":
      loadComponent("content", "meditation.html");
      break;
    case "dashboard":
      loadComponent("content", "dashboard.html");
      break;
    case "resources":
      loadComponent("content", "resources.html");
      break;
    case "community":
      loadComponent("content", "community.html");
      break;
    case "helpline":
      loadComponent("content", "helpline.html");
      break;
    default:
      loadComponent("content", "hero.html");
  }
}

// Attach listeners for nav + feature cards
function attachNavListeners() {
  document.querySelectorAll("[data-page]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const page = el.getAttribute("data-page");
      loadPage(page);
    });
  });
}

// Load header, footer, and default page
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "header.html");
  loadComponent("footer", "footer.html");
  loadPage("hero");
});
