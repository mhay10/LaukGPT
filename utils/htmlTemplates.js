const { escapeHtml, formatDate } = require('./htmlHelpers');

/**
 * Generate HTML for a Q&A item (user view)
 */
function renderQAItem(question) {
    const isImage = question.type === 'image';
    const imageHtml = question.image_data ? `\n                <div class="image-answer">\n                    <img src="${question.image_data}" alt="Answer Image" />\n                </div>` : '';

    // Show caption or answer for both image and text questions; label appropriately
    const answerText = question.answer ? `<div class="answer-text"><strong>${isImage ? 'Caption' : 'A'}:</strong> ${escapeHtml(question.answer)}</div>` : '';

    return `
        <div class="qa-item">
            <div class="question-header">
                <span class="question-id">#${question.id}</span>
                <span class="timestamp">${formatDate(question.timestamp)}</span>
            </div>
            <div class="question-text">
                <strong>Q:</strong> ${escapeHtml(question.question)}${isImage ? ' <em>(image request)</em>' : ''}
            </div>
            ${answerText}
            ${imageHtml}
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
    const isImage = question.type === 'image';

    if (isImage) {
        return `
        <div class="admin-question-item image-request">
            <div class="question-header">
                <span class="question-id">#${question.id}</span>
                <span class="timestamp">${formatDate(question.timestamp)}</span>
            </div>
            <div class="question-text">
                <strong>Image Prompt:</strong> ${escapeHtml(question.question)}
            </div>

            <!-- Drawing form: hidden input image_data will be set by client-side drawing script -->
            <form hx-post="/api/admin/answer-image/${question.id}"
                  hx-target="#pending-questions"
                  hx-swap="outerHTML"
                  hx-on::before-request="event.detail.elt.querySelector('button').disabled = true"
                  class="answer-image-form">

                <div class="drawing-controls">
                    <div class="tool-group" role="toolbar" aria-label="Drawing tools">
                        <button type="button" class="btn btn-secondary tool-btn active" data-tool="brush" title="Brush" aria-label="Brush">
                            <span class="emoji-icon" aria-hidden="true">🖌️</span>
                        </button>
                        <button type="button" class="btn btn-secondary tool-btn" data-tool="bucket" title="Bucket fill" aria-label="Bucket fill">
                            <span class="emoji-icon" aria-hidden="true">🪣</span>
                        </button>
                        <button type="button" class="btn btn-secondary tool-btn" data-tool="eraser" title="Eraser" aria-label="Eraser">
                            <span class="emoji-icon" aria-hidden="true">🧽</span>
                        </button>
                    </div>
                    <label class="control-item">Brush: <input type="range" min="1" max="30" value="4" class="brush-size"></label>
                    <label class="control-item">Color: <input type="color" value="#000000" class="brush-color"></label>
                    <button type="button" class="btn btn-secondary clear-canvas">Clear</button>
                </div>

                <div class="canvas-wrap">
                    <canvas width="800" height="500"></canvas>
                </div>

                <input type="hidden" name="image_data" />
                <textarea name="answer" placeholder="Optional caption or description (optional)" rows="2"></textarea>
                <button type="button" class="btn btn-primary save-image">Save & Submit Image</button>
            </form>
        </div>
        `;
    }

    // fallback for text answers
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
    const imageHtml = question.image_data ? `\n            <div class="image-answer">\n                <img src="${question.image_data}" alt="Answer Image" />\n            </div>` : '';

    const answerText = question.answer ? `<div class="answer-text"><strong>A:</strong> ${escapeHtml(question.answer)}</div>` : '';

    return `
        <div class="answered-question-item">
            <div class="question-header">
                <span class="question-id">#${question.id}</span>
                <span class="timestamp">Asked: ${formatDate(question.timestamp)}</span>
            </div>
            <div class="question-text">
                <strong>Q:</strong> ${escapeHtml(question.question)}${question.type === 'image' ? ' <em>(image request)</em>' : ''}
            </div>
            ${answerText}
            ${imageHtml}
            <div class="answered-time">
                Answered: ${formatDate(question.answered_at)}</div>
        </div>
    `;
}

module.exports = {
    renderQAItem,
    renderPendingQuestion,
    renderAnsweredQuestion
};
