const { getDatabase, saveDatabase } = require('./db');

/**
 * Create a new question
 */
function createQuestion(questionText) {
    const db = getDatabase();
    const timestamp = new Date().toISOString();
    
    db.run('INSERT INTO questions (question, timestamp) VALUES (?, ?)', [questionText.trim(), timestamp]);
    saveDatabase();
    
    const result = db.exec('SELECT last_insert_rowid() as id')[0];
    const lastId = result.values[0][0];
    
    return lastId;
}

/**
 * Get all answered questions
 */
function getAnsweredQuestions() {
    const db = getDatabase();
    const results = db.exec('SELECT * FROM questions WHERE answer IS NOT NULL ORDER BY answered_at DESC');
    
    if (!results.length || results[0].values.length === 0) {
        return [];
    }
    
    return resultsToObjects(results[0]);
}

/**
 * Get all pending questions (unanswered)
 */
function getPendingQuestions() {
    const db = getDatabase();
    const results = db.exec('SELECT * FROM questions WHERE answer IS NULL ORDER BY timestamp ASC');
    
    if (!results.length || results[0].values.length === 0) {
        return [];
    }
    
    return resultsToObjects(results[0]);
}

/**
 * Get a question by ID
 */
function getQuestionById(id) {
    const db = getDatabase();
    const results = db.exec('SELECT * FROM questions WHERE id = ?', [id]);
    
    if (!results.length || results[0].values.length === 0) {
        return null;
    }
    
    const questions = resultsToObjects(results[0]);
    return questions[0];
}

/**
 * Answer a question
 */
function answerQuestion(questionId, answerText) {
    const db = getDatabase();
    const answeredAt = new Date().toISOString();
    
    db.run('UPDATE questions SET answer = ?, answered_at = ? WHERE id = ?', 
        [answerText.trim(), answeredAt, questionId]);
    saveDatabase();
}

/**
 * Helper function to convert SQL results to objects
 */
function resultsToObjects(result) {
    const columns = result.columns;
    return result.values.map(row => {
        const obj = {};
        columns.forEach((col, idx) => {
            obj[col] = row[idx];
        });
        return obj;
    });
}

module.exports = {
    createQuestion,
    getAnsweredQuestions,
    getPendingQuestions,
    getQuestionById,
    answerQuestion
};
