const STORAGE_KEY = "cloudwise-az900-progress-v1";
const topics = window.QUIZ_TOPICS;
const questions = window.QUIZ_QUESTIONS;

const elements = {
  overview: document.querySelector("#overview-view"),
  practice: document.querySelector("#practice-view"),
  breadcrumb: document.querySelector("#breadcrumb-current"),
  topicGrid: document.querySelector("#topic-grid"),
  topicSelect: document.querySelector("#topic-select"),
  questionCount: document.querySelector("#question-count"),
  setup: document.querySelector("#quiz-setup"),
  quiz: document.querySelector("#quiz-panel"),
  results: document.querySelector("#quiz-results"),
  prompt: document.querySelector("#question-prompt"),
  options: document.querySelector("#answer-options"),
  feedback: document.querySelector("#answer-feedback"),
  hint: document.querySelector("#answer-hint"),
  next: document.querySelector("#next-question"),
  progressLabel: document.querySelector("#quiz-progress-label"),
  progressPercent: document.querySelector("#quiz-progress-percent"),
  progressBar: document.querySelector("#quiz-progress-bar"),
  quizTopic: document.querySelector("#quiz-topic-label"),
};

let progress = loadProgress();
let round = [];
let roundIndex = 0;
let roundResults = [];
let answeredCurrent = false;

function loadProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      answered: Number.isFinite(stored.answered) ? stored.answered : 0,
      correct: Number.isFinite(stored.correct) ? stored.correct : 0,
      byTopic: stored.byTopic && typeof stored.byTopic === "object" ? stored.byTopic : {},
      questionResults: stored.questionResults && typeof stored.questionResults === "object" ? stored.questionResults : {},
    };
  } catch (error) {
    console.error("Could not load saved learning progress:", error);
    return { answered: 0, correct: 0, byTopic: {}, questionResults: {} };
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Could not save learning progress:", error);
    const indicator = document.querySelector("#progress-saved");
    indicator.innerHTML = "<span></span> Progress could not be saved";
    indicator.classList.add("save-error");
  }
}

function percentage(correct, answered) {
  return answered ? Math.round((correct / answered) * 100) : 0;
}

function renderTopics() {
  elements.topicGrid.innerHTML = topics.map((topic) => {
    const result = progress.byTopic[topic.id] || { answered: 0, correct: 0 };
    const score = percentage(result.correct, result.answered);
    const width = result.answered ? score : 0;
    return `
      <article class="topic-card ${topic.color}">
        <div class="topic-card-top">
          <span class="topic-icon" aria-hidden="true">${topic.icon}</span>
          <span class="topic-count">${questions.filter((question) => question.topic === topic.id).length} questions</span>
        </div>
        <h3>${topic.title}</h3>
        <p>${topic.description}</p>
        <div class="topic-progress-label"><span>${result.answered ? `${score}% accuracy` : "Not started yet"}</span><span>${result.answered} answered</span></div>
        <div class="topic-progress-track" aria-label="${result.answered ? `${score}% accuracy` : "No questions answered"}"><span style="width:${width}%"></span></div>
        <button class="topic-link" type="button" data-topic="${topic.id}">Practice this topic <span aria-hidden="true">→</span></button>
      </article>`;
  }).join("");
}

function renderStats() {
  document.querySelector("#stat-answered").textContent = progress.answered;
  document.querySelector("#stat-correct").innerHTML = `${percentage(progress.correct, progress.answered)}<span class="stat-unit">%</span>`;
  const readiness = document.querySelector("#stat-readiness");
  if (progress.answered < 5) {
    readiness.textContent = "Not rated yet";
  } else {
    const score = percentage(progress.correct, progress.answered);
    readiness.textContent = score >= 80 ? "Looking strong" : score >= 60 ? "Building steadily" : "Room to grow";
  }
  renderTopics();
}

