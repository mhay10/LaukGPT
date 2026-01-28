const { escapeHtml, formatDate } = require('./htmlHelpers');

/**
 * Generate HTML for a Q&A item (user view)
 */
function renderQAItem(question) {
    return `
        <div class="qa-item">
            <div class="question-header">
                <span class="question-id">#${question.id}</span>
                <span class="timestamp">${formatDate(question.timestamp)}</span>
            </div>
            <div class="question-text">
                <strong>Q:</strong> ${escapeHtml(question.question)}
            </div>
            <div class="answer-text">
                <strong>A:</strong> ${escapeHtml(question.answer)}
            </div>
            <div class="answered-time">
                Answered: ${formatDate(question.answered_at)}
            </div>
        </div>
    `;
}

/**
 * Generate HTML for a pending question (admin view)
 */
function renderPendingQuestion(question) {
    return `
        <div class="admin-question-item">
            <div class="question-header">
                <span class="question-id">#${question.id}</span>
                <span class="timestamp">${formatDate(question.timestamp)}</span>
            </div>
            <div class="question-text">
                <strong>Question:</strong> ${escapeHtml(question.question)}
            </div>
            <form hx-post="/api/admin/answer/${question.id}" 
                  hx-target="#pending-questions" 
                  hx-swap="outerHTML"
                  hx-on::before-request="event.detail.elt.querySelector('button').disabled = true"
                  class="answer-form">
                <textarea name="answer" 
                          placeholder="Type your answer here..." 
                          required
                          rows="3"></textarea>
                <button type="submit" class="btn btn-primary">Submit Answer</button>
            </form>
        </div>
    `;
}

/**
 * Generate HTML for an answered question (admin view)
 */
function renderAnsweredQuestion(question) {
    return `
        <div class="answered-question-item">
            <div class="question-header">
                <span class="question-id">#${question.id}</span>
                <span class="timestamp">Asked: ${formatDate(question.timestamp)}</span>
            </div>
            <div class="question-text">
                <strong>Q:</strong> ${escapeHtml(question.question)}
            </div>
            <div class="answer-text">
                <strong>A:</strong> ${escapeHtml(question.answer)}
            </div>
            <div class="answered-time">
                Answered: ${formatDate(question.answered_at)}
            </div>
        </div>
    `;
}

module.exports = {
    renderQAItem,
    renderPendingQuestion,
    renderAnsweredQuestion
};
