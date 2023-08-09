const startButton = document.getElementById('start-button');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const answerElement = document.getElementById('answer');
const timerElement = document.getElementById('timer');
const explanationElement = document.getElementById('explanation-container');
const quizContainer = document.getElementById('quiz-container');
let parsedQuestions = [];
let currentQuestionIndex = 0;
let timerInterval;

startButton.addEventListener('click', startQuiz);

function startQuiz() {
    const mcqInput = document.getElementById('mcq-input');
    const mcqData = mcqInput.value.trim();
    parsedQuestions = parseMCQData(mcqData);

    if (parsedQuestions.length > 0) {
        startButton.style.display = 'none';
        mcqInput.style.display = 'none'; // Hide the text box
        quizContainer.style.display = 'block';
        showQuestion();
    }
}

function parseMCQData(mcqData) {
    const questions = mcqData.split(/\d+\.\s/).filter(q => q.trim() !== '');
    return questions.map(question => {
        const optionsAndAnswer = question.split(/Answer:\s*/);
        const options = optionsAndAnswer[0].split('\n').filter(o => o.trim() !== '');
        let answer = optionsAndAnswer[1].trim();
        let explanation = '';

        // Check if explanation exists in the answer
        const explanationMatch = answer.match(/Explanation:(.*?)(?=\s*$)/s);
        if (explanationMatch) {
            answer = answer.replace(explanationMatch[0], '').trim();
            explanation = explanationMatch[1].trim();
        }

        return {
            question: options[0],
            options: options.slice(1),
            answer,
            explanation,
        };
    });
}


// ... Your existing code ...

function showQuestion() {
  const currentQuestion = parsedQuestions[currentQuestionIndex];
  const { question, options } = currentQuestion;

  // Show the question element before displaying the question
  questionElement.style.display = 'block';

  // Clear and configure the options container
  optionsContainer.innerHTML = '';
  optionsContainer.style.display = 'grid';
  optionsContainer.style.gridTemplateColumns = '1fr'; // Display options in two columns

  // Initialize the question index and text
  let questionIndex = 0;
  let questionText = '';

  // Function to display the question text character by character
  function displayQuestionText() {
    // Add the next character to the question text
    questionText += question[questionIndex];

    // Display the current question text
    questionElement.textContent = `${questionText}`;

    // Increment the question index
    questionIndex++;

    // Check if all characters have been displayed
    if (questionIndex >= question.length) {
      clearInterval(questionTimer);

      // Delay before displaying the first option
      setTimeout(() => {
        // Loop through each option with a time delay
        options.forEach((option, index) => {
          setTimeout(() => {
            const optionContainer = document.createElement('div');
            optionContainer.classList.add('option-container');

            const optionElement = document.createElement('p');
            optionElement.textContent = option;
            optionContainer.appendChild(optionElement);

            optionsContainer.appendChild(optionContainer);

            // Show the timer and related elements after displaying all the options
            if (index === options.length - 1) {
              setTimeout(() => {
                startTimer();
              }, 2000); // Wait 2 seconds after the last option is displayed
            }
          }, index * 1500); // Time difference of 1.5 seconds (1500 milliseconds)
        });
      }, 2000); // Wait 2 seconds after the question is displayed
    }
  }

  // Show the question element and start a timer to display the question character by character
  questionElement.style.display = 'block';
  const questionTimer = setInterval(displayQuestionText, 80); // Delay between each character (adjust as needed)

  answerElement.textContent = ''; // Clear the answer
  explanationElement.textContent = ''; // Clear the explanation
  timerElement.style.display = 'none'; // Hide the timer element
}

function startTimer() {
  timerElement.style.display = 'block'; // Display the timer element
  timerElement.textContent = '05';
  let timeLeft = 5; // 5 seconds timer
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft.toString().padStart(2, '0');
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      showAnswer();
    }
  }, 1000);
}

