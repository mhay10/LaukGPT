const { getDatabase, saveDatabase } = require('./db');

/**
 * Create a new question
 */
function createQuestion(questionText) {
    if (!questionText || questionText.trim() === '') {
        throw new Error('Question text is required');
    }

    const db = getDatabase();
    const timestamp = new Date().toISOString();

    try {
        console.log('createQuestion: inserting question', { preview: questionText.trim().slice(0, 120) });
        db.run('INSERT INTO questions (question, timestamp) VALUES (?, ?)', [questionText.trim(), timestamp]);
        saveDatabase();

        // Robustly fetch the most recently inserted id
        const results = db.exec('SELECT id FROM questions ORDER BY id DESC LIMIT 1');
        console.log('createQuestion: SELECT id results:', results);

        if (!results || !results[0] || !results[0].values || results[0].values.length === 0) {
            throw new Error('Failed to retrieve last insert id via SELECT');
        }

        const lastIdRaw = results[0].values[0][0];
        const lastId = Number(lastIdRaw);
        if (Number.isNaN(lastId) || lastId <= 0) {
            throw new Error('Invalid last insert id: ' + String(lastIdRaw));
        }

        console.log('createQuestion: new question id =', lastId);
        return lastId;
    } catch (err) {
        console.error('createQuestion error:', err);
        throw err;
    }
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
