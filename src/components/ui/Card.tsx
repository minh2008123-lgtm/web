import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const baseClasses = 'bg-white rounded-xl shadow-card p-6 transition-shadow duration-200';
  const hoverClasses = hover ? 'hover:shadow-card-hover cursor-pointer' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';

  if (onClick) {
    return (
      <div
        className={`${baseClasses} ${hoverClasses} ${clickClasses} ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}

interface CardLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function CardLink({ to, children, className = '' }: CardLinkProps) {
  return (
    <Link
      to={to}
      className={`block bg-white rounded-xl shadow-card p-6 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </Link>
  );
}
