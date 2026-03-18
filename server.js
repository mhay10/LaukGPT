const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const config = require('./config/config');
const { initDatabase, dbPath } = require('./database/db');

// Import routes
const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = config.port;
const HOST = process.env.HOST || '0.0.0.0';

// Determine the correct path for static files (pkg compatibility)
const publicPath = path.join(__dirname, 'public');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session(config.session));
app.use(express.static(publicPath));

// Mount routes
app.use('/', pageRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', adminRoutes);

// Start server
initDatabase()
    .then(() => {
        app.listen(PORT, HOST, () => {
            console.log(`Server is running on http://${HOST}:${PORT}`);
            console.log(`User page: http://localhost:${PORT}`);
            console.log(`Admin page: http://localhost:${PORT}/admin`);
            console.log(`Database: SQLite (${dbPath})`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database. Server did not start.');
        console.error(err);
        process.exit(1);
    });
