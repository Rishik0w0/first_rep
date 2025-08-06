const { db } = require('../config/database');

class SettingsController {
    /**
     * Get all user settings
     * GET /api/settings
     */
    async getSettings(req, res) {
        try {
            db.all('SELECT setting_key, setting_value FROM user_settings', (err, rows) => {
                if (err) {
                    console.error('Error in getSettings controller:', err);
                    return res.status(500).json({
                        error: 'Failed to get settings',
                        details: err.message
                    });
                }

                // Convert to object format with camelCase keys
                const settings = {};
                rows.forEach(row => {
                    let value = row.setting_value;
                    
                    // Parse boolean values
                    if (value === 'true') value = true;
                    else if (value === 'false') value = false;
                    // Parse numeric values
                    else if (!isNaN(value) && value !== '') value = parseFloat(value);
                    
                    // Convert snake_case to camelCase
                    const camelKey = row.setting_key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
                    settings[camelKey] = value;
                });

                res.json({
                    success: true,
                    data: settings
                });
            });
        } catch (error) {
            console.error('Error in getSettings controller:', error);
            res.status(500).json({
                error: 'Failed to get settings',
                details: error.message
            });
        }
    }

    /**
     * Update a specific setting
     * PUT /api/settings/:key
     */
    async updateSetting(req, res) {
        try {
            const { key } = req.params;
            const { value } = req.body;

            if (!key) {
                return res.status(400).json({
                    error: 'Setting key is required'
                });
            }

            if (value === undefined || value === null) {
                return res.status(400).json({
                    error: 'Setting value is required'
                });
            }

            // Convert camelCase to snake_case for database storage
            const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();

            // Convert value to string for storage
            const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

            // Update or insert setting
            db.run(`
                INSERT OR REPLACE INTO user_settings (setting_key, setting_value, updated_at) 
                VALUES (?, ?, CURRENT_TIMESTAMP)
            `, [dbKey, stringValue], function(err) {
                if (err) {
                    console.error('Error in updateSetting controller:', err);
                    return res.status(500).json({
                        error: 'Failed to update setting',
                        details: err.message
                    });
                }

                res.json({
                    success: true,
                    data: {
                        key,
                        value
                    },
                    message: 'Setting updated successfully'
                });
            });
        } catch (error) {
            console.error('Error in updateSetting controller:', error);
            res.status(500).json({
                error: 'Failed to update setting',
                details: error.message
            });
        }
    }

    /**
     * Update multiple settings at once
     * PUT /api/settings
     */
    async updateSettings(req, res) {
        try {
            const settings = req.body;

            if (!settings || typeof settings !== 'object') {
                return res.status(400).json({
                    error: 'Settings object is required'
                });
            }

            // Update each setting
            let completed = 0;
            const totalSettings = Object.keys(settings).length;

            for (const [key, value] of Object.entries(settings)) {
                const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                
                // Convert camelCase to snake_case for database storage
                const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
                
                db.run(`
                    INSERT OR REPLACE INTO user_settings (setting_key, setting_value, updated_at) 
                    VALUES (?, ?, CURRENT_TIMESTAMP)
                `, [dbKey, stringValue], function(err) {
                    if (err) {
                        console.error('Error in updateSettings controller:', err);
                        return res.status(500).json({
                            error: 'Failed to update settings',
                            details: err.message
                        });
                    }

                    completed++;
                    if (completed === totalSettings) {
                        res.json({
                            success: true,
                            data: settings,
                            message: 'Settings updated successfully'
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error in updateSettings controller:', error);
            res.status(500).json({
                error: 'Failed to update settings',
                details: error.message
            });
        }
    }

    /**
     * Reset settings to default values
     * POST /api/settings/reset
     */
    async resetSettings(req, res) {
        try {
            const defaultSettings = [
                ['currency', 'USD'],
                ['dark_mode', 'false'],
                ['pro_mode', 'false']
            ];

            // Clear existing settings
            db.run('DELETE FROM user_settings', function(err) {
                if (err) {
                    console.error('Error in resetSettings controller:', err);
                    return res.status(500).json({
                        error: 'Failed to reset settings',
                        details: err.message
                    });
                }

                // Insert default settings
                let completed = 0;
                const totalSettings = defaultSettings.length;

                for (const [key, value] of defaultSettings) {
                    db.run(
                        'INSERT INTO user_settings (setting_key, setting_value) VALUES (?, ?)',
                        [key, value],
                        function(err) {
                            if (err) {
                                console.error('Error in resetSettings controller:', err);
                                return res.status(500).json({
                                    error: 'Failed to reset settings',
                                    details: err.message
                                });
                            }

                            completed++;
                            if (completed === totalSettings) {
                                res.json({
                                    success: true,
                                    message: 'Settings reset to default values'
                                });
                            }
                        }
                    );
                }
            });
        } catch (error) {
            console.error('Error in resetSettings controller:', error);
            res.status(500).json({
                error: 'Failed to reset settings',
                details: error.message
            });
        }
    }

    /**
     * Get a specific setting
     * GET /api/settings/:key
     */
    async getSetting(req, res) {
        try {
            const { key } = req.params;

            if (!key) {
                return res.status(400).json({
                    error: 'Setting key is required'
                });
            }

            // Convert camelCase to snake_case for database lookup
            const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();

            db.get('SELECT setting_value FROM user_settings WHERE setting_key = ?', [dbKey], (err, row) => {
                if (err) {
                    console.error('Error in getSetting controller:', err);
                    return res.status(500).json({
                        error: 'Failed to get setting',
                        details: err.message
                    });
                }

                if (!row) {
                    return res.status(404).json({
                        error: 'Setting not found'
                    });
                }

                let value = row.setting_value;
                
                // Parse boolean values
                if (value === 'true') value = true;
                else if (value === 'false') value = false;
                // Parse numeric values
                else if (!isNaN(value) && value !== '') value = parseFloat(value);

                res.json({
                    success: true,
                    data: {
                        key,
                        value
                    }
                });
            });
        } catch (error) {
            console.error('Error in getSetting controller:', error);
            res.status(500).json({
                error: 'Failed to get setting',
                details: error.message
            });
        }
    }
}

module.exports = new SettingsController();