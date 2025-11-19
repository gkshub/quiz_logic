// quiz-logic.js

// Map of all data chunks and their loading status
const dataChunks = [
    { url: 'https://gkshub.github.io/quiz_logic/python/python_quiz_data_02.js', loaded: false, variable: 'quizData_2' },
    // ... add more chunks
];

// The master quiz array starts with the first chunk
let quizData = quizData_1; // Assumes data-q1-50.js was loaded first

let currentQuestion = 0;
let answered = false;
let currentChunkIndex = 0;
const QUESTIONS_PER_CHUNK = 4;

// Function to handle dynamic loading
function loadNextChunk() {
    const chunkInfo = dataChunks[currentChunkIndex];
    if (!chunkInfo || chunkInfo.loaded) return; // Stop if no more chunks or already loaded

    const script = document.createElement('script');
    script.src = chunkInfo.url;
    
    // Set up a function to run once the script is loaded
    script.onload = () => {
        chunkInfo.loaded = true;
        // Append the newly loaded data to the master quizData array
        quizData = quizData.concat(window[chunkInfo.variable]);
        console.log(`Chunk ${chunkInfo.variable} loaded. Total questions: ${quizData.length}`);
    };

    document.head.appendChild(script);
}

function loadQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    const qData = quizData[currentQuestion];

    // Check if we are near the end of the loaded data (e.g., 5 questions remaining)
    if (currentQuestion >= quizData.length - 5 && currentChunkIndex < dataChunks.length) {
        currentChunkIndex++;
        loadNextChunk();
    }

    let html = `
        <h3>Question ${currentQuestion + 1} of ${quizData.length}</h3>
        <p class="question-text">${qData.question}</p>
        <div class="options-container">
    `;

    qData.options.forEach((option, index) => {
        // Escape quotes in the value attribute, but keep the option content as is
        html += `
            <label class="option-label">
                <input type="radio" name="answer" value="${option.replace(/"/g, '&quot;')}" ${answered ? 'disabled' : ''}>
                ${option}
            </label><br>
        `;
    });

    html += `
        </div>
        <button class="check-btn" onclick="checkAnswer()" ${answered ? 'disabled' : ''}>Check Answer</button>
        <div id="feedback" class="feedback-box" style="display:none;"></div>
    `;

    quizContainer.innerHTML = html;
    updateNavigationButtons();

    // Initialize highlighting after content is loaded
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    const feedbackBox = document.getElementById('feedback');
    const qData = quizData[currentQuestion];

    if (!selectedOption) {
        feedbackBox.style.display = 'block';
        feedbackBox.className = 'feedback-box incorrect';
        feedbackBox.innerHTML = "<h4>❌ Please select an option!</h4>";
        return;
    }

    // Un-escape quotes for comparison
    const userAnswer = selectedOption.value.replace(/&quot;/g, '"');
    answered = true;

    document.querySelectorAll('input[name="answer"]').forEach(radio => radio.disabled = true);
    document.querySelector('.check-btn').disabled = true;

    if (userAnswer === qData.answer) {
        feedbackBox.className = 'feedback-box correct';
        feedbackBox.innerHTML = `<h4>✅ Correct!</h4><p>${qData.explanation}</p>`;
    } else {
        feedbackBox.className = 'feedback-box incorrect';
        feedbackBox.innerHTML = `<h4>❌ Incorrect.</h4><p>The correct answer is **${qData.answer.replace(/<[^>]*>?/gm, '')}**.</p><p>Explanation: ${qData.explanation}</p>`;
    }

    feedbackBox.style.display = 'block';
    updateNavigationButtons();
}

function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        answered = false;
        loadQuestion();
    } else if (currentQuestion === quizData.length - 1 && document.getElementById('quiz-complete-message').style.display === 'none') {
        // Show completion message on the last page only after checking
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('quiz-complete-message').style.display = 'block';
        document.getElementById('prev-btn').style.display = 'none';
        document.getElementById('next-btn').style.display = 'none';
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        answered = false;
        loadQuestion();
        // Hide completion message if going back from the end
        document.getElementById('quiz-container').style.display = 'block';
        document.getElementById('quiz-complete-message').style.display = 'none';
    }
}

function updateNavigationButtons() {
    document.getElementById('prev-btn').disabled = currentQuestion === 0;

    const nextBtn = document.getElementById('next-btn');
    if (currentQuestion === quizData.length - 1) {
        nextBtn.innerHTML = 'Finish Quiz';
        nextBtn.onclick = nextQuestion; // Reuse nextQuestion to show completion message
    } else {
        nextBtn.innerHTML = 'Next →';
        nextBtn.onclick = nextQuestion;
    }
}

// Start the quiz when the page loads
loadQuestion();