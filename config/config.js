module.exports = {
    port: process.env.PORT || 3000,
    
    // Admin credentials (in production, use environment variables and hashed passwords)
    admin: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123' // Change this in production!
    },
    
    // Session configuration
    session: {
        secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
        resave: false,
        saveUninitialized: false,
        cookie: { 
            secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    },
    
    // Database configuration
    database: {
        path: process.env.DB_PATH || 'qa_database.db'
    }
};
