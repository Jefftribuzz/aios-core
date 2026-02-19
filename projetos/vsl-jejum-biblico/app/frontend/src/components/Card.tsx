import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  isSelected = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
        isSelected
          ? 'border-primary bg-primary bg-opacity-10'
          : 'border-gray-200 hover:border-primary hover:shadow-md'
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`font-bold text-lg mb-2 ${className}`}>{children}</div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`text-sm text-gray-600 ${className}`}>{children}</div>
);
