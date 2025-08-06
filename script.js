// Portfolio Manager Application
// Using only HTML, CSS, JavaScript, and MySQL

class PortfolioManager {
    constructor() {
        this.settings = {
            darkMode: false,
            proMode: false,
            currency: 'USD'
        };
        this.holdings = [];
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.loadHoldings();
        this.updateUI();
    }

    // Settings Management
    async loadSettings() {
        try {
            const response = await fetch('api.php/settings');
            const data = await response.json();
            if (data.success) {
                this.settings = { ...this.settings, ...data.data };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
        this.applySettings();
    }

    async saveSettings() {
        try {
            const response = await fetch('api.php/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.settings)
            });
            const data = await response.json();
            if (data.success) {
                this.applySettings();
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    applySettings() {
        const app = document.getElementById('app');
        
        // Apply dark mode
        if (this.settings.darkMode) {
            app.classList.add('dark-mode');
        } else {
            app.classList.remove('dark-mode');
        }

        // Apply pro mode
        if (this.settings.proMode) {
            app.classList.add('pro-mode');
        } else {
            app.classList.remove('pro-mode');
        }

        // Update toggle states
        document.getElementById('darkModeToggle').checked = this.settings.darkMode;
        document.getElementById('proModeToggle').checked = this.settings.proMode;
        document.getElementById('darkModeSetting').checked = this.settings.darkMode;
        document.getElementById('proModeSetting').checked = this.settings.proMode;
        document.getElementById('currencySelect').value = this.settings.currency;
        
        // Update pro mode label
        const proModeLabel = document.getElementById('proModeLabel');
        if (proModeLabel) {
            proModeLabel.textContent = this.settings.proMode ? 'Pro' : 'Normal';
        }

        this.updatePortfolioDisplay();
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showPage(e.target.dataset.page);
            });
        });

        // Dark mode toggle
        document.getElementById('darkModeToggle').addEventListener('change', (e) => {
            this.settings.darkMode = e.target.checked;
            this.saveSettings();
        });

        // Pro mode toggle
        document.getElementById('proModeToggle').addEventListener('change', (e) => {
            this.settings.proMode = e.target.checked;
            this.saveSettings();
        });

        // Settings page controls
        document.getElementById('darkModeSetting').addEventListener('change', (e) => {
            this.settings.darkMode = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('proModeSetting').addEventListener('change', (e) => {
            this.settings.proMode = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('currencySelect').addEventListener('change', (e) => {
            this.settings.currency = e.target.value;
            this.saveSettings();
        });

        // Save settings button
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
            this.showMessage('Settings saved successfully!', 'success');
        });

        // Reset settings button
        document.getElementById('resetSettings').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all settings to default values?')) {
                this.settings = {
                    darkMode: false,
                    proMode: false,
                    currency: 'USD'
                };
                this.saveSettings();
                this.showMessage('Settings reset to default values!', 'success');
            }
        });

