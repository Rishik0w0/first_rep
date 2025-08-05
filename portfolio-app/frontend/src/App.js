import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppProvider, useApp } from './context/AppContext';
import { GlobalStyles, lightTheme, darkTheme } from './styles/GlobalStyles';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Assets from './pages/Assets';
import Settings from './pages/Settings';

// Theme wrapper component to access context
const ThemedApp = () => {
  const { state } = useApp();
  const theme = state.settings.theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          
          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={state.settings.theme === 'dark' ? 'dark' : 'light'}
            toastStyle={{
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
};

// Main App component with providers
const App = () => {
  return (
    <AppProvider>
      <ThemedApp />
    </AppProvider>
  );
};

export default App;