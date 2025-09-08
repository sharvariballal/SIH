// js/mood.js
(function(){
  // safe localStorage JSON parse
  function safeParse(key) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      console.warn('Corrupted localStorage for', key, '— clearing it.');
      localStorage.removeItem(key);
      return null;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('moodChart');
    if (!canvas) {
      console.error('moodChart canvas not found. Make sure <canvas id="moodChart"> exists in HTML.');
      return;
    }
    const ctx = canvas.getContext('2d');

    // Load or create safe mood data
    let stored = safeParse('moodData');
    if (!stored || !stored.datasets) {
      stored = {
        labels: ["😁","😌","😐","😢","😠","😴"],
        datasets: [{
          label: "Mood Count",
          data: [0,0,0,0,0,0],
          backgroundColor: ["#34d399","#60a5fa","#fbbf24","#f87171","#ef4444","#a78bfa"],
          borderRadius: 8
        }]
      };
    }

    let moodChart;
    try {
      moodChart = new Chart(ctx, {
        type: "bar",
        data: stored,
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: false } }
        }
      });
      window._moodChart = moodChart; // for debugging in console
      console.log('Mood chart initialized', Chart && Chart.version);
    } catch (err) {
      console.error('Chart initialization failed:', err);
      return;
    }

    // Attach handlers safely
    const buttons = document.querySelectorAll(".mood-emojis button");
    if (!buttons || buttons.length === 0) {
      console.warn('No mood buttons found.');
    }
    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        // ensure data array exists
        if (!stored.datasets || !stored.datasets[0] || !Array.isArray(stored.datasets[0].data)) {
          stored.datasets = [{
            data: [0,0,0,0,0,0],
            backgroundColor: ["#34d399","#60a5fa","#fbbf24","#f87171","#ef4444","#a78bfa"]
          }];
        }
        stored.datasets[0].data[index] = (stored.datasets[0].data[index] || 0) + 1;
        moodChart.data = stored;
        moodChart.update();

        localStorage.setItem('moodData', JSON.stringify(stored));
        const moods = ["Happy 😁","Calm 😌","Neutral 😐","Sad 😢","Angry 😠","Sleepy 😴"];
        const insightEl = document.getElementById('insight');
if (insightEl) {
  // Mood-specific advice
  const moodTips = {
    "Happy 😁": "Keep spreading positivity ✨. Maybe write down 3 things you're grateful for today.",
    "Calm 😌": "Stay mindful 🌿. A short meditation can help keep this balance.",
    "Neutral 😐": "How about a quick stretch or walk 🚶 to uplift your mood?",
    "Sad 😢": "It’s okay to feel down 💙. Try the breathing exercise or call a friend.",
    "Angry 😠": "Take a deep breath 😮‍💨. A 2-minute meditation may help.",
    "Sleepy 😴": "Listen to a calming track 🎶 or take a power nap if possible."
  };

  // Mood clicked
  const currentMood = moods[index];
  const totalCount = stored.datasets[0].data[index]; // how many times this mood clicked

  insightEl.innerHTML = `
    <strong>You are feeling ${currentMood} today 🌸</strong><br>
    Count so far: <b>${totalCount}</b><br>
    Tip: ${moodTips[currentMood]}
  `;
}

      });
    });
  });
})();
