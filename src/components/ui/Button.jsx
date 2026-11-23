const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const variantClasses = {
    primary: 'btn-premium-primary',
    secondary: 'btn-premium-secondary',
    danger: 'btn-premium-danger',
    ghost: 'btn-premium-ghost',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn-premium text-[14px] ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
