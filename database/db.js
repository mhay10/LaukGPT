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
    
    // Create questions table if it doesn't exist (include columns for image requests)
    db.run(`
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT,
            timestamp TEXT NOT NULL,
            answered_at TEXT,
            type TEXT DEFAULT 'text',
            image_data TEXT
        )
    `);
    
    // For existing databases, ensure the new columns exist (safe to run multiple times)
    const cols = db.exec("PRAGMA table_info('questions')");
    const existingCols = (cols && cols[0] && cols[0].values) ? cols[0].values.map(r => r[1]) : [];
    if (!existingCols.includes('type')) {
        try {
            db.run("ALTER TABLE questions ADD COLUMN type TEXT DEFAULT 'text'");
        } catch (e) {
            console.warn('Could not add column `type` (it may already exist):', e.message);
        }
    }
    if (!existingCols.includes('image_data')) {
        try {
            db.run("ALTER TABLE questions ADD COLUMN image_data TEXT");
        } catch (e) {
            console.warn('Could not add column `image_data` (it may already exist):', e.message);
        }
    }

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
