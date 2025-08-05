import styled, { createGlobalStyle } from 'styled-components';

// Global styles
export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all 0.2s ease;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
    border: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .react-datepicker-wrapper {
    width: 100%;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textSecondary};
  }
`;

// Theme definitions
export const lightTheme = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    secondary: '#64748b',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    
    surface: '#ffffff',
    surfaceHover: '#f8fafc',
    
    text: '#1e293b',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    
    border: '#e2e8f0',
    borderHover: '#cbd5e1',
    
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowLg: 'rgba(0, 0, 0, 0.15)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    
    surface: '#1e293b',
    surfaceHover: '#334155',
    
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    
    border: '#334155',
    borderHover: '#475569',
    
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowLg: 'rgba(0, 0, 0, 0.4)',
  },
};

// Common styled components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};

  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0 ${props => props.theme.spacing.lg};
  }
`;

export const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: 0 1px 3px ${props => props.theme.colors.shadow};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px ${props => props.theme.colors.shadowLg};
  }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 40px;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primaryHover};
          }
        `;
      case 'secondary':
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.text};
          border: 1px solid ${props.theme.colors.border};
          &:hover:not(:disabled) {
            background: ${props.theme.colors.backgroundTertiary};
          }
        `;
      case 'danger':
        return `
          background: ${props.theme.colors.danger};
          color: white;
          &:hover:not(:disabled) {
            background: #dc2626;
          }
        `;
      case 'success':
        return `
          background: ${props.theme.colors.success};
          color: white;
          &:hover:not(:disabled) {
            background: #059669;
          }
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundSecondary};
          color: ${props.theme.colors.text};
          &:hover:not(:disabled) {
            background: ${props.theme.colors.backgroundTertiary};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${props => props.size === 'sm' && `
    padding: ${props.theme.spacing.xs} ${props.theme.spacing.md};
    font-size: ${props.theme.fontSize.xs};
    min-height: 32px;
  `}

  ${props => props.size === 'lg' && `
    padding: ${props.theme.spacing.md} ${props.theme.spacing.xl};
    font-size: ${props.theme.fontSize.md};
    min-height: 48px;
  `}

  ${props => props.fullWidth && `
    width: 100%;
  `}
`;

export const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.fontSize.sm};
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: ${props => props.theme.fontSize.sm};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

export const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

export const Grid = styled.div`
  display: grid;
  gap: ${props => props.gap || props.theme.spacing.lg};
  
  ${props => props.cols && `
    grid-template-columns: repeat(${props.cols}, 1fr);
  `}

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || props.theme.spacing.md};
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};

  ${props => props.fullWidth && 'width: 100%;'}
`;

export const Text = styled.span`
  font-size: ${props => {
    switch (props.size) {
      case 'xs': return props.theme.fontSize.xs;
      case 'sm': return props.theme.fontSize.sm;
      case 'lg': return props.theme.fontSize.lg;
      case 'xl': return props.theme.fontSize.xl;
      case 'xxl': return props.theme.fontSize.xxl;
      default: return props.theme.fontSize.md;
    }
  }};
  
  font-weight: ${props => {
    switch (props.weight) {
      case 'medium': return props.theme.fontWeight.medium;
      case 'semibold': return props.theme.fontWeight.semibold;
      case 'bold': return props.theme.fontWeight.bold;
      default: return props.theme.fontWeight.normal;
    }
  }};

  color: ${props => {
    switch (props.color) {
      case 'secondary': return props.theme.colors.textSecondary;
      case 'tertiary': return props.theme.colors.textTertiary;
      case 'primary': return props.theme.colors.primary;
      case 'success': return props.theme.colors.success;
      case 'danger': return props.theme.colors.danger;
      case 'warning': return props.theme.colors.warning;
      default: return props.theme.colors.text;
    }
  }};

  ${props => props.truncate && `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.medium};
  border-radius: ${props => props.theme.borderRadius.sm};
  
  ${props => {
    switch (props.variant) {
      case 'success':
        return `
          background: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
        `;
      case 'danger':
        return `
          background: ${props.theme.colors.danger}20;
          color: ${props.theme.colors.danger};
        `;
      case 'warning':
        return `
          background: ${props.theme.colors.warning}20;
          color: ${props.theme.colors.warning};
        `;
      case 'info':
        return `
          background: ${props.theme.colors.info}20;
          color: ${props.theme.colors.info};
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundTertiary};
          color: ${props.theme.colors.textSecondary};
        `;
    }
  }}
`;

export const LoadingSpinner = styled.div`
  width: ${props => props.size || '24px'};
  height: ${props => props.size || '24px'};
  border: 2px solid ${props => props.theme.colors.border};
  border-top: 2px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default {
  GlobalStyles,
  lightTheme,
  darkTheme,
  Container,
  Card,
  Button,
  Input,
  Select,
  Label,
  FormGroup,
  Grid,
  Flex,
  Text,
  Badge,
  LoadingSpinner,
};