import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiEdit, FiTrash2, FiTrendingUp, FiTrendingDown, FiRefreshCw, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { portfolioAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import PortfolioChart from '../components/PortfolioChart';
import { 
  Container, 
  Card, 
  Button, 
  Grid, 
  Flex, 
  Text, 
  Badge, 
  LoadingSpinner,
  Input,
  FormGroup,
  Label
} from '../styles/GlobalStyles';

const PortfolioContainer = styled.div`
  padding: ${props => props.theme.spacing.xl} 0;
  min-height: calc(100vh - 64px);
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${props => props.theme.colors.surface};
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.backgroundSecondary};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
  text-align: ${props => props.align || 'left'};
  font-size: ${props => props.theme.fontSize.sm};
  
  &:first-child {
    padding-left: ${props => props.theme.spacing.lg};
  }
  
  &:last-child {
    padding-right: ${props => props.theme.spacing.lg};
  }
`;

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.md};
  text-align: ${props => props.align || 'left'};
  font-weight: ${props => props.theme.fontWeight.semibold};
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  
  &:first-child {
    padding-left: ${props => props.theme.spacing.lg};
  }
  
  &:last-child {
    padding-right: ${props => props.theme.spacing.lg};
  }
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.backgroundSecondary};
  color: ${props => props.theme.colors.textSecondary};
  margin-right: ${props => props.theme.spacing.xs};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'danger' ? props.theme.colors.danger : props.theme.colors.backgroundTertiary};
    color: ${props => props.variant === 'danger' ? 'white' : props.theme.colors.text};
  }

  &:last-child {
    margin-right: 0;
  }
`;

const SummaryCard = styled(Card)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}10, ${props => props.theme.colors.primary}05);
  border-color: ${props => props.theme.colors.primary}20;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xxl};
  color: ${props => props.theme.colors.textSecondary};
`;

