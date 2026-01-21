
import React, { useEffect, useState } from 'react';
import { Loader2, ChevronLeft, ArrowRight, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

// --- ATOMS (Basic Elements) ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'outline-primary';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading, 
  size = 'md',
  ...props 
}) => {
  const baseStyles = "rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  
  const sizes = {
    sm: "py-2 px-3 text-xs",
    md: "py-3.5 px-4 text-sm",
    lg: "py-4 px-6 text-base"
  };

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
    "outline-primary": "border border-primary text-primary hover:bg-orange-50 bg-white dark:bg-slate-900 dark:hover:bg-slate-800",
    ghost: "bg-transparent text-primary hover:bg-orange-50 dark:hover:bg-slate-800"
  };

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  containerClassName?: string;
  error?: string; // Menambahkan prop error
}

export const Input: React.FC<InputProps> = ({ label, icon, rightIcon, onRightIconClick, className, containerClassName, error, ...props }) => {
  return (
    <div className={`w-full space-y-1.5 ${containerClassName}`}>
      {label && <label className="text-sm font-semibold text-slate-900 dark:text-white block">{label}</label>}
      
      {/* Area Pesan Error di atas field (Realtime Alert) */}
      {error && (
        <div className="flex items-center gap-1.5 text-red-500 animate-in slide-in-from-top-1 fade-in duration-200">
           <AlertCircle size={12} />
           <span className="text-xs font-bold">{error}</span>
        </div>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input 
          className={`w-full bg-white border ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-900 dark:border-slate-100 focus:ring-primary/20 focus:border-primary'} text-black rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all text-sm ${icon ? 'pl-11' : ''} ${rightIcon ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <button 
            type="button"
            onClick={onRightIconClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'red' | 'blue' | 'orange' | 'gray'; className?: string }> = ({ children, color = 'gray', className = '' }) => {
  const colors = {
    green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    gray: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

// --- SNACKBAR COMPONENT ---

interface SnackbarProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

export const Snackbar: React.FC<SnackbarProps> = ({ message, isVisible, onClose, type = 'success' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColors = {
    success: 'bg-slate-900 text-white dark:bg-white dark:text-slate-900',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  const icons = {
    success: <CheckCircle size={18} className="text-green-400 dark:text-green-600" />,
    error: <AlertCircle size={18} className="text-white" />,
    info: <Info size={18} className="text-white" />
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`${bgColors[type]} px-4 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
           {icons[type]}
           <span className="text-xs font-bold tracking-wide">{message}</span>
        </div>
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// --- MOLECULES (Composite Components) ---

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightAction, subtitle, className = '' }) => (
  <div className={`p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 shrink-0 bg-white dark:bg-slate-900 z-10 shadow-sm transition-colors duration-300 ${className}`}>
    {onBack && (
      <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300">
        <ChevronLeft size={24} />
      </button>
    )}
    <div className="flex-1">
      <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight text-left">{title}</h1>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 text-left">{subtitle}</p>}
    </div>
    {rightAction}
  </div>
);

export const BackButton: React.FC<{ onClick: () => void; title?: string }> = ({ onClick, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <button onClick={onClick} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300">
      <ChevronLeft size={24} />
    </button>
    {title && <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>}
  </div>
);

export const Section: React.FC<{ title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, action, children, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    {title && (
      <div className="flex justify-between items-center mb-3 px-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">{title}</h3>
        {action}
      </div>
    )}
    {children}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 shadow-sm transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.99]' : ''} ${className}`}
  >
    {children}
  </div>
);

interface ListItemProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({ icon, title, subtitle, rightElement, onClick, className = '' }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 py-3.5 px-4 group transition-colors ${onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : ''} ${className}`}
  >
    {icon && (
      <div className="w-10 h-10 flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-xl group-hover:text-primary transition-colors shrink-0">
        {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center gap-2">
        <div className="flex-1 min-w-0 text-left">
          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{title}</p>
          {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-1">{subtitle}</p>}
        </div>
        <div className="shrink-0 flex items-center">
          {rightElement || (onClick && <ArrowRight className="text-slate-300 dark:text-slate-600 group-hover:text-primary transition-transform group-hover:translate-x-0.5" size={16} />)}
        </div>
      </div>
    </div>
  </div>
);

interface ScreenLayoutProps {
  children: React.ReactNode;
  className?: string;
  bgClass?: string;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({ children, className = '', bgClass = 'bg-white dark:bg-slate-900' }) => (
  <div className={`flex flex-col h-full ${bgClass} ${className} transition-colors duration-300`}>
    {children}
  </div>
);

export const ScrollableContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 space-y-4 md:space-y-6 pb-28 ${className}`}>
    {children}
  </div>
);
