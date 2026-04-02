import React from 'react';
import { cx } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
}

export function Textarea({ label, required, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">
          {label}
          {required && <span className="text-orange-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        className={cx(
          'w-full rounded-xl px-4 py-3 text-sm bg-stone-50 border-2 border-transparent text-stone-900 focus:border-stone-300 focus:bg-white transition-all outline-none resize-none',
          className,
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
