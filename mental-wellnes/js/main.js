// ===================================================================
// 1. DYNAMIC COMPONENT LOADER
// ===================================================================
async function loadComponent(containerId, file) {
  try {
    const response = await fetch(`/components/${file}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const content = await response.text();
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = content;
      window.scrollTo(0, 0); // Scroll to top after new content loads
    } else {
      console.error(`Container #${containerId} not found`);
    }
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
}

// ===================================================================
// 2. PAGE-SPECIFIC INITIALIZERS
// ===================================================================

// Initializer for the hero page button
function initHeroPageListeners() {
  const heroButton = document.getElementById('start-journey-btn');
  if (heroButton) {
    heroButton.addEventListener('click', () => {
      loadPage('features');
    });
  }
}

// Initializer for the dashboard page (charts, badges, buttons)
function initDashboardPage() {
    // --- Wellness Score ---
    const wellnessScore = 80;
    const wellnessCircle = document.getElementById('wellness-score-circle');
    const wellnessText = document.getElementById('wellness-score-text');
    if (wellnessCircle && wellnessText) {
        wellnessCircle.style.strokeDasharray = `${wellnessScore}, 100`;
        wellnessText.textContent = `${wellnessScore}%`;
    }

    // --- Quick Action Buttons ---
    const moodButton = document.getElementById('track-mood-btn');
    const phq9Button = document.getElementById('take-phq9-btn');
    if (moodButton) {
        moodButton.addEventListener('click', () => loadPage('moodtracker'));
    }
    if (phq9Button) {
        phq9Button.addEventListener('click', () => loadPage('phq9-test'));
    }

    // --- PHQ-9 Chart ---
    const phq9Ctx = document.getElementById('phq9Chart')?.getContext('2d');
    if (phq9Ctx) {
        new Chart(phq9Ctx, { type: 'line', data: { labels: ['May', 'June', 'July', 'Aug', 'Sept'], datasets: [{ label: 'PHQ-9 Score', data: [12, 9, 7, 8, 5], borderColor: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#3B82F6', pointRadius: 5 }] }, options: { responsive: true, scales: { y: { beginAtZero: true, max: 27, title: { display: true, text: 'Score' }}}, plugins: { legend: { display: false } } } });
    }

    // --- Mood Chart ---
    const moodCtx = document.getElementById('moodChart')?.getContext('2d');
    if (moodCtx) {
        new Chart(moodCtx, { type: 'bar', data: { labels: ['Happy', 'Calm', 'Okay', 'Anxious', 'Sad'], datasets: [{ label: 'Days', data: [3, 2, 1, 1, 0], backgroundColor: ['#10B981', '#60A5FA', '#FBBF24', '#F87171', '#9CA3AF'], borderRadius: 6 }] }, options: { responsive: true, indexAxis: 'y', scales: { x: { beginAtZero: true, title: { display: true, text: 'Number of Days' }}}, plugins: { legend: { display: false } } } });
    }
    
    // --- Sleep vs Stress Chart ---
    const sleepStressCtx = document.getElementById('sleepStressChart')?.getContext('2d');
    if (sleepStressCtx) {
        new Chart(sleepStressCtx, { type: 'bar', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [ { type: 'line', label: 'Stress Level (1-10)', data: [6, 7, 5, 4, 3, 5, 2], borderColor: '#EF4444', yAxisID: 'y1', tension: 0.3 }, { type: 'bar', label: 'Sleep (Hours)', data: [6.5, 6, 7.5, 8, 8.5, 7, 9], backgroundColor: '#3B82F6', yAxisID: 'y' } ] }, options: { responsive: true, scales: { y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Sleep (Hours)' }, max: 10 }, y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Stress Level (1-10)' }, max: 10, grid: { drawOnChartArea: false } } } } });
    }

    // --- Badges ---
    const badges = [ { name: 'Mindful Start', desc: 'Completed your first meditation session.', icon: '🧘', unlocked: true }, { name: 'Journalist', desc: 'Wrote in your journal for 3 days straight.', icon: '✍️', unlocked: true }, { name: 'Week Streak', desc: 'Completed check-ins for 7 days in a row.', icon: '🗓️', unlocked: true }, { name: 'Self-Reflector', desc: 'Completed 5 PHQ-9 tests.', icon: '🧠', unlocked: true }, { name: 'Mood Master', desc: 'Tracked your mood for a full month.', icon: '😄', unlocked: false }, { name: 'Community Pillar', desc: 'Made your first post in the community.', icon: '💬', unlocked: true } ];
    const badgesContainer = document.getElementById('badges-container');
    if(badgesContainer){
        badgesContainer.innerHTML = '';
        badges.forEach(badge => {
            badgesContainer.innerHTML += ` <div class="badge-container relative flex flex-col items-center"> <div class="text-5xl p-4 rounded-full ${badge.unlocked ? 'bg-green-100' : 'bg-gray-200'} ${badge.unlocked ? '' : 'grayscale'}">${badge.icon}</div> <p class="text-sm font-semibold mt-2 ${badge.unlocked ? 'text-gray-700' : 'text-gray-400'}">${badge.name}</p> <div class="badge-tooltip absolute bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded py-2 px-3 text-center z-10">${badge.desc}</div> </div> `;
        });
    }
}

// Initializer for the booking form
function attachBookingFormListener() {
  const form = document.getElementById("bookingForm");
  const confirmation = document.getElementById("confirmationMsg");
  if (form && confirmation) {
    form.addEventListener("submit", function(event) {
      event.preventDefault();
      confirmation.style.display = "block";
      form.reset();
    });
  }
}

// ===================================================================
// 3. MAIN PAGE ROUTER
// ===================================================================
async function loadPage(page) {
  updateActiveLink(page);

  const validPages = ["hero", "features", "about", "login", "ai_chat", "booking", "journal", "meditation", "dashboard", "resources", "community", "helpline", "moodtracker", "phq9-test"];
  let pageToLoad = validPages.includes(page) ? page : "hero";
  let fileName = `${pageToLoad}.html`;

  await loadComponent("content", fileName);

  // Run initializers for the just-loaded page
  switch (pageToLoad) {
    case "hero":
      initHeroPageListeners();
      break;
    case "dashboard":
      initDashboardPage();
      break;
    case "booking":
      attachBookingFormListener();
      break;
  }
}

// ===================================================================
// 4. UI HELPER FUNCTIONS
// ===================================================================
function updateActiveLink(currentPage) {
  const navLinks = document.querySelectorAll(".nav-menu .nav-link");
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("data-page") === currentPage) {
      link.classList.add("active");
    }
  });
}

