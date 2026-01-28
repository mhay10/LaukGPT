const initSqlJs = require('sql.js');
const fs = require('fs');
const config = require('../config/config');

let db;
const dbPath = config.database.path;

/**
 * Initialize SQLite database
 */
async function initDatabase() {
    const SQL = await initSqlJs();
    
    // Load existing database or create new one
    if (fs.existsSync(dbPath)) {
        const buffer = fs.readFileSync(dbPath);
        db = new SQL.Database(buffer);
    } else {
        db = new SQL.Database();
    }
    
    // Create questions table if it doesn't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT,
            timestamp TEXT NOT NULL,
            answered_at TEXT
        )
    `);
    
    saveDatabase();
}

/**
 * Save database to file
 */
function saveDatabase() {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
}

/**
 * Get database instance
 */
function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return db;
}

module.exports = {
    initDatabase,
    saveDatabase,
    getDatabase,
    dbPath
};
