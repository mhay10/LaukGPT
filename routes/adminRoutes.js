const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { 
    getPendingQuestions, 
    getAnsweredQuestions, 
    getQuestionById,
    answerQuestion 
} = require('../database/questionService');
const { 
    renderPendingQuestion, 
    renderAnsweredQuestion 
} = require('../utils/htmlTemplates');

const router = express.Router();

// Get pending questions for admin
router.get('/admin/pending-questions', requireAuth, (req, res) => {
    const pendingQuestions = getPendingQuestions();
    
    if (pendingQuestions.length === 0) {
        return res.send('<div class="no-data">No pending questions</div>');
    }
    
    const html = pendingQuestions.map(q => renderPendingQuestion(q)).join('');
    res.send(html);
});

// Get answered questions for admin
router.get('/admin/answered-questions', requireAuth, (req, res) => {
    const answeredQuestions = getAnsweredQuestions();
    
    if (answeredQuestions.length === 0) {
        return res.send('<div class="no-data">No answered questions yet</div>');
    }
    
    const html = answeredQuestions.map(q => renderAnsweredQuestion(q)).join('');
    res.send(html);
});

// Submit an answer
router.post('/admin/answer/:id', requireAuth, (req, res) => {
    const questionId = parseInt(req.params.id);
    const { answer } = req.body;
    
    // Check if question exists
    const question = getQuestionById(questionId);
    if (!question) {
        return res.status(404).send('<div class="error">Question not found</div>');
    }
    
    if (!answer || answer.trim() === '') {
        return res.status(400).send('<div class="error">Please enter an answer</div>');
    }
    
    // Update the question with the answer
    answerQuestion(questionId, answer);
    
    // Return updated pending questions list
    const pendingQuestions = getPendingQuestions();
    
    let html;
    if (pendingQuestions.length === 0) {
        html = '<div id="pending-questions"><div class="no-data">No pending questions</div></div>';
    } else {
        html = '<div id="pending-questions">' + 
               pendingQuestions.map(q => renderPendingQuestion(q)).join('') + 
               '</div>';
    }
    
    // Trigger refresh of answered questions section
    res.setHeader('HX-Trigger', 'answeredQuestion');
    res.send(html);
});

module.exports = router;
