if (document.URL.includes("bulgarian.html")) {
  let originalData = null;

  document.addEventListener("DOMContentLoaded", function () {
    fetch("json/bulgarian.json")
      .then((response) => response.json())
      .then((data) => {
        originalData = data; // Store the original data
        createTable(data);
        setupShuffleButton();
      });
  });

  function createTable(data) {
    const tableContainer = document.getElementById("alphabet-table");
    tableContainer.innerHTML = ""; // Clear existing cells
    const cyrillic = data.cyrillic;
    const latin = data.latin;

    cyrillic.forEach((letter, index) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = letter;
      cell.dataset.original = letter;
      cell.dataset.latin = latin[index];

      cell.addEventListener("mouseenter", function () {
        this.textContent = this.dataset.latin;
      });

      cell.addEventListener("mouseleave", function () {
        this.textContent = this.dataset.original;
      });

      tableContainer.appendChild(cell);
    });
  }

  function setupShuffleButton() {
    const button = document.querySelector('[data-translate="random_letters"]');
    button.addEventListener("click", function () {
      if (!originalData) return;

      // Create a shuffled index array
      const indices = [...originalData.cyrillic.keys()];
      shuffleArray(indices);

      // Shuffle cyrillic and latin arrays using the same index order
      const shuffledCyrillic = indices.map((i) => originalData.cyrillic[i]);
      const shuffledLatin = indices.map((i) => originalData.latin[i]);

      // Re-render table
      createTable({
        cyrillic: shuffledCyrillic,
        latin: shuffledLatin,
      });
    });
  }

  // Fisher-Yates shuffle
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

