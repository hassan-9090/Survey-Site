// Survey Portal with Admin Panel
const config = {
  "logo": "https://via.placeholder.com/200x60/3498db/ffffff?text=Survey+Portal",
  "surveys": [],
  "adminPassword": "admin123" // Change this in production
};

let currentView = 'user';
let surveys = JSON.parse(localStorage.getItem('surveys')) || [];
let surveyResponses = JSON.parse(localStorage.getItem('surveyResponses')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadSurveysFromStorage();
    showUserView();
});

function loadSurveysFromStorage() {
    const savedSurveys = localStorage.getItem('surveys');
    if (savedSurveys) {
        surveys = JSON.parse(savedSurveys);
    }
}

function saveSurveysToStorage() {
    localStorage.setItem('surveys', JSON.stringify(surveys));
}

function saveResponsesToStorage() {
    localStorage.setItem('surveyResponses', JSON.stringify(surveyResponses));
}

function showUserView() {
    currentView = 'user';
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <header>
            <img src="${config.logo}" alt="Survey Portal Logo">
            <div class="header-center">
                <h1>Survey Portal</h1>
            </div>
            <button class="admin-btn" onclick="showAdminLogin()">Admin Login</button>
        </header>
        
        <div id="surveys-container">
            ${surveys.length === 0 ? 
                '<div style="text-align: center; color: white; font-size: 18px; margin-top: 50px;">No surveys available yet.</div>' : 
                surveys.map(survey => `
                    <div class="survey">
                        <h2>${survey.title}</h2>
                        ${survey.banner ? `<img src="${survey.banner}" alt="${survey.title}" class="survey-banner">` : ''}
                        <p>${survey.description}</p>
                        <p><strong>Collection:</strong> ${survey.collectUserInfo ? 'Name & Email required' : 'Anonymous'}</p>
                        <button class="btn" onclick="startSurvey('${survey.id}')">Start Survey</button>
                    </div>
                `).join('')}
        </div>
    `;
}

function showAdminLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <header>
            <img src="${config.logo}" alt="Survey Portal Logo">
            <div class="header-center">
                <h1>Admin Login</h1>
            </div>
            <button class="user-btn" onclick="showUserView()">Back to Surveys</button>
        </header>
        
        <div class="admin-panel">
            <div style="max-width: 400px; margin: 0 auto;">
                <h2 style="text-align: center; margin-bottom: 30px;">Admin Access</h2>
                <div class="form-group">
                    <label for="admin-password">Password:</label>
                    <input type="password" id="admin-password" placeholder="Enter admin password">
                </div>
                <button class="btn" onclick="loginToAdmin()" style="width: 100%;">Login</button>
                <p style="text-align: center; margin-top: 15px; color: #666;">
                    Default password: admin123
                </p>
            </div>
        </div>
    `;
}

function loginToAdmin() {
    const password = document.getElementById('admin-password').value;
    if (password === config.adminPassword) {
        showAdminPanel();
    } else {
        alert('Incorrect password!');
    }
}

