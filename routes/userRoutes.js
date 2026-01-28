const express = require('express');
const { createQuestion, getAnsweredQuestions } = require('../database/questionService');
const { renderQAItem } = require('../utils/htmlTemplates');

const router = express.Router();

// Submit a new question
router.post('/questions', (req, res) => {
    const { question } = req.body;
    
    if (!question || question.trim() === '') {
        return res.status(400).send('<div class="error">Please enter a question</div>');
    }
    
    let questionId;
    try {
        questionId = createQuestion(question);
    } catch (err) {
        console.error('Error creating question:', err);
        return res.status(500).send('<div class="error">An error occurred while submitting your question. Please try again later.</div>');
    }

    res.send(`
        <div class="success-message">
            Question submitted successfully! Your question ID is #${questionId}
        </div>
    `);
});

// Get all answered questions
router.get('/my-questions', (req, res) => {
    const answeredQuestions = getAnsweredQuestions();
    
    if (answeredQuestions.length === 0) {
        return res.send('<div class="no-data">No answered questions yet</div>');
    }
    
    const html = answeredQuestions.map(q => renderQAItem(q)).join('');
    res.send(html);
});

module.exports = router;
