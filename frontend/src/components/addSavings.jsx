import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, DollarSign, Target, TrendingUp, Check, Star, Sparkles, Trash2, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddSavings = () => {
  const [goals, setGoals] = useState([]);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [showAddMoneyForm, setShowAddMoneyForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();
  
  // New goal form state
  const [newGoal, setNewGoal] = useState({
    goal_name: '',
    target_amount: ''
  });

  useEffect(() => {
    // Check if userId is already set
    if (!userId) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Note: In a real app, you'd use jwt-decode library
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          const userIdFromToken = decodedToken.userId;
          setUserId(userIdFromToken);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }
  }, [userId]);

  // Add money form state
  const [addMoney, setAddMoney] = useState({
    amount: '',
    notes: ''
  });

  // Fetch savings goals
  const fetchGoals = async () => {
    try {
      const response = await fetch(`https://expense-planner-ynxs.vercel.app/api/savings/goals/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  // Handle create new goal
  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://expense-planner-ynxs.vercel.app/api/savings/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGoal,
          user_id: userId,
          target_amount: parseInt(newGoal.target_amount)
        })
      });

      if (response.ok) {
        const newGoalData = await response.json();
        setGoals([...goals, newGoalData]);
        setNewGoal({ goal_name: '', target_amount: '' });
        setShowNewGoalForm(false);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
    setLoading(false);
  };

  // Handle add money to goal
  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!selectedGoalId) return;
    
    setLoading(true);
    
    try {
      const response = await fetch('https://expense-planner-ynxs.vercel.app/api/savings/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          goal_id: selectedGoalId,
          amount: parseInt(addMoney.amount),
          notes: addMoney.notes
        })
      });

      if (response.ok) {
        await fetchGoals(); // Refresh goals to show updated amounts
        setAddMoney({ amount: '', notes: '' });
        setShowAddMoneyForm(false);
        setSelectedGoalId(null);
      }
    } catch (error) {
      console.error('Error adding money:', error);
    }
    setLoading(false);
  };

  // Handle delete goal
  const handleDeleteGoal = async () => {
    if (!goalToDelete) return;
    
    setDeleteLoading(true);
    
    try {
      const response = await fetch(`https://expense-planner-ynxs.vercel.app/api/savings/goals/${goalToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setGoals(goals.filter(goal => goal.id !== goalToDelete.id));
        setShowDeleteConfirm(false);
        setGoalToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
    setDeleteLoading(false);
  };

  // Show delete confirmation
  const showDeleteConfirmation = (goal) => {
    setGoalToDelete(goal);
    setShowDeleteConfirm(true);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setGoalToDelete(null);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0e101c' }}>
      <div className="max-w-md mx-auto px-4 py-6 sm:max-w-2xl sm:px-6 lg:max-w-7xl">
        {/* Mobile-first Header */}
        <div className="flex items-center gap-3 mb-6 sm:gap-4 sm:mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white rounded-lg transition-all duration-300 hover:bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back</span>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/20">
                <Target className="w-5 h-5 text-blue-400 sm:w-6 sm:h-6" />
              </div>
              <h1 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent sm:text-2xl lg:text-3xl">
                Savings Goals
              </h1>
            </div>
            <p className="text-gray-400 text-sm ml-8 sm:text-base sm:ml-10">Turn dreams into milestones</p>
          </div>
        </div>
      
        {/* Mobile-first Action Buttons */}
        <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:gap-4 sm:mb-8">
          <button
            onClick={() => setShowNewGoalForm(!showNewGoalForm)}
            className="group flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            style={{ backgroundColor: '#3b82f6' }}
          >
            <div className="p-1 bg-white/20 rounded-lg group-hover:rotate-180 transition-transform duration-300">
              <Plus className="w-4 h-4" />
            </div>
            Create New Goal
          </button>
          <button
            onClick={() => setShowAddMoneyForm(!showAddMoneyForm)}
            className="group flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
            style={{ backgroundColor: '#22c55e' }}
            disabled={goals.length === 0}
          >
            <div className="p-1 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-4 h-4" />
            </div>
            Add Money
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && goalToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-red-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-xl border border-red-500/30">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Delete Goal</h3>
                  <p className="text-gray-400 text-sm">Cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-300 mb-3 text-sm">
                  Delete <span className="font-bold text-white">"{goalToDelete.goal_name}"</span>?
                </p>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-red-300 text-xs">• All progress data will be lost</p>
                  <p className="text-red-300 text-xs">• Transaction history removed</p>
                  <p className="text-red-300 text-xs">• Action cannot be reversed</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteGoal}
                  disabled={deleteLoading}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
                >
                  {deleteLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Deleting...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </div>
                  )}
                </button>
                <button
                  onClick={cancelDelete}
                  disabled={deleteLoading}
                  className="px-6 py-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-semibold border border-white/10 disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create New Goal Form */}
        {showNewGoalForm && (
          <div className="backdrop-blur-xl rounded-2xl p-6 mb-6 shadow-2xl border border-white/10" style={{ backgroundColor: '#1b1f30' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Create New Goal</h3>
                <p className="text-gray-400 text-sm">Set your target and start saving</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g., Dream Vacation, Emergency Fund"
                  value={newGoal.goal_name}
                  onChange={(e) => setNewGoal({...newGoal, goal_name: e.target.value})}
                  className="w-full p-3 rounded-xl border border-white/10 focus:border-blue-400/50 transition-all duration-300 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20 text-sm"
                  style={{ backgroundColor: '#0e101c' }}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Target Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newGoal.target_amount}
                    onChange={(e) => setNewGoal({...newGoal, target_amount: e.target.value})}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 focus:border-blue-400/50 transition-all duration-300 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/20 text-sm"
                    style={{ backgroundColor: '#0e101c' }}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreateGoal}
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-sm"
                  style={{ backgroundColor: '#3b82f6' }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Goal'
                  )}
                </button>
                <button
                  onClick={() => setShowNewGoalForm(false)}
                  className="px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 font-semibold border border-white/10 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Money Form */}
        {showAddMoneyForm && (
          <div className="backdrop-blur-xl rounded-2xl p-6 mb-6 shadow-2xl border border-white/10 " style={{ backgroundColor: '#1b1f30' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-400/30">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Add Money to Goal</h3>
                <p className="text-gray-400 text-sm">Every contribution counts</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Select Goal</label>
                <select
                  value={selectedGoalId || ''}
                  onChange={(e) => setSelectedGoalId(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-white/10 focus:border-green-400/50 transition-all duration-300 text-white focus:outline-none focus:ring-2 focus:ring-green-400/20 text-sm"
                  style={{ backgroundColor: '#0e101c' }}
                  required
                >
                  <option value="" className="text-gray-400">Choose a goal...</option>
                  {goals.filter(g => !g.is_achieved).map(goal => (
                    <option key={goal.id} value={goal.id} className="text-white">
                      {goal.goal_name} (${goal.current_amount}/${goal.target_amount})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Amount to Add</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={addMoney.amount}
                    onChange={(e) => setAddMoney({...addMoney, amount: e.target.value})}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 focus:border-green-400/50 transition-all duration-300 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400/20 text-sm"
                    style={{ backgroundColor: '#0e101c' }}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">Notes (Optional)</label>
                <textarea
                  placeholder="Add a note about this contribution..."
                  value={addMoney.notes}
                  onChange={(e) => setAddMoney({...addMoney, notes: e.target.value})}
                  className="w-full p-3 rounded-xl border border-white/10 focus:border-green-400/50 transition-all duration-300 text-white placeholder-gray-500 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-400/20 text-sm"
                  style={{ backgroundColor: '#0e101c' }}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddMoney}
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-sm"
                  style={{ backgroundColor: '#22c55e' }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Adding...
                    </div>
                  ) : (
                    'Add Money'
                  )}
                </button>
                <button
                  onClick={() => setShowAddMoneyForm(false)}
                  className="px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 font-semibold border border-white/10 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile-first Savings Goals Display */}
        <div className="space-y-4 sm:grid sm:gap-6 sm:grid-cols-2 sm:space-y-0 lg:grid-cols-3">
          {goals.map(goal => {
            const current = parseInt(goal.current_amount);
            const target = parseInt(goal.target_amount);
            const progress = (current / target) * 100;
            
            return (
              <div 
                key={goal.id} 
                className="group relative backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/10 transition-all duration-500 overflow-hidden"
                style={{ backgroundColor: '#1b1f30' }}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Achievement badge */}
                {goal.is_achieved && (
                  <div className="absolute -top-1 -right-1 p-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg animate-pulse">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                )}
                
                {/* Delete button */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => showDeleteConfirmation(goal)}
                    className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-400/50 opacity-0 group-hover:opacity-100"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 pr-8">
                      {goal.goal_name}
                    </h4>
                    {goal.is_achieved && (
                      <div className="flex items-center gap-1 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs font-bold border border-green-400/30">
                        <Check className="w-3 h-3" />
                        Achieved
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-400">Progress</span>
                      <span className={`text-base font-bold ${goal.is_achieved ? 'text-green-400' : 'text-blue-400'}`}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                            goal.is_achieved 
                              ? 'bg-gradient-to-r from-green-400 to-green-500' 
                              : 'bg-gradient-to-r from-blue-400 to-blue-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-lg font-bold text-blue-400">
                          ${current}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Current</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-lg font-bold text-gray-300">
                          ${target}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Target</div>
                      </div>
                    </div>
                    
                    {!goal.is_achieved && (
                      <div className="text-center p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20">
                        <div className="text-base font-bold text-white">
                          ${(target - current)}
                        </div>
                        <div className="text-xs text-purple-300">remaining</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile-first empty state */}
        {goals.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-blue-400/30">
                  <Target className="w-10 h-10 text-blue-400" />
                </div>
                <div className="absolute -top-1 -right-6 animate-bounce">
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Start Your Savings Journey</h3>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                Transform your dreams into achievable goals. Every great fortune begins with a single step.
              </p>
              <button
                onClick={() => setShowNewGoalForm(true)}
                className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg font-bold text-sm"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  Create Your First Goal
                  <Star className="w-4 h-4 group-hover:animate-pulse" />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSavings;