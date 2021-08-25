//(function () {
function loadQuiz(params) {
    function buildQuiz(params) {

        var quiz = params.quiz;

        var heading = document.getElementsByTagName('h1')[0];
        heading.innerHTML = quiz.QuizName;
        const output = [];

        for (var i = 0; i < quiz.Questions.length; i++) {
            const answers = [];
            for (var j = 0; j < 4; j++) {
                // ...add an HTML radio button
                answers.push(
                    `<label>
                        <input type="radio" name="question${i + 1}" value="${j + 1}">
                        ${j + 1} :
                        ${quiz.Questions[i].options[j]}
                    </label>`
                );
            }

            // add this question and its answers to the output
            output.push(
                `<div class="slide">
                    <div class="question"> ${quiz.Questions[i].QuestionStatement} </div>
                    <div class="answers"> ${answers.join("")} </div>
                </div>`
            );
        }
        // finally combine our output list into one string of HTML and put it on the page
        quizContainer.innerHTML = output.join('');
    }

    function showSlide(n) {
        slides[currentSlide].classList.remove('active-slide');
        slides[n].classList.add('active-slide');
        currentSlide = n;
        if (currentSlide === 0) {
            previousButton.style.display = 'none';
        }
        else {
            previousButton.style.display = 'inline-block';
        }
        if (currentSlide === slides.length - 1) {
            nextButton.style.display = 'none';
            submitButton.style.display = 'inline-block';
        }
        else {
            nextButton.style.display = 'inline-block';
            submitButton.style.display = 'none';
        }
    }

    function showNextSlide() {
        showSlide(currentSlide + 1);
    }

    function showPreviousSlide() {
        showSlide(currentSlide - 1);
    }

    function getUserAnswer() {
        var respArray = [];
        const answerContainers = quizContainer.querySelectorAll('.answers');

        for (var i=0;i<answerContainers.length; i++) {
            const selector = `input[name=question${i + 1}]:checked`;
            const userAnswer = (answerContainers[i].querySelector(selector) || {}).value;
            respArray.push(userAnswer);  
        }
        return respArray;
    }

    function showResults_() {
        var respArray = getUserAnswer();
        onQuizSubmit(respArray);
    }
    // Variables
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');

    buildQuiz(params);

    // Pagination
    const previousButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;

    // Show the first slide
    showSlide(currentSlide);

    // Event listeners
    submitButton.addEventListener('click', showResults_);
    previousButton.addEventListener("click", showPreviousSlide);
    nextButton.addEventListener("click", showNextSlide);
}
