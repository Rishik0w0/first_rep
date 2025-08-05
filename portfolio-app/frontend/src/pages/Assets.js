import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiCalendar, FiDollarSign, FiHash } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { portfolioAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import { 
  Container, 
  Card, 
  Button, 
  Input, 
  Grid, 
  Flex, 
  Text, 
  LoadingSpinner,
  FormGroup,
  Label
} from '../styles/GlobalStyles';

const AssetsContainer = styled.div`
  padding: ${props => props.theme.spacing.xl} 0;
  min-height: calc(100vh - 64px);
`;

const FormCard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
`;

const InputWithIcon = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: ${props => props.theme.spacing.md};
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.textTertiary};
  }
  
  input {
    padding-left: 3rem;
  }
`;

const ExampleSection = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ExampleCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledDatePicker = styled(DatePicker)`
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
    outline: none;
  }
`;

const Assets = () => {
  const { state } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    buyPrice: '',
    buyDate: new Date()
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.symbol || !formData.quantity || !formData.buyPrice || !formData.buyDate) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isNaN(formData.quantity) || isNaN(formData.buyPrice) || 
        parseFloat(formData.quantity) <= 0 || parseFloat(formData.buyPrice) <= 0) {
      toast.error('Quantity and price must be positive numbers');
      return;
    }

    // Check if buy date is not in the future
    if (formData.buyDate > new Date()) {
      toast.error('Buy date cannot be in the future');
      return;
    }

    setLoading(true);
    try {
      await portfolioAPI.addStock({
        symbol: formData.symbol.toUpperCase(),
        quantity: parseInt(formData.quantity),
        buyPrice: parseFloat(formData.buyPrice),
        buyDate: formData.buyDate.toISOString().split('T')[0]
      });

      toast.success(`Added ${formData.quantity} shares of ${formData.symbol.toUpperCase()} to portfolio`);
      
      // Reset form
      setFormData({
        symbol: '',
        quantity: '',
        buyPrice: '',
        buyDate: new Date()
      });
    } catch (error) {
      console.error('Add asset error:', error);
      toast.error(error.response?.data?.error || 'Failed to add asset to portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: state.settings.currency
    }).format(value || 0);
  };

  const calculateTotalCost = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.buyPrice) || 0;
    return quantity * price;
  };

  const examples = [
    {
      symbol: 'AAPL',
      company: 'Apple Inc.',
      quantity: 100,
      buyPrice: 150.25,
      buyDate: '2023-01-15',
      description: 'Tech stock bought during market dip'
    },
    {
      symbol: 'GOOGL',
      company: 'Alphabet Inc.',
      quantity: 50,
      buyPrice: 2500.00,
      buyDate: '2022-11-20',
      description: 'Long-term investment in search leader'
    },
    {
      symbol: 'TSLA',
      company: 'Tesla Inc.',
      quantity: 25,
      buyPrice: 800.50,
      buyDate: '2023-03-10',
      description: 'Electric vehicle growth play'
    }
  ];

  return (
    <AssetsContainer>
      <Container>
        {/* Header */}
        <Flex justify="center" align="center" direction="column" style={{ marginBottom: '3rem' }}>
          <Text size="xxl" weight="bold" style={{ marginBottom: '0.5rem' }}>
            Add Assets
          </Text>
          <Text color="secondary" style={{ textAlign: 'center', maxWidth: '600px' }}>
            Manually add stocks you've purchased previously to track your complete portfolio history
          </Text>
        </Flex>

        {/* Examples Section */}
        <ExampleSection>
          <Text size="lg" weight="semibold" style={{ marginBottom: '1rem' }}>
            📈 Example Entries
          </Text>
          <Text size="sm" color="secondary" style={{ marginBottom: '1.5rem' }}>
            Here are some examples of how you might add historical stock purchases:
          </Text>
          
          <Grid cols={1}>
            {examples.map((example, index) => (
              <ExampleCard key={index}>
                <Flex justify="space-between" align="center">
                  <div>
                    <Text weight="semibold">{example.symbol}</Text>
                    <Text size="sm" color="secondary">{example.company}</Text>
                    <Text size="xs" color="tertiary">{example.description}</Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text size="sm">
                      {example.quantity} shares @ {formatCurrency(example.buyPrice)}
                    </Text>
                    <Text size="xs" color="secondary">
                      {new Date(example.buyDate).toLocaleDateString()}
                    </Text>
                    <Text size="sm" weight="medium">
                      Total: {formatCurrency(example.quantity * example.buyPrice)}
                    </Text>
                  </div>
                </Flex>
              </ExampleCard>
            ))}
          </Grid>
        </ExampleSection>

        {/* Add Asset Form */}
        <FormCard>
          <Text size="lg" weight="semibold" style={{ marginBottom: '1.5rem' }}>
            Add New Asset
          </Text>

          <form onSubmit={handleSubmit}>
            <Grid cols={2} gap="1.5rem">
              <FormGroup>
                <Label>Stock Symbol</Label>
                <InputWithIcon>
                  <FiHash size={18} />
                  <Input
                    type="text"
                    placeholder="e.g., AAPL, GOOGL, MSFT"
                    value={formData.symbol}
                    onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                    maxLength={10}
                    required
                  />
                </InputWithIcon>
                <Text size="xs" color="tertiary" style={{ marginTop: '0.25rem' }}>
                  Enter the stock ticker symbol
                </Text>
              </FormGroup>

              <FormGroup>
                <Label>Quantity</Label>
                <InputWithIcon>
                  <FiHash size={18} />
                  <Input
                    type="number"
                    placeholder="Number of shares"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    min="1"
                    required
                  />
                </InputWithIcon>
                <Text size="xs" color="tertiary" style={{ marginTop: '0.25rem' }}>
                  How many shares did you buy?
                </Text>
              </FormGroup>

              <FormGroup>
                <Label>Buy Price per Share</Label>
                <InputWithIcon>
                  <FiDollarSign size={18} />
                  <Input
                    type="number"
                    placeholder="Price per share"
                    value={formData.buyPrice}
                    onChange={(e) => handleInputChange('buyPrice', e.target.value)}
                    step="0.01"
                    min="0.01"
                    required
                  />
                </InputWithIcon>
                <Text size="xs" color="tertiary" style={{ marginTop: '0.25rem' }}>
                  What price did you pay per share?
                </Text>
              </FormGroup>

              <FormGroup>
                <Label>Purchase Date</Label>
                <div style={{ position: 'relative' }}>
                  <FiCalendar 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: '1rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#94a3b8',
                      zIndex: 1,
                      pointerEvents: 'none'
                    }} 
                  />
                  <StyledDatePicker
                    selected={formData.buyDate}
                    onChange={(date) => handleInputChange('buyDate', date)}
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                    placeholderText="Select purchase date"
                    style={{ paddingLeft: '3rem' }}
                    required
                  />
                </div>
                <Text size="xs" color="tertiary" style={{ marginTop: '0.25rem' }}>
                  When did you purchase this stock?
                </Text>
              </FormGroup>
            </Grid>

            {/* Total Cost Display */}
            {formData.quantity && formData.buyPrice && (
              <Card style={{ 
                margin: '1.5rem 0', 
                background: state.settings.theme === 'dark' ? '#1e293b' : '#f8fafc',
                border: `1px solid ${state.settings.theme === 'dark' ? '#334155' : '#e2e8f0'}`
              }}>
                <Flex justify="space-between" align="center">
                  <Text color="secondary">Total Investment</Text>
                  <Text size="lg" weight="bold" color="primary">
                    {formatCurrency(calculateTotalCost())}
                  </Text>
                </Flex>
              </Card>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="20px" /> : <FiPlus size={20} />}
              {loading ? 'Adding Asset...' : 'Add to Portfolio'}
            </Button>
          </form>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: state.settings.theme === 'dark' ? '#1e293b' : '#f8fafc', borderRadius: '0.5rem' }}>
            <Text size="sm" color="secondary" weight="medium" style={{ marginBottom: '0.5rem' }}>
              💡 Pro Tips:
            </Text>
            <ul style={{ paddingLeft: '1rem', color: state.settings.theme === 'dark' ? '#94a3b8' : '#64748b' }}>
              <li style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                Double-check the stock symbol to ensure accuracy
              </li>
              <li style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                Include all fees in your buy price for accurate tracking
              </li>
              <li style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                You can edit or remove assets later from the Portfolio page
              </li>
              <li style={{ fontSize: '0.875rem' }}>
                Historical data will be fetched automatically when available
              </li>
            </ul>
          </div>
        </FormCard>
      </Container>
    </AssetsContainer>
  );
};

export default Assets;