if (document.URL.includes("bulgarian_test.html")) {
  let testData = null;
  let activeLayout = "latin";
  let currentIndex = 0;
  let timer = null;
  let remainingTime = 0;
  let stats = {
    total: 0,
    correct: 0,
    wrongAnswers: {},
  };
  let letterStartTime = 0; // timestamp when letter is shown
  let timings = []; // array of { letter, timeInMs }

  document.addEventListener("DOMContentLoaded", function () {
    fetch("json/bulgarian.json")
      .then((response) => response.json())
      .then((data) => {
        testData = data;
        setupTest();
      });
  });

  function setupTest() {
    document.querySelectorAll('input[name="layout"]').forEach((input) => {
      input.addEventListener("change", (e) => {
        activeLayout = e.target.value;
      });
    });

    document
      .getElementById("start-button")
      .addEventListener("click", startTest);
  }

  function startTest() {
    // Get selected duration (in minutes → seconds)
    const duration =
      parseInt(
        document.querySelector('input[name="duration"]:checked').value,
        10
      ) * 60;
    remainingTime = duration;

    // Reset stats
    stats = { total: 0, correct: 0, wrongAnswers: {} };

    // Hide setup UI and show quiz
    document.getElementById("settings").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("results").style.display = "none";
    document.getElementById("feedback").textContent = "";
    document.getElementById("user-input").value = "";

    // Start timer display + interval
    updateTimerDisplay();
    timer = setInterval(() => {
      remainingTime--;
      updateTimerDisplay();

      if (remainingTime <= 0) {
        clearInterval(timer);
        endTest();
      }
    }, 1000);

    document
      .getElementById("user-input")
      .addEventListener("input", handleInput);
    nextLetter();
    showInputInstructionIfMobile();
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (remainingTime % 60).toString().padStart(2, "0");
    document.getElementById("timer").textContent = `⏳ ${minutes}:${seconds}`;
  }

  function nextLetter() {
    const total = testData.cyrillic.length;
    currentIndex = Math.floor(Math.random() * total);

    const cyrillic = testData.cyrillic[currentIndex];
    const expected = testData[activeLayout][currentIndex];

    document.getElementById("cyrillic-letter").textContent = cyrillic;
    document.getElementById("typed-preview").textContent = "";

    const input = document.getElementById("user-input");
    input.value = "";
    input.disabled = false;

    setTimeout(() => input.focus(), 100);

    // 🚨 If expected is space, skip input and auto-advance
    if (expected === " ") {
      const feedback = document.getElementById("feedback");
      const spaceAutoAdvanceTranslation =
        translations[currentLanguage]["space-auto-advance"] ||
        "⏳ Space character - auto-advancing...";
      feedback.innerHTML = `<span style="color:orange" data-translate="space-auto-advance">${spaceAutoAdvanceTranslation}</span>`;

      setTimeout(() => {
        checkAnswer(" ", " ");
      }, 1000); // wait 1 second
    }

    letterStartTime = Date.now();
  }

  function handleInput(e) {
    const inputField = e.target;
    const input = inputField.value.trim().toUpperCase();

    document.getElementById("typed-preview").textContent = input;

    const expected = testData[activeLayout][currentIndex].toUpperCase();

    if (expected !== " " && input.length === expected.length) {
      checkAnswer(input, expected);
    }
  }

  function checkAnswer(input, expected) {
    stats.total++;
    const feedback = document.getElementById("feedback");
    // const shownInput = input === " " ? "[space]" : input;
    const shownExpected = expected === " " ? "[space]" : expected;

    const correctTranslation =
      translations[currentLanguage]["correct"] || "✔ Correct";
    const incorrectTranslation =
      translations[currentLanguage]["incorrect"] || "✖ Incorrect";

    if (input === expected) {
      stats.correct++;
      feedback.innerHTML = `<span style="color:limegreen" data-translate="correct">${correctTranslation} (${shownExpected})</span>`;
    } else {
      feedback.innerHTML = `<span style="color:red" data-translate="incorrect">${incorrectTranslation} (${shownExpected})</span>`;
      const letter = testData.cyrillic[currentIndex];
      stats.wrongAnswers[letter] = (stats.wrongAnswers[letter] || 0) + 1;
    }

    const timeTaken = Date.now() - letterStartTime;
    const currentLetter = testData.cyrillic[currentIndex];

    // 🚫 Skip space-only letters
    if (testData[activeLayout][currentIndex] !== " ") {
      timings.push({
        letter: currentLetter,
        time: timeTaken,
      });
    }

    setTimeout(() => {
      feedback.textContent = "";
      nextLetter();
    }, 800);
  }

  function endTest() {
    // Hide quiz container
    document.getElementById("quiz-container").style.display = "none";

    // Clear listener so Enter doesn't keep working
    document
      .getElementById("user-input")
      .removeEventListener("keydown", handleInput);

    const input = document.getElementById("user-input");
    input.disabled = true;

    // Calculate score
    const percentage = ((stats.correct / stats.total) * 100).toFixed(1);
    const resultsDiv = document.getElementById("results");

    // Build most missed letters
    let wrongStats = "";
    const sortedWrong = Object.entries(stats.wrongAnswers).sort(
      (a, b) => b[1] - a[1]
    );

    if (sortedWrong.length) {
      const mostMissedLettersTranslation =
        translations[currentLanguage]["most-missed-letters"] ||
        "Most Missed Letters:";
      wrongStats = `<h4 class="mt-3" data-translate="most-missed-letters">${mostMissedLettersTranslation}</h4><ul>`;
      for (const [char, count] of sortedWrong.slice(0, 5)) {
        wrongStats += `<li>${char} — ${count}×</li>`;
      }
      wrongStats += "</ul>";
    }

    // ⏱️ Analyze slow letters
    const avgTime =
      timings.reduce((sum, t) => sum + t.time, 0) / timings.length;

    const slowerThanAverage = timings
      .filter((t) => t.time > avgTime)
      .sort((a, b) => b.time - a.time)
      .slice(0, 5); // top 5 slowest

    let slowLettersHTML = "";
    if (slowerThanAverage.length > 0) {
      const lettersYouHesitatedOnTranslation =
        translations[currentLanguage]["letters-you-hesitated-on"] ||
        "Letters You Hesitated On:";
      slowLettersHTML = `<h4 class='mt-3' data-translate='letters-you-hesitated-on'>${lettersYouHesitatedOnTranslation}</h4><ul class='slow-letters'>`;
      slowerThanAverage.forEach((entry) => {
        slowLettersHTML += `<li>${entry.letter} — ${(entry.time / 1000).toFixed(
          2
        )}s</li>`;
      });
      slowLettersHTML += "</ul>";
    }

    // Show results
    const timeUpTranslation =
      translations[currentLanguage]["times-up"] || "✅ Time's Up!";
    const totalTranslation = translations[currentLanguage]["total"] || "Total:";
    const correctTranslation =
      translations[currentLanguage]["correct_result"] || "Correct:";
    const accuracyTranslation =
      translations[currentLanguage]["accuracy"] || "Accuracy:";
    const tryAgainTranslation =
      translations[currentLanguage]["try-again"] || "🔁 Try Again";

    resultsDiv.innerHTML = `
    <h3 class="text-success" data-translate="times-up">${timeUpTranslation}</h3>
    <p data-translate="total"><strong>${totalTranslation}</strong> ${stats.total}</p>
    <p data-translate="correct"><strong>${correctTranslation}</strong> ${stats.correct}</p>
    <p data-translate="accuracy"><strong>${accuracyTranslation}</strong> ${percentage}%</p>
    ${wrongStats}
    ${slowLettersHTML}
    <button class="btn btn-outline-light mt-3" onclick="location.reload()" data-translate="try-again">${tryAgainTranslation}</button>
  `;
    resultsDiv.style.display = "block";
  }

  function showInputInstructionIfMobile() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      document.getElementById("tap-instruction").classList.remove("d-none");
    }
  }
}
