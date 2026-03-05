
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-blue-800 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-emerald-600 focus:ring-secondary',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''} ${props.className || ''}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
