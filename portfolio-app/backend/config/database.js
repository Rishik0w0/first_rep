const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Create database connection
const dbPath = path.join(__dirname, '..', 'portfolio.db');
const db = new sqlite3.Database(dbPath);

// Test database connection
const testConnection = async () => {
    return new Promise((resolve) => {
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='user_settings'", (err, row) => {
            if (err) {
                console.error('❌ Database connection failed:', err.message);
                resolve(false);
            } else {
                console.log('✅ Database connected successfully');
                resolve(true);
            }
        });
    });
};

module.exports = {
    db,
    testConnection
};