        // Stock search
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchStock();
        });

        document.getElementById('stockSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchStock();
            }
        });

        // Modal controls
        const modal = document.getElementById('addStockModal');
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = document.getElementById('cancelAdd');

        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        cancelBtn.addEventListener('click', () => {
            this.closeModal();
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Add stock form
        document.getElementById('addStockForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addStock();
        });
    }

    // Navigation
    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected page
        document.getElementById(pageId).classList.add('active');
        
        // Add active class to clicked button
        event.target.classList.add('active');
    }

    // Stock Management
    searchStock() {
        const symbol = document.getElementById('stockSearch').value.trim().toUpperCase();
        if (!symbol) {
            this.showMessage('Please enter a stock symbol', 'error');
            return;
        }

        // Simulate stock search (in real app, this would call an API)
        this.simulateStockSearch(symbol);
    }

    simulateStockSearch(symbol) {
        const resultsDiv = document.getElementById('searchResults');
        resultsDiv.innerHTML = '<div class="loading">Searching...</div>';

        // Simulate API delay
        setTimeout(() => {
            // Mock stock data
            const mockStock = {
                symbol: symbol,
                name: `${symbol} Corporation`,
                price: (Math.random() * 100 + 50).toFixed(2),
                change: (Math.random() * 10 - 5).toFixed(2),
                changePercent: (Math.random() * 10 - 5).toFixed(2)
            };

            const isPositive = parseFloat(mockStock.change) >= 0;
            
            resultsDiv.innerHTML = `
                <div class="stock-result">
                    <div class="stock-info">
                        <h3>${mockStock.symbol}</h3>
                        <p>${mockStock.name}</p>
                    </div>
                    <div class="stock-price">
                        <div class="price">$${mockStock.price}</div>
                        <div class="change ${isPositive ? 'positive' : 'negative'}">
                            ${isPositive ? '+' : ''}$${mockStock.change} (${isPositive ? '+' : ''}${mockStock.changePercent}%)
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="portfolioManager.openAddStockModal('${mockStock.symbol}', ${mockStock.price})">
                        Add to Portfolio
                    </button>
                </div>
            `;
        }, 1000);
    }

    openAddStockModal(symbol, price) {
        const modal = document.getElementById('addStockModal');
        document.getElementById('stockSymbol').value = symbol;
        document.getElementById('stockPrice').value = price;
        document.getElementById('stockDate').value = new Date().toISOString().split('T')[0];
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('addStockModal').style.display = 'none';
        document.getElementById('addStockForm').reset();
    }

    async addStock() {
        const symbol = document.getElementById('stockSymbol').value.trim().toUpperCase();
        const quantity = parseFloat(document.getElementById('stockQuantity').value);
        const price = parseFloat(document.getElementById('stockPrice').value);
        const date = document.getElementById('stockDate').value;

        if (!symbol || !quantity || !price || !date) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        try {
            const response = await fetch('api.php/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symbol: symbol,
                    quantity: quantity,
                    buyPrice: price,
                    purchaseDate: date
                })
            });

            const data = await response.json();
            if (data.success) {
                await this.loadHoldings(); // Reload from database
                this.closeModal();
                this.showMessage(`${symbol} added to portfolio!`, 'success');
            } else {
                this.showMessage(data.error || 'Failed to add stock', 'error');
            }
        } catch (error) {
            console.error('Error adding stock:', error);
            this.showMessage('Failed to add stock', 'error');
        }
    }

    async deleteHolding(id) {
        if (confirm('Are you sure you want to remove this stock from your portfolio?')) {
            try {
                const response = await fetch(`api.php/portfolio/${id}`, {
                    method: 'DELETE'
                });

                const data = await response.json();
                if (data.success) {
                    await this.loadHoldings(); // Reload from database
                    this.showMessage('Stock removed from portfolio', 'success');
                } else {
                    this.showMessage(data.error || 'Failed to delete stock', 'error');
                }
            } catch (error) {
                console.error('Error deleting stock:', error);
                this.showMessage('Failed to delete stock', 'error');
            }
        }
    }

    // Data Management
    async loadHoldings() {
        try {
            const response = await fetch('api.php/portfolio');
            const data = await response.json();
            if (data.success) {
                this.holdings = data.data.holdings;
                this.portfolioSummary = data.data.summary;
            }
        } catch (error) {
            console.error('Error loading holdings:', error);
        }
        this.updatePortfolioSummary();
        this.updateHoldingsDisplay();
    }

    async saveHoldings() {
        // Holdings are saved individually when added/deleted
    }

    // UI Updates
    updatePortfolioSummary() {
        if (this.portfolioSummary) {
            document.getElementById('totalValue').textContent = this.formatCurrency(this.portfolioSummary.totalValue);
            document.getElementById('totalCost').textContent = this.formatCurrency(this.portfolioSummary.totalCost);
            document.getElementById('totalGainLoss').textContent = this.formatCurrency(this.portfolioSummary.totalGainLoss);
            document.getElementById('totalGainLoss').className = `card-value ${this.portfolioSummary.totalGainLoss >= 0 ? 'positive' : 'negative'}`;
            document.getElementById('holdingsCount').textContent = this.portfolioSummary.holdingsCount;
        } else {
            // Fallback to local calculation
            const totalValue = this.holdings.reduce((sum, holding) => sum + holding.totalValue, 0);
            const totalCost = this.holdings.reduce((sum, holding) => sum + holding.totalCost, 0);
            const totalGainLoss = totalValue - totalCost;
            const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

            document.getElementById('totalValue').textContent = this.formatCurrency(totalValue);
            document.getElementById('totalCost').textContent = this.formatCurrency(totalCost);
            document.getElementById('totalGainLoss').textContent = this.formatCurrency(totalGainLoss);
            document.getElementById('totalGainLoss').className = `card-value ${totalGainLoss >= 0 ? 'positive' : 'negative'}`;
            document.getElementById('holdingsCount').textContent = this.holdings.length;
        }
    }

    updateHoldingsDisplay() {
        const holdingsList = document.getElementById('holdingsList');
        
        if (this.holdings.length === 0) {
            holdingsList.innerHTML = `
                <div class="empty-portfolio">
                    <div class="empty-icon">📊</div>
                    <h3>No Holdings Yet</h3>
                    <p>Start building your portfolio by adding stocks from the Dashboard.</p>
                </div>
            `;
            return;
        }

        if (this.settings.proMode) {
            // Pro mode - detailed table view
            holdingsList.innerHTML = `
                <table class="holdings-table pro">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Quantity</th>
                            <th>Buy Price</th>
                            <th>Current Price</th>
                            <th>Total Cost</th>
                            <th>Current Value</th>
                            <th>Gain/Loss</th>
                            <th>%</th>
                            <th>Purchase Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.holdings.map(holding => `
                            <tr>
                                <td><strong>${holding.symbol}</strong></td>
                                <td>${holding.quantity}</td>
                                <td>${this.formatCurrency(holding.buyPrice)}</td>
                                <td>${this.formatCurrency(holding.currentPrice)}</td>
                                <td>${this.formatCurrency(holding.totalCost)}</td>
                                <td>${this.formatCurrency(holding.totalValue)}</td>
                                <td class="${holding.gainLoss >= 0 ? 'positive' : 'negative'}">
                                    ${this.formatCurrency(holding.gainLoss)}
                                </td>
                                <td class="${holding.gainLossPercent >= 0 ? 'positive' : 'negative'}">
                                    ${holding.gainLossPercent >= 0 ? '+' : ''}${holding.gainLossPercent.toFixed(2)}%
                                </td>
                                <td>${this.formatDate(holding.purchaseDate)}</td>
                                <td>
                                    <button class="btn btn-danger" onclick="portfolioManager.deleteHolding(${holding.id})">
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            // Normal mode - card view
            holdingsList.innerHTML = this.holdings.map(holding => `
                <div class="holding-card">
                    <div class="holding-header">
                        <h3 class="holding-symbol">${holding.symbol}</h3>
                        <button class="btn btn-danger" onclick="portfolioManager.deleteHolding(${holding.id})">
                            🗑️
                        </button>
                    </div>
                    <div class="holding-details">
                        <div class="holding-detail">
                            <span class="holding-label">Quantity:</span>
                            <span class="holding-value">${holding.quantity} shares</span>
                        </div>
                        <div class="holding-detail">
                            <span class="holding-label">Current Value:</span>
                            <span class="holding-value">${this.formatCurrency(holding.totalValue)}</span>
                        </div>
                        <div class="holding-detail">
                            <span class="holding-label">Gain/Loss:</span>
                            <span class="holding-value ${holding.gainLoss >= 0 ? 'positive' : 'negative'}">
                                ${this.formatCurrency(holding.gainLoss)} (${holding.gainLossPercent >= 0 ? '+' : ''}${holding.gainLossPercent.toFixed(2)}%)
                            </span>
                        </div>
                        <div class="holding-detail">
                            <span class="holding-label">Purchase Date:</span>
                            <span class="holding-value">${this.formatDate(holding.purchaseDate)}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    updateUI() {
        this.updatePortfolioSummary();
        this.updateHoldingsDisplay();
    }

    // Utility Functions
    formatCurrency(amount) {
        const currencySymbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥'
        };
        
        const symbol = currencySymbols[this.settings.currency] || '$';
        return `${symbol}${amount.toFixed(2)}`;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Add styles
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 3000;
            animation: slideIn 0.3s ease-out;
        `;

        // Set background color based on type
        const colors = {
            success: '#059669',
            error: '#dc2626',
            info: '#3b82f6'
        };
        messageDiv.style.backgroundColor = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(messageDiv);

        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .holdings-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }
    
    .holdings-table th,
    .holdings-table td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .dark-mode .holdings-table th,
    .dark-mode .holdings-table td {
        border-bottom-color: #334155;
    }
    
    .holdings-table th {
        background: #f8fafc;
        font-weight: 600;
        color: #374151;
    }
    
    .dark-mode .holdings-table th {
        background: #334155;
        color: #f1f5f9;
    }
    
    .btn-danger {
        background: #dc2626;
        color: white;
        padding: 0.5rem;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 0.875rem;
    }
    
    .btn-danger:hover {
        background: #b91c1c;
    }
    
    .empty-portfolio {
        text-align: center;
        padding: 3rem 1rem;
        color: #64748b;
    }
    
    .dark-mode .empty-portfolio {
        color: #94a3b8;
    }
    
    .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .stock-result {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .dark-mode .stock-result {
        background: #1e293b;
        border-color: #334155;
    }
    
    .stock-info h3 {
        margin: 0 0 0.25rem 0;
        color: #1e293b;
    }
    
    .dark-mode .stock-info h3 {
        color: #f1f5f9;
    }
    
    .stock-info p {
        margin: 0;
        color: #64748b;
        font-size: 0.875rem;
    }
    
    .dark-mode .stock-info p {
        color: #94a3b8;
    }
    
    .stock-price {
        text-align: right;
    }
    
    .stock-price .price {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
    }
    
    .dark-mode .stock-price .price {
        color: #f1f5f9;
    }
    
    .stock-price .change {
        font-size: 0.875rem;
        font-weight: 600;
    }
    
    .loading {
        text-align: center;
        padding: 2rem;
        color: #64748b;
    }
    
    .dark-mode .loading {
        color: #94a3b8;
    }
`;
document.head.appendChild(style);

// Initialize the application
const portfolioManager = new PortfolioManager();