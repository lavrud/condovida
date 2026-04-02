import React, { useState } from 'react';
import { cx } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export function Input({ label, error, required, className = '', ...props }: InputProps) {
  const [touched, setTouched] = useState(false);
  const showError = (touched || !!error) && error;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wider">
          {label}
          {required && <span className="text-orange-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        onBlur={() => setTouched(true)}
        className={cx(
          'w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none',
          showError
            ? 'bg-red-50 border-2 border-red-200 text-stone-900'
            : 'bg-stone-50 border-2 border-transparent text-stone-900 focus:border-stone-300 focus:bg-white',
          className,
        )}
        {...props}
      />
      {showError && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
