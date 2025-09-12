// ===================================================================
// 1. DYNAMIC COMPONENT LOADER (Unchanged)
// ===================================================================
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
    if (fallback) fallback.innerHTML = `<p>Error loading content.</p>`;
  }
}

// ===================================================================
// 2. PAGE ROUTER (Modified)
//    - Added routes for admin and counselor dashboards.
// ===================================================================
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
    
    // START: NEW ROUTES FOR ROLES
    case "admin-dashboard":
      loadComponent("content", "admin-dashboard.html"); // Loads the admin view
      break;
    case "counselor-dashboard":
      loadComponent("content", "counselor-dashboard.html"); // Loads the counselor view
      break;
    // END: NEW ROUTES FOR ROLES
      
    default:
      loadComponent("content", "hero.html"); // Default page for students
  }
}

// ===================================================================
// 3. EVENT LISTENERS (Unchanged)
// ===================================================================
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
    console.log("Attaching listener to the booking form...");
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      console.log("Form submission prevented!");
      
      confirmation.style.display = "block";
      form.reset();
    });
  } else {
    console.log("Booking form or confirmation message not found.");
  }
}

// ===================================================================
// 4. ONBOARDING LOGIC (New)
//    - This function handles the role selection and starts the app.
// ===================================================================
function initializeOnboarding() {
  const onboardingOverlay = document.getElementById('onboarding-overlay');
  const appContainer = document.getElementById('app-container');
  const roleCards = document.querySelectorAll('.role-card');

  // If the onboarding screen doesn't exist, just load the app normally
  if (!onboardingOverlay) {
      console.error("Onboarding overlay not found. Loading default content.");
      loadApp("hero"); // Default to student view
      return;
  }

  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedRole = card.dataset.role;
      console.log(`Role selected: ${selectedRole}`);

      // Hide onboarding and show the main app container
      onboardingOverlay.style.display = 'none';
      appContainer.style.display = 'block';

      // Load the app with the correct starting page based on the role
      // NEW & CORRECTED LOGIC
// ... inside the roleCards.forEach loop
switch (selectedRole) {
    case 'student':
        // If student, hide the overlay and load the student SPA here
        onboardingOverlay.style.display = 'none';
        appContainer.style.display = 'block';
        loadApp("hero"); // 'loadApp' is your function that loads header/footer/content
        break;

    case 'admin':
        // If admin, redirect to the completely separate admin page
        window.location.href = 'admin.html';
        break;

    case 'counselor':
    // Redirect to the completely separate counselor page
    window.location.href = 'counselor.html';
    break;
}
    });
  });
}

// ===================================================================
// 5. MAIN APP LOADER (New)
//    - Loads the essential components (header/footer) and the first page.
// ===================================================================
function loadApp(startingPage) {
    // First, load the shared components like header and footer
    loadComponent("header", "header.html");
    loadComponent("footer", "footer.html");
    // Then, load the specific starting page based on the role
    loadPage(startingPage);
}

// ===================================================================
// 6. INITIALIZATION (Modified)
//    - The page now starts by running the onboarding logic instead of
//      immediately loading the student content.
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
  initializeOnboarding();
});