function attachNavListeners() {
  // Mobile menu toggle
  const menuToggle = document.getElementById("mobile-menu");
  const navMenu = document.querySelector(".nav-menu");
  if (menuToggle && navMenu && !menuToggle.dataset.listenerAttached) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
    menuToggle.dataset.listenerAttached = "true";
  }

  // Navigation link clicks
  document.querySelectorAll("[data-page]").forEach((el) => {
    if (!el.dataset.listenerAttached) {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const page = el.getAttribute("data-page");
        loadPage(page);
        if (navMenu && navMenu.classList.contains("active")) {
          navMenu.classList.remove("active");
        }
      });
      el.dataset.listenerAttached = "true";
    }
  });
}

// ===================================================================
// 5. ONBOARDING & APP STARTUP
// ===================================================================
async function loadApp(startingPage) {
  await loadComponent("header", "header.html");
  await loadComponent("footer", "footer.html");
  attachNavListeners();
  loadPage(startingPage);
}

function initializeOnboarding() {
  const onboardingOverlay = document.getElementById('onboarding-overlay');
  const appContainer = document.getElementById('app-container');
  const roleCards = document.querySelectorAll('.role-card');

  if (!onboardingOverlay || !appContainer) {
    console.error("Onboarding or App container not found. Loading default student view.");
    appContainer.style.display = 'block';
    loadApp("hero");
    return;
  }

  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedRole = card.dataset.role;
      switch (selectedRole) {
        case 'student':
          onboardingOverlay.style.display = 'none';
          appContainer.style.display = 'block';
          loadApp("hero");
          break;
        case 'admin':
          window.location.href = 'admin.html';
          break;
        case 'counselor':
          window.location.href = 'counselor.html';
          break;
      }
    });
  });
}

// ===================================================================
// 6. SCRIPT ENTRY POINT
// ===================================================================
document.addEventListener("DOMContentLoaded", () => {
  initializeOnboarding();
});

