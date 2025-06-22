import { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  RefreshCw,
  AlertCircle,
  Wallet,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';

const BalanceCard = ({ userId, showBalance, onToggleBalance }) => {
  const [balance, setBalance] = useState({
    total: 0,
    income: 0,
    expenses: 0,
    savings: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    incomePercentageChange: 0,
    expensesPercentageChange: 0,
    savingsPercentageChange: 0,
    transactionCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5000/api/balance/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log('Hi Anuj, it is giving error');
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log('Balance data fetched successfully:', result.data);
        setBalance(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch balance data');
      }
    } catch (err) {
      console.error('Anuj ji, it is Error fetching balance data:', err);
      setError(err.message || 'Failed to fetch balance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBalanceData();
    }
  }, [userId]);

  const formatPercentageChange = (change) => {
    const absChange = Math.abs(change);
    const sign = change >= 0 ? '+' : '-';
    return `${sign}${absChange.toFixed(2)}%`;
  };

  const getPercentageColor = (change) => {
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getCurrentMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  if (loading) {
    return (
      <Card className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl rounded-2xl overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center h-64 p-8">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-white/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white/90 mb-2">Loading Balance</h3>
            <p className="text-white/60">Fetching your financial data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="backdrop-blur-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-400/30 shadow-2xl rounded-2xl overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center h-64 p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-red-300 mb-2">Error Loading Balance</h3>
            <p className="text-red-400/80 text-sm max-w-md">{error}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchBalanceData}
            className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300">
      {/* Header with Gradient Background */}
      <CardHeader className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/10 pb-6">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                Available Balance
              </h2>
              <p className="text-white/60 text-sm">Your financial overview</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchBalanceData}
              className="group relative p-3 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-110"
            >
              <RefreshCw className="h-4 w-4 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleBalance}
              className="group relative px-4 py-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              {showBalance ? 
                <EyeOff className="h-4 w-4 text-blue-400" /> : 
                <Eye className="h-4 w-4 text-blue-400" />
              }
              <span className="text-blue-400 font-medium text-sm">
                {showBalance ? 'Hide' : 'Show'}
              </span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 lg:p-8 from-slate-900 via-slate-900 to-slate-900 bg-gradient-to-br rounded-b-2xl">
        {/* Main Balance Display */}
        <div className="text-center mb-8">
          <div 
            className="text-4xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent mb-4 cursor-pointer hover:scale-105 transition-transform duration-300 select-none" 
            onClick={onToggleBalance}
          >
            {showBalance ? `$${balance.total.toLocaleString()}` : '••••••'}
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-white/70 text-sm">
              {balance.transactionCount} transactions this month
            </span>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Income Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/30 to-emerald-500/20 border border-green-400/20 p-6 hover:bg-gradient-to-br hover:from-green-500/35 hover:to-emerald-500/15 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div> 
                <p className="text-green-300/80 text-sm font-medium mb-1">
                  {getCurrentMonthName()} Income
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-green-400/70">Earned</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
            
            <div className="text-2xl lg:text-3xl font-bold text-green-400 mb-3">
              ${balance.income.toLocaleString()}
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                balance.incomePercentageChange >= 0 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {formatPercentageChange(balance.incomePercentageChange)}
              </div>
              <span className="text-white/50 text-xs">vs last month</span>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/30 to-pink-500/20 border border-red-400/20 p-6 hover:bg-gradient-to-br hover:from-red-500/15 hover:to-pink-500/15 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-red-300/80 text-sm font-medium mb-1">Expenses</p>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  <span className="text-xs text-red-400/70">Spent</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-400" />
              </div>
            </div>
            
            <div className="text-2xl lg:text-3xl font-bold text-red-400 mb-3">
              ${balance.expenses.toLocaleString()}
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                balance.expensesPercentageChange >= 0 
                  ? 'bg-red-500/20 text-red-300' 
                  : 'bg-green-500/20 text-green-300'
              }`}>
                {formatPercentageChange(balance.expensesPercentageChange)}
              </div>
              <span className="text-white/50 text-xs">vs last month</span>
            </div>
          </div>

          {/* Savings Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-500/20 border border-blue-400/20 p-6 hover:bg-gradient-to-br hover:from-blue-500/15 hover:to-indigo-500/15 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-300/80 text-sm font-medium mb-1">Savings</p>
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-blue-400/70">Saved</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            
            <div className="text-2xl lg:text-3xl font-bold text-blue-400 mb-3">
              ${balance.savings.toLocaleString()}
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                balance.savingsPercentageChange >= 0 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {formatPercentageChange(balance.savingsPercentageChange)}
              </div>
              <span className="text-white/50 text-xs">vs last month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;