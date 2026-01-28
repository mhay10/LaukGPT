const fs = require('fs');

const dbPath = 'qa_database.db';

if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✅ Database cleared successfully!');
    console.log(`Deleted: ${dbPath}`);
} else {
    console.log('ℹ️  No database file found.');
    console.log(`Looking for: ${dbPath}`);
}
