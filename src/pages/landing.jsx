import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { useNavigate } from 'react-router-dom';
import { createUrl } from '@/services/linkService';
import useLinks from '@/hooks/useLinks';
import LinkTable from '@/components/LinkTable';
import LinkModal from '@/components/LinkModal';
import Button from '@/components/ui/Button';

const Landing = () => {
  const { user, showTable, setShowTable } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [shortened, setShortened] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || window.location.origin;

  const {
    urls,
    isLoading,
    isDeleting,
    selectedIds,
    activeLinkModal,
    fetchLinks,
    toggleSelect,
    toggleSelectAll,
    handleBulkDelete,
    handleDeleteSingle,
    handleUpdateUrl,
    openModal,
    closeModal,
  } = useLinks(user);

  useEffect(() => {
    if (shortened && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [shortened]);

  useEffect(() => {
    if (!copied && !shortened) return;

    const handleOutsideClick = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setCopied(false);
        setShortened(null);
        setUrl('');
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [copied, shortened]);

  const validateUrl = (str) => {
    if (str.trim().includes(' ')) return false;
    try {
      const parsed = new URL(str);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const autoShorten = useCallback(async (pendingUrl, activeUser) => {
    if (!validateUrl(pendingUrl) || !activeUser) return;
    setIsShortening(true);
    try {
      const result = await createUrl({
        title: pendingUrl,
        longUrl: pendingUrl,
        customUrl: null,
        userId: activeUser.id,
      });
      setTimeout(() => {
        setShortened(result.short_url);
        setIsShortening(false);
        fetchLinks();
        setShowTable(true);
      }, 700);
    } catch (err) {
      console.error(err);
      setIsShortening(false);
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
  }, [fetchLinks, setShowTable]);

  useEffect(() => {
    if (user) {
      const pendingUrl = localStorage.getItem('pending_url');
      if (pendingUrl) {
        localStorage.removeItem('pending_url');
        setUrl(pendingUrl);
        autoShorten(pendingUrl, user);
      }
    }
  }, [user, autoShorten]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim() || !validateUrl(url)) {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
      return;
    }
    
    if (!user) {
      localStorage.setItem('pending_url', url);
      navigate('/auth');
      return;
    }

    setIsShortening(true);
    try {
      const result = await createUrl({
        title: url,
        longUrl: url,
        customUrl: null,
        userId: user.id,
      });

      setTimeout(() => {
        setShortened(result.short_url);
        setIsShortening(false);
        fetchLinks();
        setShowTable(true);
      }, 700);
    } catch (err) {
      console.error(err);
      setIsShortening(false);
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
    }
  };

  const handleCopy = (e) => {
    if (e) e.preventDefault();
    if (!shortened) return;
    
    navigator.clipboard.writeText(`${websiteUrl}/${shortened}`);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
      setShortened(null);
      setUrl('');
    }, 1500);
  };

  const displayValue = shortened ? `${websiteUrl}/${shortened}` : url;

  return (
    <div className={`flex flex-1 flex-col items-center px-4 pb-12 transition-all duration-300 ease-in-out ${
      user && showTable ? 'justify-start pt-12' : 'justify-center'
    }`}>
      <form 
        ref={formRef}
        onSubmit={shortened ? handleCopy : handleSubmit} 
        className={`flex items-center bg-[#09090c] border rounded-lg p-1.5 transition-colors duration-150 w-full max-w-[500px] shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] ${
          isError 
            ? 'border-red-500/80 ring-1 ring-red-500/20' 
            : 'border-white/10 hover:border-white/20 focus-within:border-orange-500/60 focus-within:ring-1 focus-within:ring-orange-500/20'
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onClick={shortened ? handleCopy : undefined}
          onChange={(e) => {
            if (!shortened && !isShortening) {
              setUrl(e.target.value);
              if (isError) setIsError(false);
            }
          }}
          placeholder="paste a long link here..."
          readOnly={!!shortened}
          className={`flex-1 bg-transparent border-none outline-none px-3.5 py-2 text-[14px] transition-colors ${
            shortened 
              ? 'text-orange-400 font-mono font-medium cursor-pointer' 
              : 'text-zinc-100 placeholder:text-zinc-600'
          }`}
        />
        <Button
          type={shortened ? 'button' : 'submit'}
          onClick={shortened ? handleCopy : undefined}
          disabled={isShortening}
          variant={copied ? 'secondary' : 'primary'}
          className="h-9 px-4 text-[14px] font-medium rounded-md shrink-0"
        >
          {copied ? (
            <span className="animate-fade-in-delayed text-orange-400">Copied</span>
          ) : isShortening ? (
            <span className="animate-fade-in-delayed inline-flex items-center">
              Shortening
              <span className="animate-dot-1">.</span>
              <span className="animate-dot-2">.</span>
              <span className="animate-dot-3">.</span>
            </span>
          ) : shortened ? (
            <span className="animate-fade-in-delayed">Copy</span>
          ) : (
            <span className="animate-fade-in-delayed">Shorten</span>
          )}
        </Button>
      </form>

      {user && showTable && (
        <div className="w-full max-w-[620px] mt-8 animate-fade-in-delayed">
          <LinkTable
            urls={urls}
            isLoading={isLoading}
            isDeleting={isDeleting}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onBulkDelete={handleBulkDelete}
            onRowClick={openModal}
          />
        </div>
      )}

      <LinkModal
        link={activeLinkModal}
        isOpen={!!activeLinkModal}
        onClose={closeModal}
        onUpdateUrl={handleUpdateUrl}
        onDelete={handleDeleteSingle}
      />
    </div>
  );
};

export default Landing;
