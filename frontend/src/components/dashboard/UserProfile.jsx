import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const UserProfile = ({ 
  name, 
  email, 
  avatarSrc, 
  initials, 
  compact = false 
}) => {
  return (
    <div className={`flex ${compact ? 'lg:flex-col' : ''} items-center ${compact ? 'lg:items-center' : ''} ${compact ? 'mb-4 lg:mb-8' : 'space-x-6'}`}>
      <Avatar className={compact ? "h-12 w-12 lg:h-16 lg:w-16 mb-0 lg:mb-4 mr-4 lg:mr-0" : "h-24 w-24"}>
        <AvatarImage src={avatarSrc || "/placeholder-avatar.jpg"} />
        <AvatarFallback className={`bg-gradient-to-br from-blue-custom to-cyan-custom text-white ${compact ? 'text-lg lg:text-xl' : 'text-2xl'}`}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className={compact ? "lg:text-center" : ""}>
        <h3 className={`text-white font-semibold ${compact ? 'text-sm lg:text-base' : 'text-2xl mb-2'}`}>
          {name}
        </h3>
        <p className={`text-gray-400 ${compact ? 'text-xs lg:text-sm' : 'mb-1'}`}>
          {email}
        </p>
        {!compact && (
          <p className="text-gray-400 text-sm">Member since January 2024</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
