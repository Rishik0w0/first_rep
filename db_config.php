<?php
// Database configuration for Portfolio Manager
// Using only MySQL, HTML, CSS, and JavaScript

$host = 'localhost';
$username = 'root';
$password = '';
$database = 'portfolio_db';

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8
$conn->set_charset("utf8");

// Create tables if they don't exist
$sql_portfolio = "CREATE TABLE IF NOT EXISTS portfolio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    quantity DECIMAL(10, 4) NOT NULL,
    buy_price DECIMAL(10, 2) NOT NULL,
    purchase_date DATE NOT NULL,
    current_price DECIMAL(10, 2) DEFAULT 0,
    total_cost DECIMAL(15, 2) NOT NULL,
    total_value DECIMAL(15, 2) DEFAULT 0,
    gain_loss DECIMAL(15, 2) DEFAULT 0,
    gain_loss_percent DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

$sql_settings = "CREATE TABLE IF NOT EXISTS user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql_portfolio) === FALSE) {
    echo "Error creating portfolio table: " . $conn->error;
}

if ($conn->query($sql_settings) === FALSE) {
    echo "Error creating settings table: " . $conn->error;
}

// Insert default settings if they don't exist
$default_settings = [
    ['currency', 'USD'],
    ['dark_mode', 'false'],
    ['pro_mode', 'false']
];

foreach ($default_settings as $setting) {
    $key = $setting[0];
    $value = $setting[1];
    
    $sql = "INSERT IGNORE INTO user_settings (setting_key, setting_value) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $key, $value);
    $stmt->execute();
    $stmt->close();
}

?>