const Modal = styled.div`
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

const Portfolio = () => {
  const { state, actions } = useApp();
  const [portfolio, setPortfolio] = useState({
    holdings: [],
    totalValue: 0,
    totalCost: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [editForm, setEditForm] = useState({
    quantity: '',
    buyPrice: ''
  });

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const data = await portfolioAPI.getPortfolio();
      setPortfolio(data);
      actions.setPortfolioData(data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      toast.error('Failed to load portfolio');
      actions.setPortfolioError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadPortfolio();
      toast.success('Portfolio refreshed');
    } catch (error) {
      toast.error('Failed to refresh portfolio');
    } finally {
      setRefreshing(false);
    }
  };

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setEditForm({
      quantity: stock.quantity.toString(),
      buyPrice: stock.buyPrice.toString()
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editForm.quantity || !editForm.buyPrice) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isNaN(editForm.quantity) || isNaN(editForm.buyPrice) || 
        parseFloat(editForm.quantity) <= 0 || parseFloat(editForm.buyPrice) <= 0) {
      toast.error('Quantity and price must be positive numbers');
      return;
    }

    try {
      setLoading(true);
      await portfolioAPI.updateStock(editingStock.id, {
        quantity: parseInt(editForm.quantity),
        buyPrice: parseFloat(editForm.buyPrice)
      });

      toast.success(`Updated ${editingStock.symbol}`);
      setShowEditModal(false);
      loadPortfolio();
    } catch (error) {
      console.error('Edit error:', error);
      toast.error(error.response?.data?.error || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (stock) => {
    if (!window.confirm(`Are you sure you want to remove ${stock.symbol} from your portfolio?`)) {
      return;
    }

    try {
      await portfolioAPI.deleteStock(stock.id);
      toast.success(`Removed ${stock.symbol} from portfolio`);
      loadPortfolio();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.error || 'Failed to remove stock');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && !refreshing) {
    return (
      <PortfolioContainer>
        <Container>
          <Flex justify="center" align="center" style={{ minHeight: '400px' }}>
            <LoadingSpinner size="48px" />
          </Flex>
        </Container>
      </PortfolioContainer>
    );
  }

  return (
    <PortfolioContainer>
      <Container>
        {/* Header */}
        <Flex justify="space-between" align="center" style={{ marginBottom: '2rem' }}>
          <div>
            <Text size="xxl" weight="bold">Portfolio</Text>
            <Text color="secondary">Track your investments and performance</Text>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? <LoadingSpinner size="16px" /> : <FiRefreshCw size={16} />}
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Flex>

        {/* Portfolio Summary */}
        <SummaryCard>
          <Grid cols={state.settings.mode === 'pro' ? 4 : 3}>
            <div>
              <Text size="sm" color="secondary">Total Value</Text>
              <Text size="xl" weight="bold">
                {formatCurrency(portfolio.totalValue)}
              </Text>
            </div>
            <div>
              <Text size="sm" color="secondary">Total Cost</Text>
              <Text size="lg" weight="semibold">
                {formatCurrency(portfolio.totalCost)}
              </Text>
            </div>
            <div>
              <Text size="sm" color="secondary">Gain/Loss</Text>
              <Text 
                size="lg" 
                weight="semibold"
                color={portfolio.totalGainLoss >= 0 ? 'success' : 'danger'}
              >
                {formatCurrency(portfolio.totalGainLoss)}
              </Text>
              <Text 
                size="sm"
                color={portfolio.totalGainLoss >= 0 ? 'success' : 'danger'}
              >
                {formatPercent(portfolio.totalGainLossPercent)}
              </Text>
            </div>
            {state.settings.mode === 'pro' && (
              <div>
                <Text size="sm" color="secondary">Holdings</Text>
                <Text size="lg" weight="semibold">
                  {portfolio.holdings.length}
                </Text>
                <Text size="sm" color="secondary">Stocks</Text>
              </div>
            )}
          </Grid>
        </SummaryCard>

        {/* Chart - Pro Mode Only */}
        {state.settings.mode === 'pro' && (
          <Card style={{ marginBottom: '2rem' }}>
            <PortfolioChart />
          </Card>
        )}

        {/* Holdings Table */}
        <Card>
          <Flex justify="space-between" align="center" style={{ marginBottom: '1.5rem' }}>
            <Text size="lg" weight="semibold">Holdings</Text>
            <Text size="sm" color="secondary">
              {portfolio.holdings.length} stocks
            </Text>
          </Flex>

          {portfolio.holdings.length === 0 ? (
            <EmptyState>
              <Text size="lg" color="secondary">No holdings yet</Text>
              <Text size="sm" color="tertiary" style={{ marginTop: '0.5rem' }}>
                Start by searching and buying stocks from the Dashboard
              </Text>
            </EmptyState>
          ) : (
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>Stock</TableHeaderCell>
                    <TableHeaderCell align="right">Quantity</TableHeaderCell>
                    <TableHeaderCell align="right">Buy Price</TableHeaderCell>
                    <TableHeaderCell align="right">Current Price</TableHeaderCell>
                    <TableHeaderCell align="right">Value</TableHeaderCell>
                    <TableHeaderCell align="right">Gain/Loss</TableHeaderCell>
                    {state.settings.mode === 'pro' && (
                      <TableHeaderCell align="right">Buy Date</TableHeaderCell>
                    )}
                    <TableHeaderCell align="center">Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {portfolio.holdings.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell>
                        <Text weight="semibold">{stock.symbol}</Text>
                        {stock.currentPrice && (
                          <Text size="xs" color="tertiary">
                            Last updated: {new Date(stock.lastUpdated).toLocaleTimeString()}
                          </Text>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {stock.quantity.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(stock.buyPrice)}
                      </TableCell>
                      <TableCell align="right">
                        {stock.currentPrice ? formatCurrency(stock.currentPrice) : 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {stock.currentValue ? formatCurrency(stock.currentValue) : 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {stock.gainLoss !== null ? (
                          <div>
                            <Text color={stock.gainLoss >= 0 ? 'success' : 'danger'}>
                              {formatCurrency(stock.gainLoss)}
                            </Text>
                            {stock.gainLossPercent !== null && (
                              <Badge 
                                variant={stock.gainLoss >= 0 ? 'success' : 'danger'}
                                style={{ marginLeft: '0.5rem' }}
                              >
                                {stock.gainLoss >= 0 ? 
                                  <FiTrendingUp size={12} /> : 
                                  <FiTrendingDown size={12} />
                                }
                                {formatPercent(stock.gainLossPercent)}
                              </Badge>
                            )}
                          </div>
                        ) : 'N/A'}
                      </TableCell>
                      {state.settings.mode === 'pro' && (
                        <TableCell align="right">
                          <Text size="sm">{formatDate(stock.buyDate)}</Text>
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <ActionButton onClick={() => handleEdit(stock)}>
                          <FiEdit size={14} />
                        </ActionButton>
                        <ActionButton 
                          variant="danger"
                          onClick={() => handleDelete(stock)}
                        >
                          <FiTrash2 size={14} />
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          )}
        </Card>

        {/* Edit Modal */}
        <Modal show={showEditModal}>
          <ModalContent>
            <ModalHeader>
              <Text size="lg" weight="semibold">
                Edit {editingStock?.symbol}
              </Text>
              <CloseButton onClick={() => setShowEditModal(false)}>
                ×
              </CloseButton>
            </ModalHeader>

            {editingStock && (
              <form onSubmit={handleEditSubmit}>
                <FormGroup>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({...editForm, quantity: e.target.value})}
                    min="1"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Buy Price per Share</Label>
                  <Input
                    type="number"
                    value={editForm.buyPrice}
                    onChange={(e) => setEditForm({...editForm, buyPrice: e.target.value})}
                    step="0.01"
                    min="0.01"
                    required
                  />
                </FormGroup>

                <Flex gap="1rem">
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinner size="16px" /> : 'Update'}
                  </Button>
                </Flex>
              </form>
            )}
          </ModalContent>
        </Modal>
      </Container>
    </PortfolioContainer>
  );
};

export default Portfolio;