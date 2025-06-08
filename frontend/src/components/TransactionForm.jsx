import { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Calendar, Clock, User, Tag, Target } from 'lucide-react';
import AddSavings from './addSavings';
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from './ui/select';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';



const TransactionForm = ({ type = 'income', onClose = () => {}, onSubmit = () => {} }) => {
  const [formData, setFormData] = useState({
    amount: '',
    entity: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    goal: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
 const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

 useEffect(() => {
    if (!userId) {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token); 
        const userIdFromToken = decodedToken.userId;
        setUserId(userIdFromToken);
      }
    }
  }, [userId]);

  const categories = {
    income: ['Salary', 'Business Income', 'Gift', 'Freelancing', 'Rental Income', 'Other'],
    expense: ['Education', 'Loan EMI', 'Utilities', 'Food', 'Transportation', 'Other']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload =
      type === 'saving'
        ? { amount: formData.amount, goal: formData.goal, date: formData.date, time: formData.time, type }
        : { ...formData, type, user_id: userId };

    try {
      const endpoint = type === 'income' ? 'http://localhost:5000/api/income' : 'http://localhost:5000/api/expense';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to submit transaction');
      const result = await response.json();

      onSubmit(result.data);
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting transaction');
    }
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'income':
        return {
          color: 'text-emerald-400',
          gradient: 'from-emerald-500 via-green-500 to-teal-500',
          bgGradient: 'from-emerald-900/20 via-green-900/10 to-teal-900/20',
          icon: <DollarSign className="h-5 w-5" />,
          placeholder: 'Company/Source'
        };
      case 'expense':
        return {
          color: 'text-rose-400',
          gradient: 'from-rose-500 via-red-500 to-pink-500',
          bgGradient: 'from-rose-900/20 via-red-900/10 to-pink-900/20',
          icon: <DollarSign className="h-5 w-5" />,
          placeholder: 'Paid to'
        };
      case 'saving':
        return {
          color: 'text-blue-400',
          gradient: 'from-blue-500 via-indigo-500 to-purple-500',
          bgGradient: 'from-blue-900/20 via-indigo-900/10 to-purple-900/20',
          icon: <Target className="h-5 w-5" />,
          placeholder: 'Savings goal'
        };
      default:
        return {
          color: 'text-blue-400',
          gradient: 'from-blue-500 to-cyan-500',
          bgGradient: 'from-blue-900/20 to-cyan-900/20',
          icon: <DollarSign className="h-5 w-5" />,
          placeholder: 'Entity'
        };
    }
  };

  const config = getTypeConfig();

  if (type === 'saving') {
    navigate('/savings');
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 p-4 flex items-center justify-center relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r ${config.gradient} opacity-10 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r ${config.gradient} opacity-5 rounded-full blur-3xl animate-pulse delay-1000`}></div>
      </div>

      <Card className="w-full max-w-md relative z-10 animate-in slide-in-from-bottom-8 duration-500">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3 flex-1">
              <Avatar className="h-12 w-12 ring-2 ring-white/20">
                <AvatarImage src="/profile-avtar.jpg" />
                <AvatarFallback className={`bg-gradient-to-br ${config.gradient} text-white text-sm font-bold`}>
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {config.icon}
                  <CardTitle className={`capitalize ${config.color} text-lg`}>
                    Add {type}
                  </CardTitle>
                </div>
                <p className="text-white/60 text-sm">Enter transaction details</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Amount Field */}
            <div className="relative">
              <Label htmlFor="amount" className="text-white/90 flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Amount</span>
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  onFocus={() => setFocusedField('amount')}
                  onBlur={() => setFocusedField(null)}
                  className={`text-xl font-semibold pl-8 ${focusedField === 'amount' ? 'ring-2 ring-blue-400/50' : ''}`}
                  required
                />
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              </div>
            </div>

            {/* Entity Field */}
            <div className="relative">
              <Label htmlFor="entity" className="text-white/90 flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{type === 'income' ? 'Source' : 'Recipient'}</span>
              </Label>
              <div className="relative">
                <Input
                  id="entity"
                  placeholder={config.placeholder}
                  value={formData.entity}
                  onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                  onFocus={() => setFocusedField('entity')}
                  onBlur={() => setFocusedField(null)}
                  className={`pl-10 ${focusedField === 'entity' ? 'ring-2 ring-blue-400/50' : ''}`}
                  required
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              </div>
            </div>

            {/* Category Field */}
            <div className="relative">
              <Label htmlFor="category" className="text-white/90 flex items-center space-x-2">
                <Tag className="h-4 w-4" />
                <span>Category</span>
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="relative">
                  <div className="pl-10">
                    <SelectValue placeholder="Select category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {categories[type]?.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      // onClick={() => setFormData({ ...formData, category })}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Label htmlFor="date" className="text-white/90 flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                </Label>
                <div className="relative">
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    onFocus={() => setFocusedField('date')}
                    onBlur={() => setFocusedField(null)}
                    className={`pl-10 ${focusedField === 'date' ? 'ring-2 ring-blue-400/50' : ''}`}
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                </div>
              </div>
              <div className="relative">
                <Label htmlFor="time" className="text-white/90 flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Time</span>
                </Label>
                <div className="relative">
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    onFocus={() => setFocusedField('time')}
                    onBlur={() => setFocusedField(null)}
                    className={`pl-10 ${focusedField === 'time' ? 'ring-2 ring-blue-400/50' : ''}`}
                    required
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r ${config.gradient} hover:opacity-90 disabled:opacity-50 font-semibold text-lg py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {config.icon}
                  <span>Add {type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionForm;