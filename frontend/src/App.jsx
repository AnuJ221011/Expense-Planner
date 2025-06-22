import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Dashboard from './components/Dashboard';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import AddSavings from './components/addSavings';

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/savings" element={<AddSavings />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
