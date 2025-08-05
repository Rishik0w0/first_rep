-- Portfolio Management Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Table to store portfolio entries (current holdings)
CREATE TABLE IF NOT EXISTS portfolio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    buy_price DECIMAL(10, 2) NOT NULL,
    buy_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_symbol (symbol),
    INDEX idx_buy_date (buy_date)
);

-- Table to store historical stock prices (for charting)
CREATE TABLE IF NOT EXISTS stock_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_symbol_date (symbol, date),
    INDEX idx_symbol_date (symbol, date)
);

-- Table to store portfolio value snapshots over time
CREATE TABLE IF NOT EXISTS portfolio_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_value DECIMAL(15, 2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (date),
    INDEX idx_date (date)
);

-- Table to store user settings
CREATE TABLE IF NOT EXISTS user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO user_settings (setting_key, setting_value) VALUES 
('currency', 'USD'),
('theme', 'light'),
('mode', 'normal')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Sample data for testing
INSERT INTO portfolio (symbol, quantity, buy_price, buy_date) VALUES 
('AAPL', 100, 150.25, '2023-01-15'),
('GOOGL', 50, 2500.00, '2023-02-20'),
('MSFT', 75, 300.50, '2023-03-10')
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);