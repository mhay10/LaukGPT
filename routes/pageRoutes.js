const express = require('express');
const path = require('path');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

// Admin panel (protected)
router.get('/admin', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

module.exports = router;
