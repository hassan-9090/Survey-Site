// Load and display surveys
document.addEventListener('DOMContentLoaded', async function() {
    const app = document.getElementById('app');
    
    try {
        // Load config
        const response = await fetch('config.json');
        const config = await response.json();
        
        // Display header with logo
        const header = document.createElement('header');
        
        if (config.logo) {
            const logoImg = document.createElement('img');
            logoImg.src = config.logo;
            logoImg.alt = 'Company Logo';
            header.appendChild(logoImg);
        }
        
        const title = document.createElement('h1');
        title.textContent = 'Survey Portal';
        header.appendChild(title);
        
        app.appendChild(header);
        
        // Display surveys
        const surveysContainer = document.createElement('div');
        surveysContainer.className = 'surveys-container';
        
        if (config.surveys && config.surveys.length > 0) {
            config.surveys.forEach(survey => {
                const surveyElement = createSurveyElement(survey);
                surveysContainer.appendChild(surveyElement);
            });
        } else {
            surveysContainer.innerHTML = '<p style="text-align: center; color: #666; font-size: 18px;">No surveys available at the moment.</p>';
        }
        
        app.appendChild(surveysContainer);
        
    } catch (error) {
        console.error('Error loading surveys:', error);
        app.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="color: #e74c3c; font-size: 18px;">Error loading surveys. Please try again later.</p>
                <button onclick="location.reload()" style="
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                ">Retry</button>
            </div>
        `;
    }
});

function createSurveyElement(survey) {
    const surveyDiv = document.createElement('div');
    surveyDiv.className = 'survey';
    
    surveyDiv.innerHTML = `
        <h2>${survey.title}</h2>
        ${survey.banner ? `<img src="${survey.banner}" alt="${survey.title}">` : ''}
        <p>${survey.description}</p>
        <button class="start-survey-btn" data-survey-id="${survey.id}">Start Survey</button>
    `;
    
    // Add click event to start survey
    const startBtn = surveyDiv.querySelector('.start-survey-btn');
    startBtn.addEventListener('click', () => {
        startSurvey(survey);
    });
    
    return surveyDiv;
}

function startSurvey(survey) {
    const app = document.getElementById('app');
    let currentQuestion = 0;
    const answers = [];
    
    function showQuestion() {
        if (currentQuestion < survey.questions.length) {
            const question = survey.questions[currentQuestion];
            
            app.innerHTML = `
                <div class="survey-question">
                    <div class="question-card">
                        <div class="question-header">
                            <h2>${survey.title}</h2>
                            <span class="question-count">Question ${currentQuestion + 1} of ${survey.questions.length}</span>
                        </div>
                        
                        <div class="question-content">
                            <h3 class="question-text">${question.text}</h3>
                            <div class="options-container">
                                ${question.options.map((option, index) => `
                                    <label class="option-label">
                                        <input type="radio" name="answer" value="${option}">
                                        ${option}
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="navigation-buttons">
                            <button id="back-btn" class="nav-btn" ${currentQuestion === 0 ? 'style="visibility: hidden;"' : ''}>
                                Back
                            </button>
                            <button id="next-btn" class="nav-btn primary">
                                ${currentQuestion === survey.questions.length - 1 ? 'Submit Survey' : 'Next Question'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Add event listeners
            document.getElementById('back-btn').addEventListener('click', previousQuestion);
            document.getElementById('next-btn').addEventListener('click', nextQuestion);
            
        } else {
            showThankYouMessage();
        }
    }
    
    function nextQuestion() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            answers.push({
                question: survey.questions[currentQuestion].text,
                answer: selectedOption.value
            });
            currentQuestion++;
            showQuestion();
        } else {
            alert('Please select an answer before continuing.');
        }
    }
    
    function previousQuestion() {
        if (currentQuestion > 0) {
            answers.pop();
            currentQuestion--;
            showQuestion();
        }
    }
    
    function showThankYouMessage() {
        app.innerHTML = `
            <div class="thank-you-container">
                <div class="thank-you-card">
                    <div class="checkmark">✓</div>
                    <h2>Thank You!</h2>
                    <p>${survey.thankYouMessage}</p>
                    <button id="return-home" class="start-survey-btn" style="margin-top: 20px;">
                        Return to Surveys
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('return-home').addEventListener('click', () => {
            location.reload();
        });
        
        // In a real application, you would send the answers to your server here
        console.log('Survey completed:', {
            survey: survey.title,
            answers: answers
        });
    }
    
    // Start the survey
    showQuestion();
}
