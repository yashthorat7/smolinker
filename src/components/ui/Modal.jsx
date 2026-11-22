import { useEffect } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  wide = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-delayed">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      
      <div 
        className={`relative z-10 w-full ${
          wide ? 'max-w-lg' : 'max-w-md'
        } max-h-[85vh] flex flex-col bg-[#0a0a0d] border border-white/10 rounded-lg p-5 shadow-[0_24px_48px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] animate-modal-pop`}
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4 shrink-0">
          <h2 className="text-[14px] font-medium text-white tracking-tight">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/[0.06] transition-colors duration-150 cursor-pointer outline-none"
            title="Close (Esc)"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="text-[14px] flex-1 overflow-y-auto pr-0.5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
