import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message 
}) => {
  const sizeClasses = {
    sm: 'loading-spinner--sm',
    md: 'loading-spinner--md', 
    lg: 'loading-spinner--lg'
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]}`}>
      <div className="spinner"></div>
      {message && <div className="spinner-message">{message}</div>}
    </div>
  );
};