function showAnswer() {
  const currentQuestion = parsedQuestions[currentQuestionIndex];
  const { question, options, answer, explanation } = currentQuestion;

  // Display the question and options
  questionElement.textContent = `${question}`;
  optionsContainer.innerHTML = '';
  optionsContainer.style.display = 'grid';
  optionsContainer.style.gridTemplateColumns = '1fr'; // Display options in two columns

  // Create option elements and add them to the options container
  options.forEach(option => {
    const optionContainer = document.createElement('div');
    optionContainer.classList.add('option-container');

    const optionElement = document.createElement('p');
    optionElement.textContent = option;
    optionContainer.appendChild(optionElement);

    optionsContainer.appendChild(optionContainer);
  });

  // Hide the timer
  timerElement.style.display = 'none';

  // Display the original answer below the options
  answerElement.textContent = `Answer: ${answer}`;
  answerElement.style.marginTop = '20px'; // Adjust the margin as needed
  answerElement.style.display = 'block';

  // Delay for 4 seconds after the timer is over
  setTimeout(() => {
    // Hide the question, options, and original answer
    questionElement.style.display = 'none';
    optionsContainer.style.display = 'none';
    answerElement.style.display = 'none';

    // Check if an explanation is provided and show it
    if (explanation) {
      showExplanation(explanation);
    } else {
      // No explanation provided, proceed to the next question immediately
      nextQuestion();
    }
  }, 4000); // 4000 milliseconds = 4 seconds (delay before showing the explanation or proceeding to the next question)
}



function showExplanation(explanation) {
  // Display the explanation character by character
  explanationElement.textContent = ''; // Clear the existing text
  explanationElement.style.display = 'block';
  explanationElement.style.fontSize = '5vw'; // Set the initial font size for explanation
  explanationElement.style.color = '#FFFFFF'; // Explicitly set the text color to white

  let explanationIndex = 0;
  const explanationText = `Explanation: ${explanation}`;
  const explanationTimer = setInterval(() => {
    explanationElement.textContent += explanationText[explanationIndex];
    explanationIndex++;

    // Check if all characters have been displayed
    if (explanationIndex >= explanationText.length) {
      clearInterval(explanationTimer);

      // Delay for 6 seconds after showing the explanation before proceeding to the next question
      setTimeout(() => {
        explanationElement.style.display = 'none'; // Hide the explanation
        nextQuestion();
      }, 6000); // 6000 milliseconds = 6 seconds (delay before proceeding to the next question)
    }
  }, 80); // Delay between each character (adjust as needed)
}



function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < parsedQuestions.length) {
    showQuestion();
  } else {
    // Quiz ended
    questionElement.textContent = 'Thank you!...';
    optionsContainer.innerHTML = '';
    answerElement.textContent = '';
    explanationElement.textContent = '';
    timerElement.textContent = '';

    questionElement.style.display = 'flex';
    questionElement.style.alignItems = 'center';
    questionElement.style.justifyContent = 'center';
    questionElement.style.fontSize = '8vw'; // Adjust the font size as per your preference

    // Create a new element for the support and subscribe message
    const supportMessageElement = document.createElement('p');
    supportMessageElement.textContent = 'Please support and subscribe';
    supportMessageElement.style.fontSize = '6vw'; // Adjust the font size as per your preference
    supportMessageElement.style.textAlign = 'center';
    supportMessageElement.style.marginTop = '20px';
    supportMessageElement.style.fontFamily = 'Courier New';
    supportMessageElement.style.fontWeight = 'bold';
    supportMessageElement.style.color = '#333';

    // Apply different display styles
    const displayStyles = 'flex';
   
    // Apply different font styles
    const fontStyles = 'Courier New';
    

    // Append the support message element to the quiz container
    quizContainer.appendChild(supportMessageElement);
  }
}

function adjustText(element, maxLength) {
    const text = element.textContent;
    if (text.length > maxLength) {
        element.textContent = text.slice(0, maxLength) + '...';
    }
}

// Call adjustQuestionFontSize() after rendering the question and options
showQuestion();

// Call adjustQuestionFontSize() on window resize event
window.addEventListener('resize', adjustText);
