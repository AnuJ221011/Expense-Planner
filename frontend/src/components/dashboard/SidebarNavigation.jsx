import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Plus,
  BarChart3
} from 'lucide-react';

const SidebarNavigation = ({
  activeSection,
  onSectionChange,
  onAddTransaction,
  onNavigateToAnalytics,
  onLogout
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2">
      <Button
        variant={activeSection === 'home' ? 'default' : 'ghost'}
        className="w-full justify-start text-white hover:bg-white/10 text-xs lg:text-sm"
        onClick={() => onSectionChange('home')}
      >
        <Home className="mr-2 lg:mr-3 h-3 w-3 lg:h-4 lg:w-4" />
        Home
      </Button>

      <Button
        variant={activeSection === 'profile' ? 'default' : 'ghost'}
        className="w-full justify-start text-white hover:bg-white/10 text-xs lg:text-sm"
        onClick={() => onSectionChange('profile')}
      >
        <User className="mr-2 lg:mr-3 h-3 w-3 lg:h-4 lg:w-4" />
        Profile
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start text-green-400 hover:bg-green-400/10 text-xs lg:text-sm"
        onClick={() => onAddTransaction('income')}
      >
        <Plus className="mr-2 lg:mr-3 h-3 w-3 lg:h-4 lg:w-4" />
        Add Income
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start text-blue-400 hover:bg-blue-400/10 text-xs lg:text-sm"
        onClick={() => onAddTransaction('saving')}
      >
        <Plus className="mr-2 lg:mr-3 h-3 w-3 lg:h-4 lg:w-4" />
        Add Saving
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start text-red-400 hover:bg-red-400/10 text-xs lg:text-sm"
        onClick={() => onAddTransaction('expense')}
      >
        <Plus className="mr-2 lg:mr-3 h-3 w-3 lg:h-4 lg:w-4" />
        Add Expense
      </Button>

      <Button
        variant={activeSection === 'dashboard' ? 'default' : 'ghost'}
        className="w-full justify-start text-white bg-gray-700 hover:bg-white/10 text-xs lg:text-sm "
        onClick={() => onSectionChange('dashboard')}
      >
        <BarChart3 className="mr-2 lg:mr-3 h-3 w-3 lg:h-4 lg:w-4" />
        Dashboard
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start text-cyan-400 hover:bg-cyan-400/10 text-xs lg:text-sm col-span-2 lg:col-span-1"
        onClick={onNavigateToAnalytics}
      >
        <BarChart3 className="mr-2 lg:mr-3 h-3 w-3 lg:h-4 lg:w-4" />
        Analytics Dashboard
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start text-white bg-red-500/20 hover:bg-red-500 text-xs lg:text-sm col-span-2 lg:col-span-1 lg:mt-4"
        onClick={onLogout || handleLogout}
      >
        Logout
      </Button>
    </nav>
  );
};

export default SidebarNavigation;
