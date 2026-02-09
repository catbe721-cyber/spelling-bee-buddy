import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:active:scale-100 shadow-md";
  
  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-200 border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-200 border-b-4 border-slate-300 active:border-b-0 active:translate-y-1",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-200 border-b-4 border-red-700 active:border-b-0 active:translate-y-1",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-200 border-b-4 border-green-700 active:border-b-0 active:translate-y-1",
    outline: "bg-transparent border-2 border-slate-300 text-slate-500 hover:text-slate-700 shadow-none"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl",
    xl: "px-10 py-6 text-2xl",
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};