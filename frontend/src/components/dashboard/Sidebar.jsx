import { useEffect, useState } from 'react';
import axios from 'axios';
import UserProfile from './UserProfile';
import SidebarNavigation from './SidebarNavigation';

const Sidebar = ({
  activeSection,
  onSectionChange,
  onAddTransaction,
  onNavigateToAnalytics,
}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/routes/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="w-full lg:w-64 glass-effect p-4 lg:p-6 m-2 lg:m-4 rounded-2xl animate-slide-in bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/20 shadow-lg backdrop-blur-xl">
      {user ? (
        <UserProfile
          name={user.name}
          email={user.email}
          initials={user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()}
          compact={true}
          avatarSrc="/public/profile-avtar.jpg"
        />
      ) : (
        <p className="text-white mb-4">Loading user info...</p>
      )}

      <SidebarNavigation
        activeSection={activeSection}
        onSectionChange={onSectionChange}
        onAddTransaction={onAddTransaction}
        onNavigateToAnalytics={onNavigateToAnalytics}
      />
    </div>
  );
};

export default Sidebar;
