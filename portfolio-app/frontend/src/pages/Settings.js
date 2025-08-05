import React from 'react';
import styled from 'styled-components';
import { FiSun, FiMoon, FiDollarSign, FiToggleLeft, FiToggleRight, FiSettings as FiSettingsIcon } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useApp } from '../context/AppContext';
import { 
  Container, 
  Card, 
  Button, 
  Select, 
  Grid, 
  Flex, 
  Text,
  FormGroup,
  Label
} from '../styles/GlobalStyles';

const SettingsContainer = styled.div`
  padding: ${props => props.theme.spacing.xl} 0;
  min-height: calc(100vh - 64px);
`;

const SettingsCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingControl = styled.div`
  margin-left: ${props => props.theme.spacing.lg};
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeight.medium};
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.backgroundSecondary};
  color: ${props => props.active ? 'white' : props.theme.colors.textSecondary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.backgroundTertiary};
    border-color: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.borderHover};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.color}20;
  color: ${props => props.color};
  margin-right: ${props => props.theme.spacing.lg};
`;

const PreviewCard = styled(Card)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}10, ${props => props.theme.colors.primary}05);
  border-color: ${props => props.theme.colors.primary}20;
  margin-top: ${props => props.theme.spacing.lg};
`;

const Settings = () => {
  const { state, actions } = useApp();

  const handleThemeChange = (theme) => {
    actions.setTheme(theme);
    toast.success(`Switched to ${theme} theme`);
  };

  const handleModeChange = (mode) => {
    actions.setMode(mode);
    toast.success(`Switched to ${mode} mode`);
  };

  const handleCurrencyChange = (e) => {
    const currency = e.target.value;
    actions.setCurrency(currency);
    toast.success(`Currency changed to ${currency}`);
  };

  const formatCurrency = (value, currency = state.settings.currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  ];

  return (
    <SettingsContainer>
      <Container>
        {/* Header */}
        <Flex justify="center" align="center" direction="column" style={{ marginBottom: '3rem' }}>
          <Text size="xxl" weight="bold" style={{ marginBottom: '0.5rem' }}>
            Settings
          </Text>
          <Text color="secondary" style={{ textAlign: 'center' }}>
            Customize your portfolio management experience
          </Text>
        </Flex>

        {/* Settings Card */}
        <SettingsCard>
          <Text size="lg" weight="semibold" style={{ marginBottom: '1.5rem' }}>
            Preferences
          </Text>

          {/* Theme Setting */}
          <SettingRow>
            <Flex align="center">
              <IconWrapper color={state.settings.theme === 'dark' ? '#3b82f6' : '#f59e0b'}>
                {state.settings.theme === 'dark' ? <FiMoon size={24} /> : <FiSun size={24} />}
              </IconWrapper>
              <SettingInfo>
                <Text weight="semibold">Theme</Text>
                <Text size="sm" color="secondary">
                  Choose between light and dark mode for better viewing experience
                </Text>
              </SettingInfo>
            </Flex>
            <SettingControl>
              <Flex gap="0.5rem">
                <ToggleButton
                  active={state.settings.theme === 'light'}
                  onClick={() => handleThemeChange('light')}
                >
                  <FiSun size={16} />
                  Light
                </ToggleButton>
                <ToggleButton
                  active={state.settings.theme === 'dark'}
                  onClick={() => handleThemeChange('dark')}
                >
                  <FiMoon size={16} />
                  Dark
                </ToggleButton>
              </Flex>
            </SettingControl>
          </SettingRow>

          {/* Mode Setting */}
          <SettingRow>
            <Flex align="center">
              <IconWrapper color="#10b981">
                <FiToggleRight size={24} />
              </IconWrapper>
              <SettingInfo>
                <Text weight="semibold">Display Mode</Text>
                <Text size="sm" color="secondary">
                  Normal mode shows essential information, Pro mode includes advanced analytics and charts
                </Text>
              </SettingInfo>
            </Flex>
            <SettingControl>
              <Flex gap="0.5rem">
                <ToggleButton
                  active={state.settings.mode === 'normal'}
                  onClick={() => handleModeChange('normal')}
                >
                  Normal
                </ToggleButton>
                <ToggleButton
                  active={state.settings.mode === 'pro'}
                  onClick={() => handleModeChange('pro')}
                >
                  <FiToggleRight size={16} />
                  Pro
                </ToggleButton>
              </Flex>
            </SettingControl>
          </SettingRow>

          {/* Currency Setting */}
          <SettingRow>
            <Flex align="center">
              <IconWrapper color="#6366f1">
                <FiDollarSign size={24} />
              </IconWrapper>
              <SettingInfo>
                <Text weight="semibold">Currency</Text>
                <Text size="sm" color="secondary">
                  Select your preferred currency for displaying portfolio values
                </Text>
              </SettingInfo>
            </Flex>
            <SettingControl>
              <Select
                value={state.settings.currency}
                onChange={handleCurrencyChange}
                style={{ minWidth: '150px' }}
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
                  </option>
                ))}
              </Select>
            </SettingControl>
          </SettingRow>

          {/* Preview */}
          <PreviewCard>
            <Text weight="semibold" style={{ marginBottom: '1rem' }}>
              Preview
            </Text>
            <Grid cols={3}>
              <div>
                <Text size="sm" color="secondary">Sample Portfolio Value</Text>
                <Text size="lg" weight="bold" color="success">
                  {formatCurrency(125750.50)}
                </Text>
              </div>
              <div>
                <Text size="sm" color="secondary">Theme</Text>
                <Text weight="medium" style={{ textTransform: 'capitalize' }}>
                  {state.settings.theme}
                </Text>
              </div>
              <div>
                <Text size="sm" color="secondary">Mode</Text>
                <Text weight="medium" style={{ textTransform: 'capitalize' }}>
                  {state.settings.mode}
                </Text>
              </div>
            </Grid>
          </PreviewCard>
        </SettingsCard>

        {/* Additional Information */}
        <Card style={{ maxWidth: '800px', margin: '2rem auto 0' }}>
          <Text size="lg" weight="semibold" style={{ marginBottom: '1rem' }}>
            About Portfolio Manager
          </Text>
          
          <Grid cols={2} gap="2rem">
            <div>
              <Text weight="semibold" style={{ marginBottom: '0.5rem' }}>
                Features
              </Text>
              <ul style={{ paddingLeft: '1rem', color: state.settings.theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                <li style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  Real-time stock price tracking
                </li>
                <li style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  Portfolio performance analytics
                </li>
                <li style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  Historical data visualization
                </li>
                <li style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  Manual asset entry
                </li>
                <li style={{ fontSize: '0.875rem' }}>
                  Gain/loss calculations
                </li>
              </ul>
            </div>
            
            <div>
              <Text weight="semibold" style={{ marginBottom: '0.5rem' }}>
                Data Sources
              </Text>
              <ul style={{ paddingLeft: '1rem', color: state.settings.theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                <li style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  Alpha Vantage API for stock prices
                </li>
                <li style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  Real-time market data
                </li>
                <li style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  Historical price information
                </li>
                <li style={{ fontSize: '0.875rem' }}>
                  Secure local data storage
                </li>
              </ul>
            </div>
          </Grid>

          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: state.settings.theme === 'dark' ? '#1e293b' : '#f8fafc', 
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <Text size="sm" color="secondary">
              Portfolio Manager v1.0.0 • Built with React, Node.js, and MySQL
            </Text>
          </div>
        </Card>
      </Container>
    </SettingsContainer>
  );
};

export default Settings;