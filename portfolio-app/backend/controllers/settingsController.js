const { pool } = require('../config/database');

class SettingsController {
    /**
     * Get all user settings
     * GET /api/settings
     */
    async getSettings(req, res) {
        try {
            const [rows] = await pool.execute(
                'SELECT setting_key, setting_value FROM user_settings'
            );

            // Convert to object format
            const settings = {};
            rows.forEach(row => {
                let value = row.setting_value;
                
                // Parse boolean values
                if (value === 'true') value = true;
                else if (value === 'false') value = false;
                // Parse numeric values
                else if (!isNaN(value) && value !== '') value = parseFloat(value);
                
                settings[row.setting_key] = value;
            });

            res.json({
                success: true,
                data: settings
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

            // Convert value to string for storage
            const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

            // Update or insert setting
            await pool.execute(`
                INSERT INTO user_settings (setting_key, setting_value) 
                VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE 
                setting_value = VALUES(setting_value), 
                updated_at = CURRENT_TIMESTAMP
            `, [key, stringValue]);

            res.json({
                success: true,
                data: {
                    key,
                    value
                },
                message: 'Setting updated successfully'
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

            const connection = await pool.getConnection();
            
            try {
                await connection.beginTransaction();

                // Update each setting
                for (const [key, value] of Object.entries(settings)) {
                    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                    
                    await connection.execute(`
                        INSERT INTO user_settings (setting_key, setting_value) 
                        VALUES (?, ?) 
                        ON DUPLICATE KEY UPDATE 
                        setting_value = VALUES(setting_value), 
                        updated_at = CURRENT_TIMESTAMP
                    `, [key, stringValue]);
                }

                await connection.commit();

                res.json({
                    success: true,
                    data: settings,
                    message: 'Settings updated successfully'
                });
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
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

            const connection = await pool.getConnection();
            
            try {
                await connection.beginTransaction();

                // Clear existing settings
                await connection.execute('DELETE FROM user_settings');

                // Insert default settings
                for (const [key, value] of defaultSettings) {
                    await connection.execute(
                        'INSERT INTO user_settings (setting_key, setting_value) VALUES (?, ?)',
                        [key, value]
                    );
                }

                await connection.commit();

                res.json({
                    success: true,
                    message: 'Settings reset to default values'
                });
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
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

            const [rows] = await pool.execute(
                'SELECT setting_value FROM user_settings WHERE setting_key = ?',
                [key]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    error: 'Setting not found'
                });
            }

            let value = rows[0].setting_value;
            
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