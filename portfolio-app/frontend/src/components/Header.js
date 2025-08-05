import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiSettings, FiMenu, FiSun, FiMoon, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { Flex, Text, Button } from '../styles/GlobalStyles';

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 0 ${props => props.theme.spacing.lg};
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px ${props => props.theme.colors.shadow};
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.colors.primaryHover};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.fontWeight.medium};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textSecondary};
  background: ${props => props.active ? props.theme.colors.primary + '10' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary + '10'};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const ModeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.border};
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.medium};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.textSecondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.backgroundTertiary};
  }
`;

const ProfileSection = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundTertiary};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 4px 12px ${props => props.theme.colors.shadowLg};
  min-width: 200px;
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transform: translateY(${props => props.show ? '0' : '-10px'});
  transition: all 0.2s ease;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &:first-child {
    border-radius: ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg};
  }
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.backgroundTertiary};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.text};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: flex;
  }
`;

const Header = () => {
  const { state, actions } = useApp();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/assets', label: 'Assets' },
  ];

  const handleModeToggle = (mode) => {
    actions.setMode(mode);
  };

  const handleThemeToggle = () => {
    actions.setTheme(state.settings.theme === 'light' ? 'dark' : 'light');
  };

  return (
    <HeaderContainer>
      <Flex align="center" gap="2rem">
        <Logo to="/">
          📊 Portfolio Manager
        </Logo>
        
        <Nav>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              active={location.pathname === item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </Nav>
      </Flex>

      <RightSection>
        {/* Normal/Pro Mode Toggle */}
        <ModeToggle>
          <ToggleButton
            active={state.settings.mode === 'normal'}
            onClick={() => handleModeToggle('normal')}
          >
            Normal
          </ToggleButton>
          <ToggleButton
            active={state.settings.mode === 'pro'}
            onClick={() => handleModeToggle('pro')}
          >
            <FiToggleRight size={16} />
            Pro
          </ToggleButton>
        </ModeToggle>

        {/* Theme Toggle */}
        <ThemeToggle onClick={handleThemeToggle}>
          {state.settings.theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
        </ThemeToggle>

        {/* Profile Dropdown */}
        <ProfileSection>
          <ProfileButton
            onClick={() => setShowDropdown(!showDropdown)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          >
            <FiUser size={18} />
          </ProfileButton>
          
          <DropdownMenu show={showDropdown}>
            <DropdownItem to="/settings">
              <FiSettings size={16} />
              Settings
            </DropdownItem>
          </DropdownMenu>
        </ProfileSection>

        {/* Mobile Menu Button */}
        <MobileMenuButton onClick={actions.toggleSidebar}>
          <FiMenu size={18} />
        </MobileMenuButton>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;