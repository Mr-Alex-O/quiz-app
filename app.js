// State object
var state = {
    questions: [{
        text: "Who was the first president of America?",
        choices: ["George Washinton", "John Adams", "Thomas Jerfferson", "James Madison"],
        correctChoiceIndex: 0
    }, {
        text: "Who was the second president of America?",
        choices: ['George Washington', 'John Adams', 'Thomas Jefferson', 'James Madison'],
        correctChoiceIndex: 1
    }, {
        text: 'Who was the third president of America?',
        choices: ['George Washington', 'John Adams', 'Thomas Jefferson', 'James Madison'],
        correctChoiceIndex: 2,
    }, {
        text: 'Who was the fourth president of America?',
        choices: ['George Washington', 'John Adams', 'Thomas Jefferson', 'James Madison'],
        correctChoiceIndex: 3,
    }, {
        text: 'Who was the fifth president of America?',
        choices: ['George Washington', 'John Adams', 'Thomas Jefferson', 'James Monroe'],
        correctChoiceIndex: 3,
    }, {
        text: 'Who was the sixth president of America?',
        choices: ['George Washington', 'John Adams', 'John Quincy Adams', 'James Monroe'],
        correctChoiceIndex: 2,
    }, {
        text: 'Who was the seventh president of America?',
        choices: ['Andrew Jackson', 'William Henry Harrison', 'John Tyler', 'Martin Van Buren'],
        correctChoiceIndex: 0,
    }, {
        text: 'Who was the eighth president of America?',
        choices: ['Andrew Jackson', 'William Henry Harrison', 'John Tyler', 'Martin Van Buren'],
        correctChoiceIndex: 3,
    }, {
        text: 'Who was the nineth president of America?',
        choices: ['Andrew Jackson', 'William Henry Harrison', 'John Tyler', 'Martin Van Buren'],
        correctChoiceIndex: 0,

    }, {
        text: 'Who was the tenth president of America?',
        choices: ['Andrew Jackson', 'William Henry Harrison', 'John Tyler', 'Martin Van Buren'],
        correctChoiceIndex: 2,

    }, ],

    correctResponses: [
        "Correct!",
        "You sure know your history!"
    ],

    incorrectResponses: [
        "You gave the wrong answer!",
        "Crack open the history books because your answer is not right!"
    ],


    score: 0,
    currentQuestionIndex: 0,
    route: 'start',
    lastAnswerCorrect: false,
    feedbackRandom: 0
};

// State modification functions
function setRoute(state, route) {
    state.route = route;
};

//sets the score and the current question to 0 and sets the route to start
function resetGame(state) {
    state.score = 0;
    state.currentQuestionIndex = 0;
    setRoute(state, 'start');
};

//sets the var current question to the question that we are looking at in the state
//then checks to see if the lastAnswerCorrect variable is true by checking to see if the
//choice is the same as the answer. if it is then the score is incremented by 1
function answerQuestion(state, answer) {
    var currentQuestion = state.questions[state.currentQuestionIndex];
    state.lastAnswerCorrect = currentQuestion.correctChoiceIndex === answer;
    if (state.lastAnswerCorrect) {
        state.score++;
    }
    selectFeedback(state);
    setRoute(state, 'answer-feedback');
};

function selectFeedback(state) {
    state.feedbackRandom = Math.random();
};

//checks to see if there are more questions in the state. if not it displays the final screen
function advance(state) {
    state.currentQuestionIndex++;
    if (state.currentQuestionIndex === state.questions.length) {
        setRoute(state, 'final-feedback');
    } else {
        setRoute(state, 'question');
    }
};

// Render functions
function renderApp(state, elements) {
    // default to hiding all routes, then show the current route
    Object.keys(elements).forEach(function(route) {
        elements[route].hide();
    });
    elements[state.route].show();

    if (state.route === 'start') {
        renderStartPage(state, elements[state.route]);
    } else if (state.route === 'question') {
        renderQuestionPage(state, elements[state.route]);
    } else if (state.route === 'answer-feedback') {
        renderAnswerFeedbackPage(state, elements[state.route]);
    } else if (state.route === 'final-feedback') {
        renderFinalFeedbackPage(state, elements[state.route]);
    }
};

// at the moment, `renderStartPage` doesn't do anything, because
// the start page is preloaded in our HTML, but we've included
// the function and used above in our routing system so that this
// application view is accounted for in our system
function renderStartPage(state, element) {};

function renderQuestionPage(state, element) {
    renderQuestionCount(state, element.find('.question-count'));
    renderQuestionText(state, element.find('.question-text'));
    renderChoices(state, element.find('.choices'));
};

function renderAnswerFeedbackPage(state, element) {
    renderAnswerFeedbackHeader(state, element.find(".feedback-header"));
    renderAnswerFeedbackText(state, element.find(".feedback-text"));
    renderNextButtonText(state, element.find(".see-next"));
};

function renderFinalFeedbackPage(state, element) {
    renderFinalFeedbackText(state, element.find('.results-text'));
};

function renderQuestionCount(state, element) {
    var text = (state.currentQuestionIndex + 1) + "/" + state.questions.length;
    element.text(text);
};

function renderQuestionText(state, element) {
    var currentQuestion = state.questions[state.currentQuestionIndex];
    element.text(currentQuestion.text);
};

function renderChoices(state, element) {
    var currentQuestion = state.questions[state.currentQuestionIndex];
    var choices = currentQuestion.choices.map(function(choice, index) {
        return (
            '<li>' +
            '<input type="radio" name="user-answer" value="' + index + '" required>' +
            '<label>' + choice + '</label>' +
            '</li>'
        );
    });
    element.html(choices);
};

function renderAnswerFeedbackHeader(state, element) {
    var html = state.lastAnswerCorrect ?
        "<h6 class='user-was-correct'>You were right!</h6>" :
        "<h1 class='user-was-incorrect'>Incorrect!</>";

    element.html(html);
};

function renderAnswerFeedbackText(state, element) {
    var choices = state.lastAnswerCorrect ? state.correctResponses : state.incorrectResponses;
    var text = choices[Math.floor(state.feedbackRandom * choices.length)];
    element.text(text);
};

function renderNextButtonText(state, element) {
    var text = state.currentQuestionIndex < state.questions.length - 1 ?
        "Next" : "How did I do?";
    element.text(text);
};

function renderFinalFeedbackText(state, element) {
    var text = "You got " + state.score + " out of " +
        state.questions.length + " questions right.";
    element.text(text);
};

// Event handlers
//an object that shortens the elements
var PAGE_ELEMENTS = {
    'start': $('.start-page'),
    'question': $('.question-page'),
    'answer-feedback': $('.answer-feedback-page'),
    'final-feedback': $('.final-feedback-page')
};

$("form[name='game-start']").submit(function(event) {
    event.preventDefault();
    setRoute(state, 'question');
    renderApp(state, PAGE_ELEMENTS);
});

$(".restart-game").click(function(event) {
    event.preventDefault();
    resetGame(state);
    renderApp(state, PAGE_ELEMENTS);
});

$("form[name='current-question']").submit(function(event) {
    event.preventDefault();
    var answer = $("input[name='user-answer']:checked").val();
    answer = parseInt(answer, 10);
    answerQuestion(state, answer);
    renderApp(state, PAGE_ELEMENTS);
});

$(".see-next").click(function(event) {
    advance(state);
    renderApp(state, PAGE_ELEMENTS);
});

$(function() { renderApp(state, PAGE_ELEMENTS); });
