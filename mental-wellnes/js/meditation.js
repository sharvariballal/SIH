// meditation.js
document.addEventListener("DOMContentLoaded", () => {
  (function () {
    const questions = [
      { text: "Little interest or pleasure in doing things?" },
      { text: "Feeling down, depressed, or hopeless?" },
      { text: "Trouble falling or staying asleep, or sleeping too much?" },
      { text: "Feeling tired or having little energy?" },
      { text: "Poor appetite or overeating?" },
      { text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?" },
      { text: "Trouble concentrating on things, such as reading or watching television?" },
      { text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?" },
      { text: "Thoughts that you would be better off dead, or of hurting yourself in some way?" }
    ];

    const options = [
      { text: "Not at all", value: 0 },
      { text: "Several days", value: 1 },
      { text: "More than half the days", value: 2 },
      { text: "Nearly every day", value: 3 }
    ];

    const analysisData = {
      '0-4': { title: 'Minimal Symptoms', positive: 'You are doing great.', suggestions: ['Maintain habits'], bgColor: 'bg-green-50', textColor: 'text-green-700' },
      '5-9': { title: 'Mild Symptoms', positive: 'Be aware of your mood.', suggestions: ['Prioritize well-being'], bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
      '10-14': { title: 'Moderate Symptoms', positive: 'Seek support.', suggestions: ['Routine helps'], bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
      '15-19': { title: 'Moderately Severe Symptoms', positive: 'Professional help is valuable.', suggestions: ['Focus on one small thing'], bgColor: 'bg-red-50', textColor: 'text-red-700' },
      '20-27': { title: 'Severe Symptoms', positive: 'Immediate help recommended.', suggestions: ['Safety plan'], bgColor: 'bg-pink-50', textColor: 'text-pink-700' }
    };

    let currentQuestionIndex = 0;
    let userAnswers = new Array(questions.length).fill(null);
    let chartInstance = null;

    const meditationSection = document.querySelector('.meditation');
    if (!meditationSection) return;

    const questionsView = meditationSection.querySelector('#questions-view');
    const resultsView = meditationSection.querySelector('#results-view');
    const analysisView = meditationSection.querySelector('#analysis-view');

    const questionNumberEl = meditationSection.querySelector('#question-number');
    const questionTextEl = meditationSection.querySelector('#question-text');
    const optionsContainerEl = meditationSection.querySelector('#options-container');
    const currentQIndicatorEl = meditationSection.querySelector('#current-q-indicator');

    const prevBtn = meditationSection.querySelector('#prev-btn');
    const nextBtn = meditationSection.querySelector('#next-btn');
    const viewAnalysisBtn = meditationSection.querySelector('#view-analysis-btn');
    const retakeBtn = meditationSection.querySelector('#retake-btn');

    function updateStepper(step) {
      meditationSection.querySelectorAll('.step').forEach((s, index) => {
        s.classList.remove('step-active');
        s.classList.add('text-gray-400', 'border-transparent');
        if ((index + 1) === step) {
          s.classList.add('step-active');
          s.classList.remove('text-gray-400', 'border-transparent');
        }
      });
    }

    function displayQuestion(index) {
  const question = questions[index];
  if (questionNumberEl) questionNumberEl.textContent = index + 1;
  if (questionTextEl) questionTextEl.textContent = question.text;
  if (currentQIndicatorEl) currentQIndicatorEl.textContent = index + 1;

  // Clear previous options
  optionsContainerEl.innerHTML = '';

  options.forEach(option => {
    const label = document.createElement('label');
    label.className = "radio-label flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-teal-400";

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.value = option.value;
    input.className = 'h-5 w-5 mr-3 accent-teal-500';
    if (userAnswers[index] === option.value) input.checked = true;

    const span = document.createElement('span');
    span.textContent = option.text;
    span.className = 'text-gray-700';

    label.appendChild(input);
    label.appendChild(span);
    optionsContainerEl.appendChild(label);

    input.addEventListener('change', (e) => {
      userAnswers[index] = parseInt(e.target.value);
      nextBtn.disabled = false;
      nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    });
  });

  prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
  nextBtn.textContent = index === questions.length - 1 ? 'See Results' : 'Next';

  if (userAnswers[index] === null) {
    nextBtn.disabled = true;
    nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    nextBtn.disabled = false;
    nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

    function calculateResults() {
      const totalScore = userAnswers.reduce((sum, val) => sum + (val !== null ? val : 0), 0);
      let category = '';
      let analysisKey = '';

      if (totalScore <= 4) { category = 'Minimal Depression'; analysisKey = '0-4'; }
      else if (totalScore <= 9) { category = 'Mild Depression'; analysisKey = '5-9'; }
      else if (totalScore <= 14) { category = 'Moderate Depression'; analysisKey = '10-14'; }
      else if (totalScore <= 19) { category = 'Moderately Severe Depression'; analysisKey = '15-19'; }
      else { category = 'Severe Depression'; analysisKey = '20-27'; }

      return { totalScore, category, analysisKey };
    }

    function showResults() {
      const { totalScore, category, analysisKey } = calculateResults();

      meditationSection.querySelector('#final-score').textContent = totalScore;
      meditationSection.querySelector('#score-category').textContent = category;

      const answerCounts = [0, 0, 0, 0];
      userAnswers.forEach(answer => {
        if (answer !== null) answerCounts[answer]++;
      });

      drawPieChart(answerCounts);
      prepareAnalysis(analysisKey);

      questionsView.classList.add('hidden');
      resultsView.classList.remove('hidden');
      updateStepper(2);
    }

    function drawPieChart(data) {
      const ctx = meditationSection.querySelector('#results-chart').getContext('2d');
      if (chartInstance) {
        chartInstance.destroy();
      }
      chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
          datasets: [{
            label: 'Answer Distribution',
            data: data,
            backgroundColor: ['#a7f3d0', '#fde68a', '#fda4af', '#f0abfc'],
            borderColor: ['#34d399', '#fcd34d', '#f43f5e', '#e879f9'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'top' }, title: { display: true, text: 'Your Answer Distribution' } }
        }
      });
    }

    function prepareAnalysis(key) {
      const data = analysisData[key];
      const contentEl = meditationSection.querySelector('#analysis-content');
      contentEl.innerHTML = `
        <div class="${data.bgColor} p-6 rounded-lg">
          <h3 class="text-xl font-bold ${data.textColor}">${data.title}</h3>
          <p class="mt-2 text-gray-700">💖 <strong>Positive Feature:</strong> ${data.positive}</p>
          <div class="mt-4 text-left space-y-2">
            <h4 class="font-semibold text-gray-800">🌿 Gentle Suggestions:</h4>
            <ul class="list-disc list-inside text-gray-600 space-y-1">
              ${data.suggestions.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    function resetTest() {
      currentQuestionIndex = 0;
      userAnswers.fill(null);
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      analysisView.classList.add('hidden');
      resultsView.classList.add('hidden');
      questionsView.classList.remove('hidden');
      updateStepper(1);
      displayQuestion(0);
    }

    nextBtn.addEventListener('click', () => {
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
      } else {
        showResults();
      }
    });

    prevBtn.addEventListener('click', () => {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
      }
    });

    viewAnalysisBtn.addEventListener('click', () => {
      resultsView.classList.add('hidden');
      analysisView.classList.remove('hidden');
      updateStepper(3);
    });

    retakeBtn.addEventListener('click', resetTest);

    // Init
    displayQuestion(0);
    updateStepper(1);
  })();
});
