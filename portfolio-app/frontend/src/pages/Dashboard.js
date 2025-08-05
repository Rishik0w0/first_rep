import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiPlus, FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { stockAPI, portfolioAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  Container, 
  Card, 
  Button, 
  Input, 
  Grid, 
  Flex, 
  Text, 
  Badge, 
  LoadingSpinner,
  FormGroup,
  Label
} from '../styles/GlobalStyles';

const DashboardContainer = styled.div`
  padding: ${props => props.theme.spacing.xl} 0;
  min-height: calc(100vh - 64px);
`;

const SearchSection = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const SearchInput = styled(Input)`
  padding-left: 3rem;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textTertiary};
`;

const SearchInputWrapper = styled.div`
  position: relative;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SearchResult = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.colors.shadowLg};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const StatCard = styled(Card)`
  text-align: center;
  background: linear-gradient(135deg, ${props => props.color}10, ${props => props.color}05);
  border-color: ${props => props.color}20;
`;

const StatIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.color}20;
  color: ${props => props.color};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const BuyModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 500px;
  margin: ${props => props.theme.spacing.lg};
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.lg};
  padding-bottom: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  &:hover {
    background: ${props => props.theme.colors.backgroundTertiary};
  }
`;

const Dashboard = () => {
  const { state, actions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [buyForm, setBuyForm] = useState({
    quantity: '',
    buyPrice: '',
    buyDate: new Date().toISOString().split('T')[0]
  });
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0,
    holdingsCount: 0
  });

  // Load portfolio stats on component mount
  useEffect(() => {
    loadPortfolioStats();
  }, []);

  const loadPortfolioStats = async () => {
    try {
      const data = await portfolioAPI.getPortfolio();
      setPortfolioStats({
        totalValue: data.totalValue || 0,
        totalGainLoss: data.totalGainLoss || 0,
        totalGainLossPercent: data.totalGainLossPercent || 0,
        holdingsCount: data.holdings?.length || 0
      });
    } catch (error) {
      console.error('Error loading portfolio stats:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    try {
      const result = await stockAPI.searchStock(searchQuery.trim());
      setSearchResult(result);
      toast.success(`Found ${result.symbol}`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error(error.response?.data?.error || 'Failed to search stock');
      setSearchResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = (stock) => {
    setSelectedStock(stock);
    setBuyForm({
      quantity: '',
      buyPrice: stock.currentPrice?.toString() || '',
      buyDate: new Date().toISOString().split('T')[0]
    });
    setShowBuyModal(true);
  };

  const handleBuySubmit = async (e) => {
    e.preventDefault();
    
    if (!buyForm.quantity || !buyForm.buyPrice || !buyForm.buyDate) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isNaN(buyForm.quantity) || isNaN(buyForm.buyPrice) || 
        parseFloat(buyForm.quantity) <= 0 || parseFloat(buyForm.buyPrice) <= 0) {
      toast.error('Quantity and price must be positive numbers');
      return;
    }

    setLoading(true);
    try {
      await portfolioAPI.addStock({
        symbol: selectedStock.symbol,
        quantity: parseInt(buyForm.quantity),
        buyPrice: parseFloat(buyForm.buyPrice),
        buyDate: buyForm.buyDate
      });

      toast.success(`Added ${buyForm.quantity} shares of ${selectedStock.symbol} to portfolio`);
      setShowBuyModal(false);
      loadPortfolioStats(); // Refresh stats
      
      // Reset form
      setBuyForm({
        quantity: '',
        buyPrice: '',
        buyDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Buy error:', error);
      toast.error(error.response?.data?.error || 'Failed to add stock to portfolio');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.settings.currency
    }).format(value || 0);
  };

  const formatPercent = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${(value || 0).toFixed(2)}%`;
  };

  return (
    <DashboardContainer>
      <Container>
        {/* Header */}
        <Flex justify="space-between" align="center" style={{ marginBottom: '2rem' }}>
          <div>
            <Text size="xxl" weight="bold">Dashboard</Text>
            <Text color="secondary">Search and buy stocks for your portfolio</Text>
          </div>
        </Flex>

        {/* Portfolio Stats */}
        <StatsGrid>
          <StatCard color="#10b981">
            <StatIcon color="#10b981">
              <FiDollarSign size={24} />
            </StatIcon>
            <Text size="lg" weight="semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Total Value
            </Text>
            <Text size="xl" weight="bold" color="success">
              {formatCurrency(portfolioStats.totalValue)}
            </Text>
          </StatCard>

          <StatCard color={portfolioStats.totalGainLoss >= 0 ? '#10b981' : '#ef4444'}>
            <StatIcon color={portfolioStats.totalGainLoss >= 0 ? '#10b981' : '#ef4444'}>
              {portfolioStats.totalGainLoss >= 0 ? 
                <FiTrendingUp size={24} /> : 
                <FiTrendingDown size={24} />
              }
            </StatIcon>
            <Text size="lg" weight="semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Total Gain/Loss
            </Text>
            <Text 
              size="xl" 
              weight="bold" 
              color={portfolioStats.totalGainLoss >= 0 ? 'success' : 'danger'}
            >
              {formatCurrency(portfolioStats.totalGainLoss)}
            </Text>
            <Text 
              size="sm" 
              color={portfolioStats.totalGainLoss >= 0 ? 'success' : 'danger'}
            >
              {formatPercent(portfolioStats.totalGainLossPercent)}
            </Text>
          </StatCard>

          <StatCard color="#3b82f6">
            <StatIcon color="#3b82f6">
              <FiActivity size={24} />
            </StatIcon>
            <Text size="lg" weight="semibold" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Holdings
            </Text>
            <Text size="xl" weight="bold" color="primary">
              {portfolioStats.holdingsCount}
            </Text>
            <Text size="sm" color="secondary">
              Stocks
            </Text>
          </StatCard>
        </StatsGrid>

        {/* Stock Search */}
        <SearchSection>
          <Text size="lg" weight="semibold" style={{ marginBottom: '1rem' }}>
            Search Stocks
          </Text>
          
          <form onSubmit={handleSearch}>
            <SearchInputWrapper>
              <SearchIcon>
                <FiSearch size={18} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL, GOOGL, MSFT)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                disabled={loading}
              />
            </SearchInputWrapper>
            
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading || !searchQuery.trim()}
              fullWidth
            >
              {loading ? <LoadingSpinner size="20px" /> : <FiSearch size={18} />}
              {loading ? 'Searching...' : 'Search Stock'}
            </Button>
          </form>

          {/* Search Result */}
          {searchResult && (
            <SearchResult onClick={() => handleBuyClick(searchResult)}>
              <Flex justify="space-between" align="center">
                <div>
                  <Text size="lg" weight="semibold">
                    {searchResult.symbol}
                  </Text>
                  <Text color="secondary" size="sm">
                    {searchResult.name || searchResult.symbol}
                  </Text>
                  <Text color="tertiary" size="xs">
                    Last updated: {searchResult.lastUpdated}
                  </Text>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <Text size="xl" weight="bold">
                    {formatCurrency(searchResult.currentPrice)}
                  </Text>
                  {searchResult.change !== undefined && (
                    <Badge 
                      variant={searchResult.change >= 0 ? 'success' : 'danger'}
                    >
                      {searchResult.change >= 0 ? '+' : ''}
                      {formatCurrency(searchResult.change)} 
                      ({searchResult.changePercent})
                    </Badge>
                  )}
                  <div style={{ marginTop: '0.5rem' }}>
                    <Button variant="primary" size="sm">
                      <FiPlus size={16} />
                      Buy Stock
                    </Button>
                  </div>
                </div>
              </Flex>
            </SearchResult>
          )}
        </SearchSection>

        {/* Buy Modal */}
        <BuyModal show={showBuyModal}>
          <ModalContent>
            <ModalHeader>
              <Text size="lg" weight="semibold">
                Buy {selectedStock?.symbol}
              </Text>
              <CloseButton onClick={() => setShowBuyModal(false)}>
                ×
              </CloseButton>
            </ModalHeader>

            {selectedStock && (
              <form onSubmit={handleBuySubmit}>
                <Flex direction="column" gap="1rem" style={{ marginBottom: '1.5rem' }}>
                  <div>
                    <Text weight="medium">{selectedStock.symbol}</Text>
                    <Text size="sm" color="secondary">
                      Current Price: {formatCurrency(selectedStock.currentPrice)}
                    </Text>
                  </div>
                </Flex>

                <FormGroup>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Enter number of shares"
                    value={buyForm.quantity}
                    onChange={(e) => setBuyForm({...buyForm, quantity: e.target.value})}
                    min="1"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Buy Price per Share</Label>
                  <Input
                    type="number"
                    placeholder="Enter buy price"
                    value={buyForm.buyPrice}
                    onChange={(e) => setBuyForm({...buyForm, buyPrice: e.target.value})}
                    step="0.01"
                    min="0.01"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Buy Date</Label>
                  <Input
                    type="date"
                    value={buyForm.buyDate}
                    onChange={(e) => setBuyForm({...buyForm, buyDate: e.target.value})}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                </FormGroup>

                {buyForm.quantity && buyForm.buyPrice && (
                  <Card style={{ marginBottom: '1.5rem', background: '#f8fafc' }}>
                    <Text size="sm" color="secondary">Total Cost</Text>
                    <Text size="lg" weight="bold">
                      {formatCurrency(parseFloat(buyForm.quantity || 0) * parseFloat(buyForm.buyPrice || 0))}
                    </Text>
                  </Card>
                )}

                <Flex gap="1rem">
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={() => setShowBuyModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="success"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinner size="20px" /> : <FiPlus size={18} />}
                    {loading ? 'Adding...' : 'Add to Portfolio'}
                  </Button>
                </Flex>
              </form>
            )}
          </ModalContent>
        </BuyModal>
      </Container>
    </DashboardContainer>
  );
};

export default Dashboard;