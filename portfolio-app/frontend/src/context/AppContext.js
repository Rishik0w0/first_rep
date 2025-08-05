import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  portfolio: {
    holdings: [],
    totalValue: 0,
    totalCost: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0,
    loading: false,
    error: null,
  },
  settings: {
    mode: 'normal', // 'normal' or 'pro'
    theme: 'light', // 'light' or 'dark'
    currency: 'USD',
  },
  ui: {
    sidebarOpen: false,
    currentPage: 'dashboard',
  },
};

// Action types
export const actionTypes = {
  // Portfolio actions
  SET_PORTFOLIO_LOADING: 'SET_PORTFOLIO_LOADING',
  SET_PORTFOLIO_DATA: 'SET_PORTFOLIO_DATA',
  SET_PORTFOLIO_ERROR: 'SET_PORTFOLIO_ERROR',
  ADD_STOCK_TO_PORTFOLIO: 'ADD_STOCK_TO_PORTFOLIO',
  UPDATE_STOCK_IN_PORTFOLIO: 'UPDATE_STOCK_IN_PORTFOLIO',
  REMOVE_STOCK_FROM_PORTFOLIO: 'REMOVE_STOCK_FROM_PORTFOLIO',
  
  // Settings actions
  SET_MODE: 'SET_MODE',
  SET_THEME: 'SET_THEME',
  SET_CURRENCY: 'SET_CURRENCY',
  
  // UI actions
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_PORTFOLIO_LOADING:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          loading: action.payload,
        },
      };

    case actionTypes.SET_PORTFOLIO_DATA:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          ...action.payload,
          loading: false,
          error: null,
        },
      };

    case actionTypes.SET_PORTFOLIO_ERROR:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          error: action.payload,
          loading: false,
        },
      };

    case actionTypes.ADD_STOCK_TO_PORTFOLIO:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          holdings: [...state.portfolio.holdings, action.payload],
        },
      };

    case actionTypes.UPDATE_STOCK_IN_PORTFOLIO:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          holdings: state.portfolio.holdings.map(stock =>
            stock.id === action.payload.id ? { ...stock, ...action.payload } : stock
          ),
        },
      };

    case actionTypes.REMOVE_STOCK_FROM_PORTFOLIO:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          holdings: state.portfolio.holdings.filter(stock => stock.id !== action.payload),
        },
      };

    case actionTypes.SET_MODE:
      return {
        ...state,
        settings: {
          ...state.settings,
          mode: action.payload,
        },
      };

    case actionTypes.SET_THEME:
      return {
        ...state,
        settings: {
          ...state.settings,
          theme: action.payload,
        },
      };

    case actionTypes.SET_CURRENCY:
      return {
        ...state,
        settings: {
          ...state.settings,
          currency: action.payload,
        },
      };

    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarOpen: !state.ui.sidebarOpen,
        },
      };

    case actionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        ui: {
          ...state.ui,
          currentPage: action.payload,
        },
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('portfolioSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        Object.keys(settings).forEach(key => {
          if (key === 'mode') {
            dispatch({ type: actionTypes.SET_MODE, payload: settings[key] });
          } else if (key === 'theme') {
            dispatch({ type: actionTypes.SET_THEME, payload: settings[key] });
          } else if (key === 'currency') {
            dispatch({ type: actionTypes.SET_CURRENCY, payload: settings[key] });
          }
        });
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('portfolioSettings', JSON.stringify(state.settings));
  }, [state.settings]);

  // Action creators
  const actions = {
    // Portfolio actions
    setPortfolioLoading: (loading) => 
      dispatch({ type: actionTypes.SET_PORTFOLIO_LOADING, payload: loading }),
    
    setPortfolioData: (data) => 
      dispatch({ type: actionTypes.SET_PORTFOLIO_DATA, payload: data }),
    
    setPortfolioError: (error) => 
      dispatch({ type: actionTypes.SET_PORTFOLIO_ERROR, payload: error }),
    
    addStockToPortfolio: (stock) => 
      dispatch({ type: actionTypes.ADD_STOCK_TO_PORTFOLIO, payload: stock }),
    
    updateStockInPortfolio: (stock) => 
      dispatch({ type: actionTypes.UPDATE_STOCK_IN_PORTFOLIO, payload: stock }),
    
    removeStockFromPortfolio: (stockId) => 
      dispatch({ type: actionTypes.REMOVE_STOCK_FROM_PORTFOLIO, payload: stockId }),

    // Settings actions
    setMode: (mode) => 
      dispatch({ type: actionTypes.SET_MODE, payload: mode }),
    
    setTheme: (theme) => 
      dispatch({ type: actionTypes.SET_THEME, payload: theme }),
    
    setCurrency: (currency) => 
      dispatch({ type: actionTypes.SET_CURRENCY, payload: currency }),

    // UI actions
    toggleSidebar: () => 
      dispatch({ type: actionTypes.TOGGLE_SIDEBAR }),
    
    setCurrentPage: (page) => 
      dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: page }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;