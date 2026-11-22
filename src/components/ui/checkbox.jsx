const Checkbox = ({
  checked = false,
  onChange,
  className = '',
  title,
  ...props
}) => {
  return (
    <label 
      className={`inline-flex items-center justify-center cursor-pointer select-none ${className}`}
      title={title}
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      <div 
        className={`w-3.5 h-3.5 rounded-[3px] border transition-all duration-150 flex items-center justify-center ${
          checked 
            ? 'bg-orange-500 border-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.3)]' 
            : 'border-white/20 bg-zinc-950/70 hover:border-zinc-500'
        }`}
      >
        {checked && (
          <div className="w-1.5 h-1.5 bg-white rounded-[1px] transition-transform duration-150 scale-100" />
        )}
      </div>
    </label>
  );
};

export default Checkbox;
