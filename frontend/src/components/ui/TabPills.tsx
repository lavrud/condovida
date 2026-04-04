import React from 'react';
import { cx } from '../../lib/utils';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabPillsProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export function TabPills({ tabs, active, onChange }: TabPillsProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cx(
            'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
            active === t.id
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-500 hover:bg-stone-200',
          )}
        >
          {t.label}
          {t.count !== undefined && t.count > 0 && (
            <span
              className={cx(
                'ml-1.5 px-1.5 py-0.5 rounded-full text-xs',
                active === t.id ? 'bg-white/20' : 'bg-stone-200',
              )}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
