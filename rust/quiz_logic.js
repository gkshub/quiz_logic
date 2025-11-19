// quiz-logic.js

// Map of all data chunks and their loading status
const dataChunks = [
    { url: 'https://gkshub.github.io/quiz_logic/python/python_quiz_data_02.js', loaded: false, variable: 'quizData_2' },
    // ... add more chunks
];

// Define variables globally, but don't initialize quizData yet
let quizData; 
let currentQuestion = 0;
let answered = false;
let currentChunkIndex = 0;
const QUESTIONS_PER_CHUNK = 4;

// NEW function to be called from the data file
function startQuiz() {
    // This runs ONLY AFTER the data script has finished defining quizData_1
    if (typeof quizData_1 === 'undefined') {
        // Fallback for debugging
        document.getElementById('quiz-container').innerHTML = "Error: Initial quiz data (quizData_1) not found.";
        console.error("Initialization Error: 'quizData_1' is not defined.");
        return;
    }
    
    // Initialize the master quiz array
    quizData = quizData_1; 
    
    // Now that data is guaranteed to be loaded, start the quiz
    loadQuestion();
}

// Function to handle dynamic loading for a specific index
function loadNextChunk(indexToLoad) {
    const chunkInfo = dataChunks[indexToLoad];
    
    // Check if the chunk exists or if it's already been loaded
    if (!chunkInfo || chunkInfo.loaded) {
        return false; // Load not initiated
    } 

    console.log(`Attempting to load chunk at index ${indexToLoad}: ${chunkInfo.url}`);

    const script = document.createElement('script');
    script.src = chunkInfo.url;
    
    // Set up a function to run once the script is loaded
    script.onload = () => {
        chunkInfo.loaded = true;
        // Append the newly loaded data to the master quizData array
        quizData = quizData.concat(window[chunkInfo.variable]);
        console.log(`Chunk ${chunkInfo.variable} loaded. Total questions: ${quizData.length}`);
        
        // After a successful load, reload the current question to update the 
        // "Question X of Y" count immediately, if the user is near the end.
        // Or, simply ensure loadQuestion() is called when the user advances.
        
        // Since loadQuestion() is triggered by user navigation, we usually don't need 
        // to re-render here, but the updated length will be available for the next call.
        
        // If the load was asynchronous, and the user is sitting on the second-to-last
        // question, they might want to see the updated count.
        if (currentQuestion >= quizData.length - 1) {
             // If the user is on the last question of the old set, re-render to update the count
             loadQuestion();
        }
    };
    
    // Handle error case (optional but recommended)
    script.onerror = () => {
        console.error(`Failed to load chunk: ${chunkInfo.url}`);
    };

    document.head.appendChild(script);
    return true; // Load initiated
}

function loadQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    const qData = quizData[currentQuestion];
    
    // 1. DYNAMIC LOADING LOGIC:
    // Check if we are near the end of the loaded data (e.g., 5 questions remaining)
    // AND we haven't processed all defined chunks in dataChunks.
    if (currentQuestion >= quizData.length - 5 && currentChunkIndex < dataChunks.length) {
        
        // Attempt to load the chunk at the current index (currentChunkIndex)
        const loadInitiated = loadNextChunk(currentChunkIndex);
        
        // IMPORTANT: Only advance the index if the load was successfully started
        // (i.e., the chunk existed and wasn't already loaded).
        if (loadInitiated) {
            currentChunkIndex++;
            console.log(`Next chunk index set to: ${currentChunkIndex}`);
        }
    }

    // 2. RENDERING LOGIC:
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
    } else if (currentQuestion === quizData.length - 1 && answered) { // Ensure they checked the last answer
        // Show completion message on the last page only after checking
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('quiz-complete-message').style.display = 'block';
        document.getElementById('prev-btn').style.display = 'none';
        document.getElementById('next-btn').style.display = 'none';
    } else if (currentQuestion === quizData.length - 1 && !answered) {
        // If on the last question and not answered, do nothing or prompt checkAnswer
        // This case is typically handled by the 'Check Answer' button being available.
        return; 
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
        
        // Re-show navigation buttons if they were hidden by the completion message
        document.getElementById('prev-btn').style.display = 'inline-block';
        document.getElementById('next-btn').style.display = 'inline-block';
    }
}

function updateNavigationButtons() {
    document.getElementById('prev-btn').disabled = currentQuestion === 0;

    const nextBtn = document.getElementById('next-btn');
    if (currentQuestion === quizData.length - 1) {
        nextBtn.innerHTML = 'Finish Quiz';
        // Note: nextQuestion logic handles showing the completion message
        nextBtn.onclick = nextQuestion; 
        
        // If the last question is not answered, disable 'Finish Quiz'
        if (!answered) {
            nextBtn.disabled = true;
        } else {
            nextBtn.disabled = false;
        }

    } else {
        nextBtn.innerHTML = 'Next →';
        nextBtn.onclick = nextQuestion;
        nextBtn.disabled = !answered; // Must answer before going to the next question
    }
}

// Start the quiz only after the entire page and all deferred scripts are ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if the initial data variable exists before starting the quiz
    if (typeof quizData_1 === 'undefined') {
        console.error("Initialization Error: 'quizData_1' is not defined. Check your python_quiz_data.js file.");
        document.getElementById('quiz-container').innerHTML = "Error: Initial quiz data not found.";
        return;
    }
});