# Portfolio Manager

A simple portfolio management application built using only **MySQL**, **HTML**, **CSS**, and **JavaScript** (with PHP for backend API).

## Features

- **Dark Mode**: Toggle between light and dark themes
- **Pro Mode**: Switch between simple card view and detailed table view
- **Stock Management**: Add and remove stocks from your portfolio
- **Portfolio Summary**: View total value, cost, and gains/losses
- **Settings**: Customize currency and display preferences
- **Responsive Design**: Works on desktop, tablet, and mobile

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: PHP (for API endpoints)
- **Database**: MySQL
- **No Frameworks**: Pure vanilla implementation

## Setup Instructions

### 1. Database Setup

First, ensure MySQL is installed and running on your system.

```bash
# Create the database
mysql -u root -p
CREATE DATABASE portfolio_db;
USE portfolio_db;
```

### 2. File Structure

Ensure your files are organized as follows:

```
portfolio-manager/
├── index.html          # Main application
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── api.php            # PHP API endpoints
├── db_config.php      # Database configuration
└── README.md          # This file
```

### 3. Web Server Setup

You need a web server with PHP support. You can use:

**Option A: Built-in PHP Server**
```bash
php -S localhost:8000
```

**Option B: Apache/XAMPP**
- Place files in your web server directory
- Access via `http://localhost/portfolio-manager`

**Option C: Nginx**
- Configure nginx to serve PHP files
- Point to your project directory

### 4. Database Configuration

Edit `db_config.php` to match your MySQL settings:

```php
$host = 'localhost';
$username = 'root';
$password = 'your_password';
$database = 'portfolio_db';
```

### 5. Access the Application

Open your web browser and navigate to:
- `http://localhost:8000` (if using PHP built-in server)
- `http://localhost/portfolio-manager` (if using Apache/XAMPP)

## Usage

### Dashboard
- Search for stocks by symbol
- View portfolio summary
- Add stocks to your portfolio

### Portfolio
- View all your holdings
- Toggle between Normal and Pro mode
- Delete stocks from your portfolio

### Settings
- Toggle Dark Mode on/off
- Toggle Pro Mode on/off
- Change currency display
- Save or reset settings

## API Endpoints

The application uses the following PHP API endpoints:

- `GET api.php/portfolio` - Get all portfolio holdings
- `POST api.php/portfolio` - Add a new stock
- `DELETE api.php/portfolio/{id}` - Delete a stock
- `GET api.php/settings` - Get user settings
- `PUT api.php/settings` - Update user settings

## Database Schema

### Portfolio Table
```sql
CREATE TABLE portfolio (
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
);
```

### Settings Table
```sql
CREATE TABLE user_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Features Explained

### Dark Mode
- Toggle in header or settings page
- Changes entire application theme
- Settings persist in database

### Pro Mode
- Toggle in header
- **Normal Mode**: Card-based view with essential info
- **Pro Mode**: Detailed table view with all metrics

### Stock Management
- Search for stocks (simulated)
- Add stocks with quantity, price, and date
- View current holdings
- Delete stocks from portfolio

### Portfolio Summary
- Total portfolio value
- Total cost basis
- Total gain/loss (amount and percentage)
- Number of holdings

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Notes

- This is a demo application
- In production, add proper authentication
- Use HTTPS in production
- Sanitize all user inputs
- Add rate limiting for API calls

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `db_config.php`
- Ensure database exists

### API Errors
- Check PHP error logs
- Verify file permissions
- Ensure PHP has MySQL extension enabled

### Styling Issues
- Clear browser cache
- Check CSS file path
- Verify all files are in correct location

## License

This project is for educational purposes. Feel free to modify and use as needed.