function showView(view) {
  const isPractice = view === "practice";
  elements.overview.classList.toggle("hidden", isPractice);
  elements.practice.classList.toggle("hidden", !isPractice);
  elements.breadcrumb.textContent = isPractice ? "Practice quiz" : "Overview";
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openPractice(topic = "all") {
  showView("practice");
  resetPracticePanels();
  elements.topicSelect.value = topic;
}

function resetPracticePanels() {
  elements.setup.classList.remove("hidden");
  elements.quiz.classList.add("hidden");
  elements.results.classList.add("hidden");
}

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function beginRound() {
  const selectedTopic = elements.topicSelect.value;
  const available = questions.filter((question) => selectedTopic === "all" || question.topic === selectedTopic);
  const requestedCount = Number(elements.questionCount.value);
  round = shuffle(available).slice(0, requestedCount);
  roundIndex = 0;
  roundResults = [];
  elements.setup.classList.add("hidden");
  elements.results.classList.add("hidden");
  elements.quiz.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion() {
  const question = round[roundIndex];
  const topic = topics.find((item) => item.id === question.topic);
  answeredCurrent = false;
  elements.quizTopic.textContent = topic.shortTitle;
  elements.progressLabel.textContent = `Question ${roundIndex + 1} of ${round.length}`;
  elements.progressPercent.textContent = `${Math.round(((roundIndex + 1) / round.length) * 100)}%`;
  elements.progressBar.style.width = `${((roundIndex + 1) / round.length) * 100}%`;
  elements.prompt.textContent = question.prompt;
  elements.feedback.className = "answer-feedback hidden";
  elements.feedback.textContent = "";
  elements.hint.textContent = "Choose the best answer to see why.";
  elements.next.classList.add("hidden");
  elements.next.innerHTML = roundIndex === round.length - 1
    ? "See your results <span aria-hidden=\"true\">→</span>"
    : "Next question <span aria-hidden=\"true\">→</span>";
  elements.options.innerHTML = question.options.map((option, index) => `
    <button class="answer-option" type="button" data-answer="${index}">
      <span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span>
    </button>`).join("");
}

function answerQuestion(selectedIndex) {
  if (answeredCurrent) return;
  answeredCurrent = true;
  const question = round[roundIndex];
  const isCorrect = selectedIndex === question.answer;
  roundResults.push({ topic: question.topic, correct: isCorrect });
  progress.answered += 1;
  if (!progress.byTopic[question.topic]) progress.byTopic[question.topic] = { answered: 0, correct: 0 };
  progress.byTopic[question.topic].answered += 1;
  if (isCorrect) {
    progress.correct += 1;
    progress.byTopic[question.topic].correct += 1;
  }
  progress.questionResults[question.id] = {
    attempts: (progress.questionResults[question.id]?.attempts || 0) + 1,
    correct: isCorrect,
    lastAnswered: new Date().toISOString(),
  };
  saveProgress();
  renderStats();

  elements.options.querySelectorAll(".answer-option").forEach((option) => {
    const answerIndex = Number(option.dataset.answer);
    option.disabled = true;
    if (answerIndex === question.answer) option.classList.add("correct-option");
    if (answerIndex === selectedIndex && !isCorrect) option.classList.add("incorrect-option");
  });
  elements.feedback.className = `answer-feedback ${isCorrect ? "feedback-correct" : "feedback-incorrect"}`;
  elements.feedback.innerHTML = `<strong>${isCorrect ? "That's right — nice work!" : "Not quite — here's the idea."}</strong><span>${question.explanation}</span>`;
  elements.hint.textContent = isCorrect ? "You got it. Keep that momentum." : "Every miss is a clue about what to review next.";
  elements.next.classList.remove("hidden");
}

function finishRound() {
  elements.quiz.classList.add("hidden");
  elements.results.classList.remove("hidden");
  const correctCount = roundResults.filter((result) => result.correct).length;
  const score = percentage(correctCount, roundResults.length);
  document.querySelector("#results-score").textContent = `${score}%`;
  document.querySelector("#results-summary").textContent = `You got ${correctCount} out of ${roundResults.length} right. ${score >= 80 ? "That understanding is taking shape — keep the curiosity going." : "The explanations are yours to revisit — another round will make the ideas stick."}`;
  document.querySelector("#results-title").textContent = score >= 80 ? "Look at you, cloud thinker." : "Nice work. You showed up.";
  const totals = new Map();
  roundResults.forEach((result) => {
    const current = totals.get(result.topic) || { correct: 0, total: 0 };
    current.total += 1;
    if (result.correct) current.correct += 1;
    totals.set(result.topic, current);
  });
  document.querySelector("#results-topic-summary").innerHTML = [...totals.entries()].map(([topicId, result]) => {
    const topic = topics.find((item) => item.id === topicId);
    return `<div><span>${topic.shortTitle}</span><strong>${result.correct}/${result.total} correct</strong></div>`;
  }).join("");
  renderStats();
}

function nextQuestion() {
  if (roundIndex < round.length - 1) {
    roundIndex += 1;
    renderQuestion();
  } else {
    finishRound();
  }
}

function populateTopicSelect() {
  topics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic.id;
    option.textContent = topic.title;
    elements.topicSelect.append(option);
  });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.view) {
    showView(target.dataset.view);
    return;
  }
  if (target.dataset.topic) {
    openPractice(target.dataset.topic);
    return;
  }
  if (target.dataset.answer !== undefined) {
    answerQuestion(Number(target.dataset.answer));
    return;
  }
  switch (target.dataset.action) {
    case "start-quiz":
    case "all-topics":
      openPractice("all");
      break;
    case "begin-round":
      beginRound();
      break;
    case "next-question":
      nextQuestion();
      break;
    case "exit-quiz":
      resetPracticePanels();
      break;
    case "retry-round":
      beginRound();
      break;
    case "show-overview":
      showView("overview");
      break;
  }
});

populateTopicSelect();
renderStats();