function showAdminPanel() {
    currentView = 'admin';
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <header>
            <img src="${config.logo}" alt="Survey Portal Logo">
            <div class="header-center">
                <h1>Admin Panel</h1>
            </div>
            <button class="user-btn" onclick="showUserView()">View Surveys</button>
        </header>
        
        <div class="admin-panel">
            <div class="admin-tabs">
                <button class="admin-tab active" onclick="switchAdminTab('create')">Create Survey</button>
                <button class="admin-tab" onclick="switchAdminTab('manage')">Manage Surveys</button>
                <button class="admin-tab" onclick="switchAdminTab('responses')">View Responses</button>
            </div>
            
            <div id="admin-content">
                ${getCreateSurveyForm()}
            </div>
        </div>
    `;
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    const content = document.getElementById('admin-content');
    switch(tab) {
        case 'create':
            content.innerHTML = getCreateSurveyForm();
            break;
        case 'manage':
            content.innerHTML = getManageSurveysForm();
            break;
        case 'responses':
            content.innerHTML = getResponsesView();
            break;
    }
}

function getCreateSurveyForm() {
    return `
        <h2>Create New Survey</h2>
        <form onsubmit="createNewSurvey(event)">
            <div class="form-group">
                <label for="survey-title">Survey Title:</label>
                <input type="text" id="survey-title" required>
            </div>
            
            <div class="form-group">
                <label for="survey-description">Description:</label>
                <textarea id="survey-description" rows="3" required></textarea>
            </div>
            
            <div class="form-group">
                <label for="survey-banner">Banner Image URL:</label>
                <input type="url" id="survey-banner" placeholder="https://example.com/image.jpg">
                <small>Leave empty for no banner</small>
            </div>
            
            <div class="form-group">
                <label for="collect-user-info">Collect User Information:</label>
                <select id="collect-user-info">
                    <option value="false">Anonymous (No user info)</option>
                    <option value="true">Require Name & Email</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="thank-you-message">Thank You Message:</label>
                <textarea id="thank-you-message" rows="2" required>Thank you for completing the survey!</textarea>
            </div>
            
            <div id="questions-container">
                <h3>Questions</h3>
                <div id="questions-list"></div>
                <button type="button" class="btn" onclick="addQuestion()">Add Question</button>
            </div>
            
            <div style="margin-top: 30px;">
                <button type="submit" class="btn btn-success">Create Survey</button>
                <button type="button" class="btn btn-secondary" onclick="switchAdminTab('manage')">Cancel</button>
            </div>
        </form>
    `;
}

function addQuestion() {
    const questionsList = document.getElementById('questions-list');
    const questionId = 'question_' + Date.now();
    
    questionsList.innerHTML += `
        <div class="question-item" id="${questionId}">
            <div class="form-group">
                <label>Question Text:</label>
                <input type="text" placeholder="Enter your question" required>
            </div>
            <div class="form-group">
                <label>Options (one per line):</label>
                <textarea placeholder="Option 1&#10;Option 2&#10;Option 3" rows="4" required></textarea>
            </div>
            <button type="button" class="btn btn-danger" onclick="removeQuestion('${questionId}')">Remove Question</button>
        </div>
    `;
}

function removeQuestion(questionId) {
    document.getElementById(questionId).remove();
}

function createNewSurvey(event) {
    event.preventDefault();
    
    const questions = [];
    document.querySelectorAll('.question-item').forEach(questionDiv => {
        const textInput = questionDiv.querySelector('input[type="text"]');
        const optionsTextarea = questionDiv.querySelector('textarea');
        
        if (textInput.value.trim() && optionsTextarea.value.trim()) {
            questions.push({
                type: "multiple-choice",
                text: textInput.value.trim(),
                options: optionsTextarea.value.split('\n').map(opt => opt.trim()).filter(opt => opt)
            });
        }
    });
    
    if (questions.length === 0) {
        alert('Please add at least one question!');
        return;
    }
    
    const newSurvey = {
        id: 'survey_' + Date.now(),
        title: document.getElementById('survey-title').value,
        description: document.getElementById('survey-description').value,
        banner: document.getElementById('survey-banner').value || null,
        collectUserInfo: document.getElementById('collect-user-info').value === 'true',
        thankYouMessage: document.getElementById('thank-you-message').value,
        questions: questions
    };
    
    surveys.push(newSurvey);
    saveSurveysToStorage();
    alert('Survey created successfully!');
    switchAdminTab('manage');
}

function getManageSurveysForm() {
    return `
        <h2>Manage Surveys</h2>
        ${surveys.length === 0 ? 
            '<p>No surveys created yet.</p>' : 
            surveys.map(survey => `
                <div class="survey-list-item">
                    <div>
                        <h3>${survey.title}</h3>
                        <p>${survey.description}</p>
                        <small>Questions: ${survey.questions.length} | 
                        Responses: ${surveyResponses.filter(r => r.surveyId === survey.id).length}</small>
                    </div>
                    <div class="survey-actions">
                        <button class="btn" onclick="editSurvey('${survey.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteSurvey('${survey.id}')">Delete</button>
                    </div>
                </div>
            `).join('')}
    `;
}

function getResponsesView() {
    return `
        <h2>Survey Responses</h2>
        ${surveyResponses.length === 0 ? 
            '<p>No responses yet.</p>' : 
            surveyResponses.map(response => `
                <div class="response-item">
                    <h3>Survey: ${surveys.find(s => s.id === response.surveyId)?.title || 'Unknown'}</h3>
                    ${response.userInfo ? `
                        <p><strong>User:</strong> ${response.userInfo.name} (${response.userInfo.email})</p>
                    ` : '<p><strong>User:</strong> Anonymous</p>'}
                    <p><strong>Submitted:</strong> ${new Date(response.timestamp).toLocaleString()}</p>
                    <div style="margin-top: 15px;">
                        ${response.answers.map(answer => `
                            <p><strong>Q:</strong> ${answer.question}</p>
                            <p><strong>A:</strong> ${answer.answer}</p>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
    `;
}

function deleteSurvey(surveyId) {
    if (confirm('Are you sure you want to delete this survey?')) {
        surveys = surveys.filter(s => s.id !== surveyId);
        saveSurveysToStorage();
        switchAdminTab('manage');
    }
}

function startSurvey(surveyId) {
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) return;
    
    if (survey.collectUserInfo) {
        showUserInfoForm(survey);
    } else {
        startSurveyQuestions(survey);
    }
}

function showUserInfoForm(survey) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <header>
            <img src="${config.logo}" alt="Survey Portal Logo">
            <div class="header-center">
                <h1>${survey.title}</h1>
            </div>
            <button class="user-btn" onclick="showUserView()">Back to Surveys</button>
        </header>
        
        <div class="user-info-form">
            <h2>Please enter your information</h2>
            <form onsubmit="submitUserInfo(event, '${survey.id}')">
                <div class="form-group">
                    <label for="user-name">Full Name:</label>
                    <input type="text" id="user-name" required>
                </div>
                <div class="form-group">
                    <label for="user-email">Email:</label>
                    <input type="email" id="user-email" required>
                </div>
                <button type="submit" class="btn">Start Survey</button>
            </form>
        </div>
    `;
}

function submitUserInfo(event, surveyId) {
    event.preventDefault();
    const survey = surveys.find(s => s.id === surveyId);
    const userInfo = {
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value
    };
    startSurveyQuestions(survey, userInfo);
}

function startSurveyQuestions(survey, userInfo = null) {
    const app = document.getElementById('app');
    let currentQuestion = 0;
    const answers = [];
    
    function showQuestion() {
        if (currentQuestion < survey.questions.length) {
            const question = survey.questions[currentQuestion];
            
            app.innerHTML = `
                <header>
                    <img src="${config.logo}" alt="Survey Portal Logo">
                    <div class="header-center">
                        <h1>${survey.title}</h1>
                        <p>Question ${currentQuestion + 1} of ${survey.questions.length}</p>
                    </div>
                    <button class="user-btn" onclick="showUserView()">Exit Survey</button>
                </header>
                
                <div class="survey-question">
                    <div class="question-card">
                        <h2 class="question-text">${question.text}</h2>
                        <div class="options-container">
                            ${question.options.map(option => `
                                <label class="option-label">
                                    <input type="radio" name="answer" value="${option}">
                                    ${option}
                                </label>
                            `).join('')}
                        </div>
                        <div class="navigation-buttons">
                            ${currentQuestion > 0 ? 
                                `<button class="btn btn-secondary" onclick="previousQuestion()">Back</button>` : 
                                `<div></div>`}
                            <button class="btn" onclick="nextQuestion()">
                                ${currentQuestion === survey.questions.length - 1 ? 'Submit Survey' : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            submitSurvey(survey, answers, userInfo);
        }
    }
    
    window.nextQuestion = function() {
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
    };
    
    window.previousQuestion = function() {
        if (currentQuestion > 0) {
            answers.pop();
            currentQuestion--;
            showQuestion();
        }
    };
    
    showQuestion();
}

function submitSurvey(survey, answers, userInfo) {
    const response = {
        surveyId: survey.id,
        userInfo: userInfo,
        answers: answers,
        timestamp: new Date().toISOString()
    };
    
    surveyResponses.push(response);
    saveResponsesToStorage();
    
    // Simulate Netlify Forms submission
    if (typeof Netlify !== 'undefined') {
        const formData = new FormData();
        formData.append('survey-id', survey.id);
        formData.append('user-info', JSON.stringify(userInfo));
        formData.append('answers', JSON.stringify(answers));
        formData.append('timestamp', response.timestamp);
        
        fetch('/', {
            method: 'POST',
            body: formData,
        }).catch(error => console.log('Form submission error:', error));
    }
    
    showThankYouMessage(survey);
}

function showThankYouMessage(survey) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <header>
            <img src="${config.logo}" alt="Survey Portal Logo">
            <div class="header-center">
                <h1>Thank You!</h1>
            </div>
            <button class="user-btn" onclick="showUserView()">Back to Surveys</button>
        </header>
        
        <div class="thank-you-container">
            <div class="thank-you-card">
                <div class="checkmark">✓</div>
                <h2>Survey Completed!</h2>
                <p>${survey.thankYouMessage}</p>
                <p style="margin-top: 20px; color: #666;">
                    Your responses have been recorded successfully.
                </p>
                <button class="btn" onclick="showUserView()" style="margin-top: 20px;">
                    Return to Survey List
                </button>
            </div>
        </div>
    `;
}
