/**
 * Escape HTML to prevent XSS attacks
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Format a date for display
 */
function formatDate(isoString) {
    return new Date(isoString).toLocaleString();
}

module.exports = {
    escapeHtml,
    formatDate
};
