const express = require('express');
const config = require('../config/config');

const router = express.Router();

// Admin login
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === config.admin.username && password === config.admin.password) {
        req.session.isAdmin = true;
        req.session.username = username;
        // Redirect using HTMX
        res.setHeader('HX-Redirect', '/admin');
        res.send('<div class="success-message">Login successful! Redirecting...</div>');
    } else {
        res.send('<div class="error">Invalid username or password</div>');
    }
});

// Admin logout
router.get('/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

module.exports = router;
