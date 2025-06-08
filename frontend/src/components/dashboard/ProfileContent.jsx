import{ useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft } from 'lucide-react';
import UserProfile from './UserProfile';

const ProfileContent = ({ onGoToDashboard }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/routes/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={onGoToDashboard}
          className="text-white hover:bg-white/10 mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
      </div>
      <Card className="glass-effect border-white/10">
        <CardContent className="p-8">
          {user ? (
            <UserProfile
              name={user.name}
              email={user.email}
              initials={user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
              compact={false}
              avatarSrc="/public/profile-avtar.jpg" 
            />
          ) : (
            <p className="text-white">Loading profile...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileContent;
