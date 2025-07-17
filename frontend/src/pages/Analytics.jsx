import{ useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ArrowLeft, TrendingUp, ShoppingCart, ChevronLeft, ChevronRight, Loader2, PieChart, BarChart2, BarChart2Icon, BarChart4 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

// JWT token utility functions
const getTokenFromStorage = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const getUserIdFromToken = () => {
  const token = getTokenFromStorage();
  if (!token) return null;
  
  const decoded = decodeJWT(token);
  return decoded?.userId;
};

const isTokenExpired = (token) => {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// API service functions with JWT authentication
const api = {
  // Helper function to get headers with JWT token
  getAuthHeaders: () => {
    const token = getTokenFromStorage();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  },

  // Income API calls
  getIncomeByCategory: async (userId, period) => {
    const response = await fetch(`https://expense-planner-q3rf.vercel.app/api/income/category/${period}/${userId}`, {
      headers: api.getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  
  getIncomeByDateThisMonth: async (userId) => {
    const response = await fetch(`https://expense-planner-q3rf.vercel.app/api/income/monthly-dates/${userId}`, {
      headers: api.getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  
  // Expense API calls
  getExpensesByCategory: async (userId, period) => {
    const response = await fetch(`https://expense-planner-q3rf.vercel.app//api/expenses/category/${period}/${userId}`, {
      headers: api.getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  
  getExpensesByDateThisMonth: async (userId) => {
    const response = await fetch(`https://expense-planner-q3rf.vercel.app/api/expenses/monthly-dates/${userId}`, {
      headers: api.getAuthHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
};

const Analytics = () => {
  const [activeType, setActiveType] = useState('income');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    income: {
      today: [],
      thisWeek: [],
      thisMonth: [],
      thisYear: []
    },
    expense: {
      today: [],
      thisWeek: [],
      thisMonth: [],
      thisYear: []
    }
  });
  const [monthlyDateData, setMonthlyDateData] = useState([]);
  const [incomeVsExpenseData, setIncomeVsExpenseData] = useState([]);

  const navigate = useNavigate();

  // Get current date information
  const today = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const todayDate = today.getDate();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();

  // Authentication check and user ID extraction
  useEffect(() => {
    const token = getTokenFromStorage();
    
    if (!token) {
      setAuthError('Authentication required. Please log in.');
      navigate('/');
      return;
    }

    if (isTokenExpired(token)) {
      setAuthError('Session expired. Please log in again.');
      navigate('/');
      return;
    }

    const extractedUserId = getUserIdFromToken();
    if (!extractedUserId) {
      setAuthError('Invalid authentication token. Please log in again.');
      navigate('/');
      return;
    }

    setUserId(extractedUserId);
    setAuthError(null);
  }, [navigate]);

  // Month navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Format data for charts
  const formatChartData = (data) => {
    return data.map(item => ({
      category: item.category,
      amount: parseFloat(item.total_amount || 0)
    }));
  };

  // Format monthly date data
  const formatMonthlyDateData = (data) => {
    console.log('Raw monthly date data:', data);
    const monthData = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const found = data.find(item => {
        const itemDate = item.transaction_date;
        if (itemDate instanceof Date) {
          return itemDate.toISOString().split('T')[0] === dateStr;
        }
        return itemDate === dateStr || itemDate?.split('T')[0] === dateStr;
      });
      monthData.push({
        date: i.toString(),
        amount: found ? parseFloat(found.total_amount) : 0
      });
    }
    console.log('Formatted monthly data:', monthData);
    return monthData;
  };

  // Format income vs expense comparison data
  const formatIncomeVsExpenseData = (incomeData, expenseData) => {
    const combinedData = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      const incomeFound = incomeData.find(item => {
        const itemDate = item.transaction_date;
        if (itemDate instanceof Date) {
          return itemDate.toISOString().split('T')[0] === dateStr;
        }
        return itemDate === dateStr || itemDate?.split('T')[0] === dateStr;
      });
      
      const expenseFound = expenseData.find(item => {
        const itemDate = item.transaction_date;
        if (itemDate instanceof Date) {
          return itemDate.toISOString().split('T')[0] === dateStr;
        }
        return itemDate === dateStr || itemDate?.split('T')[0] === dateStr;
      });

      const incomeAmount = incomeFound ? parseFloat(incomeFound.total_amount) : 0;
      const expenseAmount = expenseFound ? parseFloat(expenseFound.total_amount) : 0;
      
      combinedData.push({
        date: i.toString(),
        income: incomeAmount,
        expense: expenseAmount,
        netSavings: incomeAmount - expenseAmount
      });
    }
    return combinedData;
  };



  // Load analytics data
  const loadAnalyticsData = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const newAnalyticsData = {
        income: {
          today: [],
          thisWeek: [],
          thisMonth: [],
          thisYear: []
        },
        expense: {
          today: [],
          thisWeek: [],
          thisMonth: [],
          thisYear: []
        }
      };

      // Load income data for all periods
      const [incomeToday, incomeWeek, incomeMonth, incomeYear] = await Promise.all([
        api.getIncomeByCategory(userId, 'today'),
        api.getIncomeByCategory(userId, 'thisWeek'),
        api.getIncomeByCategory(userId, 'thisMonth'),
        api.getIncomeByCategory(userId, 'thisYear')
      ]);

      newAnalyticsData.income.today = formatChartData(incomeToday);
      newAnalyticsData.income.thisWeek = formatChartData(incomeWeek);
      newAnalyticsData.income.thisMonth = formatChartData(incomeMonth);
      newAnalyticsData.income.thisYear = formatChartData(incomeYear);

      // Load expense data for all periods
      const [expenseToday, expenseWeek, expenseMonth, expenseYear] = await Promise.all([
        api.getExpensesByCategory(userId, 'today'),
        api.getExpensesByCategory(userId, 'thisWeek'),
        api.getExpensesByCategory(userId, 'thisMonth'),
        api.getExpensesByCategory(userId, 'thisYear')
      ]);

      newAnalyticsData.expense.today = formatChartData(expenseToday);
      newAnalyticsData.expense.thisWeek = formatChartData(expenseWeek);
      newAnalyticsData.expense.thisMonth = formatChartData(expenseMonth);
      newAnalyticsData.expense.thisYear = formatChartData(expenseYear);

      setAnalyticsData(newAnalyticsData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        setAuthError('Authentication failed. Please log in again.');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load monthly date data
  const loadMonthlyDateData = async () => {
    if (!userId) return;
    
    try {
      if (activeType === 'incomeVsExpense') {
        // Load both income and expense data for comparison
        const [incomeData, expenseData] = await Promise.all([
          api.getIncomeByDateThisMonth(userId),
          api.getExpensesByDateThisMonth(userId)
        ]);
        
        console.log('Income data received:', incomeData);
        console.log('Expense data received:', expenseData);
        
        const combinedData = formatIncomeVsExpenseData(incomeData, expenseData);
        setIncomeVsExpenseData(combinedData);
        
        // Check if we have any non-zero values
        const hasData = combinedData.some(item => item.income > 0 || item.expense > 0);
        console.log('Has comparison data for chart:', hasData);
        
      } else {
        // Load single type data (income or expense)
        let data;
        if (activeType === 'income') {
          data = await api.getIncomeByDateThisMonth(userId);
        } else {
          data = await api.getExpensesByDateThisMonth(userId);
        }
        console.log(`${activeType} monthly data received:`, data);
        const formattedData = formatMonthlyDateData(data);
        setMonthlyDateData(formattedData);
        
        // Check if we have any non-zero values
        const hasData = formattedData.some(item => item.amount > 0);
        console.log('Has data for chart:', hasData);
      }
      
    } catch (error) {
      console.error('Error loading monthly date data:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        setAuthError('Authentication failed. Please log in again.');
        navigate('/');
      }
    }
  };

  // Load data when userId is available
  useEffect(() => {
    if (userId) {
      loadAnalyticsData();
    }
  }, [userId]);

  // Load monthly data when activeType, currentDate, or userId changes
  useEffect(() => {
    if (userId) {
      loadMonthlyDateData();
    }
  }, [activeType, currentDate, userId]);

  // Show error message if authentication fails
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4 flex items-center justify-center">
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
            <p className="text-gray-400 mb-4">{authError}</p>
            <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-blue-500 to-blue-400">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while checking authentication
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4 flex items-center justify-center">
        <div className="flex items-center text-white">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Authenticating...</span>
        </div>
      </div>
    );
  }

  const getTypeColor = () => {
    switch (activeType) {
      case 'income': return '#10B981';
      case 'expense': return '#3B82F6';
      case 'incomeVsExpense': return '#10B981';
      default: return '#3B82F6';
    }
  };

  const getTypeIcon = () => {
    switch (activeType) {
      case 'income': return <TrendingUp className="h-5 w-5" />;
      case 'expense': return <ShoppingCart className="h-5 w-5" />;
      case 'incomeVsExpense': return <PieChart className="h-5 w-5" />;
      default: return <TrendingUp className="h-5 w-5" />;
    }
  };

  const formatCurrency = (value) => `$${value.toLocaleString()}`;

  const periods = [
    { key: 'today', label: `Today (${todayDate} ${today.toLocaleString('default', { month: 'long' })})` },
    { key: 'thisWeek', label: 'This Week' },
    { key: 'thisMonth', label: `${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}` },
    { key: 'thisYear', label: `Year ${today.getFullYear()}` }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="text-white hover:bg-white/10 mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/public/profile-avtar.jpg" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              U
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400">Detailed financial insights and trends</p>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center mb-6">
          <Loader2 className="h-6 w-6 animate-spin text-white mr-2" />
          <span className="text-white">Loading analytics data...</span>
        </div>
      )}

      {/* Type Toggle Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { type: 'income', label: 'Income', color: 'from-green-500 to-green-400' },
          { type: 'expense', label: 'Expense', color: 'from-blue-500 to-blue-400' },
          { type: 'incomeVsExpense', label: 'Income vs Expense', color: 'from-slate-600 to-slate-400' },
        ].map(({ type, label, color }) => (
          <Button
            key={type}
            variant={activeType === type ? 'default' : 'ghost'}
            className={`flex items-center space-x-2 ${
              activeType === type 
                ? `bg-gradient-to-r ${color}` 
                : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setActiveType(type)}
          >
            {type === 'income' && <TrendingUp className="h-4 w-4" />}
            {type === 'expense' && <ShoppingCart className="h-4 w-4" />}
            {type === 'incomeVsExpense' && <BarChart4 className="h-4 w-4" />}
            <span>{label}</span>
          </Button>
        ))}
      </div>

      {/* Charts Grid - 2x2 layout for first 4 charts */}
      {activeType !== 'incomeVsExpense' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {periods.map(({ key, label }) => (
            <Card key={key} className="bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 hover:bg-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center space-x-2 text-sm md:text-base">
                  {getTypeIcon()}
                  <span className="capitalize">{activeType} - {label}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData[activeType][key]?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData[activeType][key]} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                      <XAxis 
                        dataKey="category" 
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                      />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '12px'
                        }}
                        formatter={(value) => [formatCurrency(value), 'Amount']}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill={getTypeColor()}
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-400">
                    No data available for this period
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 5th Chart - Monthly Date-wise Tracking with Navigation */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 hover:bg-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2 text-sm md:text-base">
              {getTypeIcon()}
              <span className="capitalize">
                {activeType === 'incomeVsExpense' ? 'Income vs Expense' : activeType} Daily Tracking
              </span>
            </CardTitle>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousMonth}
                className="text-white hover:bg-white/10 p-1 md:p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-white font-medium text-sm md:text-base min-w-[100px] md:min-w-[140px] text-center">
                {currentMonth} {currentYear}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
                className="text-white hover:bg-white/10 p-1 md:p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeType === 'incomeVsExpense' ? (
              incomeVsExpenseData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart
                    data={incomeVsExpenseData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      label={{
                        value: 'Date',
                        position: 'insideBottom',
                        offset: -10,
                        style: {
                          textAnchor: 'middle',
                          fill: '#9CA3AF',
                          fontSize: '12px',
                        },
                      }}
                      interval={Math.floor(daysInMonth / 10)}
                    />
                    <YAxis
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      label={{
                        value: 'Amount ($)',
                        angle: -90,
                        position: 'insideLeft',
                        style: {
                          textAnchor: 'middle',
                          fill: '#9CA3AF',
                          fontSize: '12px',
                        },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '12px',
                      }}
                      formatter={(value, name) => [
                        formatCurrency(value),
                        name === 'income' ? 'Income' : 'Expense',
                      ]}
                      labelFormatter={(label) => `Date: ${label} ${currentMonth}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                      name="Income"
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                      name="Expense"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  No comparison data available for {currentMonth} {currentYear}
                </div>
              )
            ): (
            monthlyDateData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyDateData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    label={{ value: 'Date', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: '12px' } }}
                    interval={Math.floor(daysInMonth / 10)}
                  />
                  <YAxis 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: '12px' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px'
                    }}
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `Date: ${label} ${currentMonth}`}
                  />  
                 <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke={getTypeColor()}
                    strokeWidth={2}
                    dot={{ fill: getTypeColor(), strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No data available for {currentMonth} {currentYear}
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics