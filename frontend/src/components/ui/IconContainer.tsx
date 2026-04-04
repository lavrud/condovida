import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cx } from '../../lib/utils';

interface IconContainerProps {
  icon: LucideIcon;
  size?: number;
  iconSize?: number;
  color?: string;
}

export function IconContainer({
  icon: Icon,
  size = 40,
  iconSize = 18,
  color = 'bg-stone-100 text-stone-600',
}: IconContainerProps) {
  return (
    <div
      className={cx('rounded-full flex items-center justify-center flex-shrink-0', color)}
      style={{ width: size, height: size }}
    >
      <Icon size={iconSize} />
    </div>
  );
}
