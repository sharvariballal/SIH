document.addEventListener("DOMContentLoaded", () => {
  const circle = document.getElementById("breathingCircle");
  const text = document.getElementById("breathingText");
  const startBtn = document.getElementById("startBreathing");

  let breathingInterval;
  let isBreathing = false;
  let phase = 0; // 0=inhale, 1=hold, 2=exhale

  // Make circle scale smoothly
  circle.style.transition = "transform 3s ease-in-out";

  startBtn.addEventListener("click", () => {
    if (!isBreathing) {
      isBreathing = true;
      startBtn.textContent = "Stop";
      phase = 0; // reset phase every time we start

      // Start breathing immediately
      text.textContent = "Inhale...";
      circle.style.transform = "scale(1.5)";

      breathingInterval = setInterval(() => {
        if (phase === 0) {
          text.textContent = "Hold...";
          circle.style.transform = "scale(1.5)";
          phase = 1;
        } else if (phase === 1) {
          text.textContent = "Exhale...";
          circle.style.transform = "scale(1)";
          phase = 2;
        } else {
          text.textContent = "Inhale...";
          circle.style.transform = "scale(1.5)";
          phase = 0;
        }
      }, 3000); // 3 seconds per phase
    } else {
      // Stop breathing
      isBreathing = false;
      startBtn.textContent = "Start Breathing";
      clearInterval(breathingInterval);
      text.textContent = "Press Start to begin";
      circle.style.transform = "scale(1)";
    }
  });
});

