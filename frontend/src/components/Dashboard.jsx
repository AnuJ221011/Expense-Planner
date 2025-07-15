import { useState, useEffect } from 'react';
import TransactionForm from './TransactionForm';
import { useNavigate } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import DashboardContent from './dashboard/DashboardContent';
import HomeContent from './dashboard/HomeContent';
import ProfileContent from './dashboard/ProfileContent';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionType, setTransactionType] = useState('income');
  const [userId, setUserId] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if userId is already set
    if (!userId) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userIdFromToken = decodedToken.userId;
          setUserId(userIdFromToken);
        } catch (error) {
          console.error('Error decoding token:', error);
          // Handle invalid token - maybe redirect to login
        }
      }
    }
  }, [userId]);

  // Fetch transactions when userId is available
  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  const fetchTransactions = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://expense-planner-ynxs.vercel.app/api/transactions/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const balance = {
    total: 66000,
    income: 244000,
    expenses: 22000,
    savings: 24000
  };

  const handleAddTransaction = (type) => {
    setTransactionType(type);
    setShowTransactionForm(true);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false); // Close mobile menu when section changes
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigateToAnalytics = () => {
    navigate('/analytics');
  };

  const handleGoToDashboard = () => {
    setActiveSection('dashboard');
  };

  const handleToggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const handleTransactionSubmit = async (data) => {
    console.log('Transaction submitted:', data);
    setShowTransactionForm(false);
    // Refresh transactions after adding a new one
    await fetchTransactions();
  };

  if (showTransactionForm) {
    return (
      <TransactionForm
        type={transactionType}
        onClose={() => setShowTransactionForm(false)}
        onSubmit={handleTransactionSubmit}
      />
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-500 via-gray-300 to-gray-500 flex flex-col lg:flex-row overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex flex-shrink-0 h-full">
        <div className="h-full overflow-y-auto">
          <Sidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            onAddTransaction={handleAddTransaction}
            onNavigateToAnalytics={handleNavigateToAnalytics}
          />
        </div>
      </div>

      {/* Mobile Header with Hamburger Menu */}
      <div className="lg:hidden bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 p-4 flex items-center justify-between relative z-50">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-6 flex flex-col justify-center items-center transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45' : ''}`}>
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-90 translate-y-0' : '-translate-y-1.5'}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-90 -translate-y-0' : 'translate-y-1.5'}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-20 left-4 right-4 bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl max-h-96 overflow-y-auto">
            <Sidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              onAddTransaction={handleAddTransaction}
              onNavigateToAnalytics={handleNavigateToAnalytics}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 p-2 lg:p-4 ">
        <div className="flex-1 from-slate-900 via-slate-900 to-slate-900 bg-gradient-to-br backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
          {activeSection === 'dashboard' && (
            <div className="h-full overflow-y-auto">
              <DashboardContent
                userId={userId}
                balance={balance}
                transactions={transactions}
                showBalance={showBalance}
                onToggleBalance={handleToggleBalance}
                loading={loading}
                error={error}
                onRefreshTransactions={fetchTransactions}
              />
            </div>
          )}

          {activeSection === 'home' && (
            <div className="h-full overflow-y-auto">
              <HomeContent onGoToDashboard={handleGoToDashboard} />
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="h-full overflow-y-auto">
              <ProfileContent onGoToDashboard={handleGoToDashboard} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;