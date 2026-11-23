import { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  error = false,
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-[#0a0a0d] border ${
        error 
          ? 'border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
          : 'border-white/10 hover:border-white/20 focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/20'
      } rounded-lg px-3.5 py-2 text-[14px] text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors duration-150 ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
export default Input;
