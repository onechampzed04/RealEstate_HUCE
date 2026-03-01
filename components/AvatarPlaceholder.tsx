import React from 'react';

interface AvatarPlaceholderProps {
  name?: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AvatarPlaceholder: React.FC<AvatarPlaceholderProps> = ({
  name = 'User',
  avatarUrl,
  size = 'md',
  className = '',
}) => {
  
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-4xl',
  };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  } else {
      // Get initials from name
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    // Generate color based on name (consistent for same name)
    const generateColor = (name: string) => {
      const colors = [
        'bg-blue-500',
        'bg-red-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-cyan-500',
      ];
      const hash = name
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return colors[hash % colors.length];
    };

    return (
      <div
        className={`${sizeClasses[size]} ${generateColor(name)} rounded-full flex items-center justify-center text-white font-bold ${className}`}
      >
        {getInitials(name)}
      </div>
    );
  }

  
};

export default AvatarPlaceholder;
