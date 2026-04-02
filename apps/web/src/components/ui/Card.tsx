import React from 'react';
import { cx } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: string;
}

export function Card({ children, className = '', onClick, padding = 'p-5' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cx(
        'bg-white rounded-2xl shadow-sm',
        padding,
        onClick && 'cursor-pointer hover:shadow-md transition-shadow duration-300',
        className,
      )}
    >
      {children}
    </div>
  );
}
