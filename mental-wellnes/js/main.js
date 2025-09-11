// Load component into container
async function loadComponent(containerId, file) {
  try {
    console.log(`Fetching /components/${file} into #${containerId}...`);
    const response = await fetch(`/components/${file}`);
    console.log("Response status:", response.status);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const content = await response.text();
    const container = document.getElementById(containerId);

    if (!container) {
      throw new Error(`Container #${containerId} not found in DOM`);
    }

    // 1. Update the page content
    container.innerHTML = content;

    // 2. Scroll to the top of the page AFTER content is loaded
    window.scrollTo(0, 0);

    console.log(`${file} loaded successfully into #${containerId}`);

    // Re-attach listeners for any new elements that were just loaded
    attachNavListeners();
  
    // If the booking page was loaded, attach its specific form listener
    if (file === "booking.html") {
      attachBookingFormListener();
    }

  } catch (error) {
    console.error(`Error loading ${file}:`, error);
    const fallback = document.getElementById(containerId);
    if (fallback) fallback.innerHTML = `<p>Error loading ${file}</p>`;
  }
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



// Attach listeners for nav + mobile menu

function attachNavListeners() {

  // Navigation links

  document.querySelectorAll("[data-page]").forEach((el) => {

    el.addEventListener("click", (e) => {

      e.preventDefault();

      const page = el.getAttribute("data-page");

      loadPage(page);

    });

  });



  // Mobile menu toggle (inside header.html)

  const menuToggle = document.getElementById("mobile-menu");

  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

      navMenu.classList.toggle("active");

    });

  }



  // Highlight active nav link

  const currentURL = window.location.href;

  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {

    if (link.href === currentURL) {

      link.classList.add("active");

    }

  });

}

function attachBookingFormListener() {
  const form = document.getElementById("bookingForm");
  const confirmation = document.getElementById("confirmationMsg");

  if (form && confirmation) {
    console.log("Attaching listener to the booking form..."); // Debugging message
    form.addEventListener("submit", function(event) {
      event.preventDefault(); // Stop page reload
      console.log("Form submission prevented!"); // Debugging message
      
      confirmation.style.display = "block"; // Show confirmation
      form.reset(); // Clear form
    });
  } else {
    console.log("Booking form or confirmation message not found."); // Debugging message
  }
}

// Load header, footer, and default page on startup
document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "header.html");
  loadComponent("footer", "footer.html");
  loadPage("hero");
});


