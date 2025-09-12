// --- The Observer Fix ---
// We create an "observer" to watch for changes in the main content area.
const observer = new MutationObserver((mutationsList, observer) => {
  // This code runs every time the content inside <main id="content"> changes.

  const journalTextarea = document.getElementById("journal-textarea");

  // We check if the journal textarea has been added to the page.
  if (journalTextarea) {
    console.log("Journal HTML has been loaded! Initializing script...");
    // If it exists, we run our main journal logic.
    initializeJournal();
    // We then disconnect the observer since its job is done.
    observer.disconnect();
  }
});

// We tell the observer to watch the <main id="content"> element and all its children.
const contentArea = document.getElementById("content");
if (contentArea) {
  observer.observe(contentArea, { childList: true, subtree: true });
} else {
  console.error(
    "Critical error: The main #content area was not found. Journal script cannot run."
  );
}

// --- All of your original logic is now inside this function ---
function initializeJournal() {
  console.log("journal.js script initialized!");

  // --- Element Selection ---
  const journalTextarea = document.getElementById("journal-textarea");
  const entriesContainer = document.getElementById("journal-entries");
  // We can select the button directly now, because we know it exists.
  const saveBtn = document.getElementById("save-btn");

  // --- Crucial Debugging Check ---
  if (!saveBtn || !journalTextarea || !entriesContainer) {
    console.error(
      "Journal script error: One or more required HTML elements were not found post-initialization."
    );
    return;
  }

  // --- Function to load and display entries ---
  const loadEntries = () => {
    const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    console.log(`Found ${entries.length} entries in localStorage.`);

    entriesContainer.innerHTML = "";

    entries.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

    entries.forEach((entry) => {
      const entryDiv = document.createElement("div");
      entryDiv.className = "entry";

      const nameP = document.createElement("p");
      nameP.className = "entry-name";
      nameP.textContent = `From: ${entry.name || "Anonymous"}`;

      const dateP = document.createElement("p");
      dateP.className = "entry-date";
      dateP.textContent = entry.date;

      const textP = document.createElement("p");
      textP.className = "entry-text";
      textP.textContent = entry.text;

      entryDiv.appendChild(nameP);
      entryDiv.appendChild(dateP);
      entryDiv.appendChild(textP);
      entriesContainer.appendChild(entryDiv);
    });
  };

  // --- Function to save a new entry ---
  const saveEntry = () => {
    const text = journalTextarea.value.trim();

    if (text === "") {
      alert("Please write something in your journal.");
      return;
    }

    const name = prompt("Please enter your name:", "Anonymous");
    if (name === null) {
      return;
    }

    const now = new Date();
    const newEntry = {
      name: name,
      text: text,
      date: now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      rawDate: now.toISOString(),
    };

    const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    entries.push(newEntry);
    localStorage.setItem("journalEntries", JSON.stringify(entries));

    console.log("New entry saved!", newEntry);

    journalTextarea.value = "";
    loadEntries();
  };

  // --- Event Listener ---
  saveBtn.addEventListener("click", () => {
    console.log("Save button clicked!");
    saveEntry();
  });

  // --- Initial Load ---
  loadEntries();
}