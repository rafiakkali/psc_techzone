const startButton = document.getElementById('start-button');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const answerElement = document.getElementById('answer');
const timerElement = document.getElementById('timer');
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
    const optionsAndAnswer = question.split('Answer: ');
    const options = optionsAndAnswer[0].split('\n').filter(o => o.trim() !== '');
    const answer = optionsAndAnswer[1].trim();
    return {
      question: options[0],
      options: options.slice(1),
      answer
    };
  });
}

function showQuestion() {
  const currentQuestion = parsedQuestions[currentQuestionIndex];
  const { question, options } = currentQuestion;

  // Display the question
  questionElement.textContent = `Q${currentQuestionIndex + 1}: ${question}`;

  // Clear and configure the options container
  optionsContainer.innerHTML = '';
  optionsContainer.style.display = 'grid';
  optionsContainer.style.gridTemplateColumns = '1fr 1fr'; // Display options in two columns

  options.forEach(option => {
    const optionContainer = document.createElement('div');
    optionContainer.classList.add('option-container');

    const optionElement = document.createElement('p');
    optionElement.textContent = option;
    optionContainer.appendChild(optionElement);

    optionsContainer.appendChild(optionContainer);
  });

  answerElement.textContent = ''; // Clear the answer

  timerElement.style.display = 'block'; // Display the timer
  timerElement.textContent = '15';
  let timeLeft = 15;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft.toString().padStart(2, '0');
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      showAnswer();
    }
  }, 1000);
}

function adjustQuestionFontSize() {
  const maxQuestionLength = 30; // Maximum number of characters for the question
  const maxOptionLength = 20; // Maximum number of characters for each option

  const questionLength = questionElement.textContent.length;
  const optionsLength = Array.from(optionsContainer.querySelectorAll('.option-container p')).reduce((total, option) => total + option.textContent.length, 0);

  const scaleFactor = Math.min(1, maxQuestionLength / questionLength, maxOptionLength / optionsLength);

  let scaledFontSize = 3.5; // Adjust the initial font size

  // Shrink the font size if the text exceeds the maximum length
  if (questionLength > maxQuestionLength || optionsLength > maxOptionLength) {
    scaledFontSize *= scaleFactor;
  }

  // Set the font size for the question
  questionElement.style.fontSize = `${scaledFontSize}vw`;

  // Set the font size for the options
  const optionElements = optionsContainer.querySelectorAll('.option-container p');
  optionElements.forEach(optionElement => {
    optionElement.style.fontSize = `${scaledFontSize * 0.6}vw`; // Adjust the scaling factor as per your preference
  });
}

function showAnswer() {
  const currentQuestion = parsedQuestions[currentQuestionIndex];
  answerElement.textContent = `Answer: ${currentQuestion.answer}`;

  // Adjust the text length for answer
  adjustText(answerElement, 100); // Adjust the maximum length as per your preference

  // Hide the timer
  timerElement.style.display = 'none';

  // Delay for 10 seconds before moving to the next question
  setTimeout(() => {
    // Reset the text length for question and options
    adjustText(questionElement, Infinity);
    adjustText(optionsContainer, Infinity);

    // Show the timer
    timerElement.style.display = 'block';

    nextQuestion();
  }, 4000); // 10000 milliseconds = 10 seconds
}

function adjustQuestionFontSize() {
  const questionContainerWidth = questionElement.offsetWidth;
  const optionsContainerWidth = optionsContainer.offsetWidth;
  const containerWidth = Math.max(questionContainerWidth, optionsContainerWidth);
  const availableWidth = containerWidth - 40; // Adjust the margin as per your layout

  const questionWidth = questionElement.scrollWidth;
  const optionsWidth = optionsContainer.scrollWidth;
  const textWidth = Math.max(questionWidth, optionsWidth);
  const scaleFactor = availableWidth / textWidth;

  const scaledFontSize = scaleFactor * 3.5; // Adjust the initial font size

  // Set the font size for the question
  questionElement.style.fontSize = `${scaledFontSize}vw`;

  // Set the font size for the options
  const optionElements = optionsContainer.querySelectorAll('.option-container p');
  optionElements.forEach(optionElement => {
    optionElement.style.fontSize = `${scaledFontSize * 0.6}vw`; // Adjust the scaling factor as per your preference
  });
}

function truncateText(element, maxLength) {
  const text = element.textContent;
  if (text.length > maxLength) {
    element.textContent = text.slice(0, maxLength) + '...';
  }
}

function adjustText(container, maxLength) {
  const elements = container.querySelectorAll('p');
  elements.forEach(element => {
    truncateText(element, maxLength);
  });
}

// Call adjustQuestionFontSize() after rendering the question and options
showQuestion();

// Call adjustQuestionFontSize() on window resize event
window.addEventListener('resize', adjustQuestionFontSize);

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < parsedQuestions.length) {
    showQuestion();
  }else {
  // Quiz ended
  questionElement.textContent = 'Thank you!...';
  optionsContainer.innerHTML = '';
  answerElement.textContent = '';
  timerElement.textContent = '';

  questionElement.style.display = 'flex';
  questionElement.style.alignItems = 'center';
  questionElement.style.justifyContent = 'center';
  questionElement.style.fontSize = '5vw'; // Adjust the font size as per your preference

}

}
