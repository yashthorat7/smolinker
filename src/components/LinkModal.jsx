import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ClickStats from '@/components/ClickStats';
import { getUrlClicks } from '@/services/clickService';

const Field = ({ label, value, copyable = false }) => {
  const [copied, setCopied] = useState(false);
  if (!value) return null;

  const handleCopy = (e) => {
    if (!copyable) return;
    e.stopPropagation();
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div 
      className={`flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-b-0 ${
        copyable ? 'cursor-pointer hover:bg-white/[0.02] px-1 -mx-1 rounded transition-colors duration-150' : ''
      }`}
      onClick={handleCopy}
      title={copyable ? (copied ? 'Copied' : 'Click to copy') : String(value)}
    >
      <span className="text-zinc-500 shrink-0 mr-4 text-[14px]">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0 justify-end">
        <span className="text-zinc-200 text-right truncate font-mono text-[14px]">{value}</span>
        {copyable && copied && (
          <span className="text-orange-400 text-[12px] font-sans">copied</span>
        )}
      </div>
    </div>
  );
};

const LinkModal = ({
  link,
  isOpen,
  onClose,
  onUpdateUrl,
  onDelete,
}) => {
  const [editingUrl, setEditingUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [clicks, setClicks] = useState([]);
  const [loadingClicks, setLoadingClicks] = useState(false);
  const [showClicks, setShowClicks] = useState(false);
  const [analyticsTab, setAnalyticsTab] = useState('stats');
  const [expandedClick, setExpandedClick] = useState(null);

  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || window.location.origin;
  const shortLink = link ? `${websiteUrl}/${link.short_url}` : '';

  useEffect(() => {
    if (link) {
      setEditingUrl(link.original_url || '');
      setSaveSuccess(false);
      setShowClicks(false);
      setClicks([]);
      setExpandedClick(null);
      setAnalyticsTab('stats');
    }
  }, [link]);

  if (!link) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingUrl.trim() || editingUrl === link.original_url) return;
    setIsSaving(true);
    const success = await onUpdateUrl(link.id, editingUrl);
    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleToggleClicks = async () => {
    if (showClicks) {
      setShowClicks(false);
      setExpandedClick(null);
      return;
    }
    setLoadingClicks(true);
    try {
      const data = await getUrlClicks(link.id);
      setClicks(data || []);
      if (data && data.length > 0) {
        setExpandedClick(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch clicks:', err);
    } finally {
      setLoadingClicks(false);
      setShowClicks(true);
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };

  const buildLocation = (click) => {
    return [click.city, click.region, click.country].filter(Boolean).join(', ') || null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`/${link.short_url}`} wide={showClicks}>
      <div className="flex flex-col gap-4 text-[14px]">
        <div className="flex items-center justify-between p-3 bg-zinc-950 border border-white/10 rounded-lg">
          <a 
            href={shortLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-mono text-orange-400 hover:text-orange-300 transition-colors duration-150 truncate text-[14px]"
            title="Open short link in new tab"
          >
            {shortLink}
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/[0.06] transition-colors cursor-pointer outline-none shrink-0 ml-2"
            title={copied ? 'Copied' : 'Copy'}
          >
            {copied ? (
              <svg className="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>

        <form onSubmit={handleSave} className="flex gap-2">
          <Input
            type="text"
            value={editingUrl}
            onChange={(e) => setEditingUrl(e.target.value)}
            placeholder="Destination URL"
          />
          <Button 
            type="submit" 
            variant="primary" 
            size="sm" 
            disabled={isSaving || !editingUrl.trim() || editingUrl === link.original_url}
            className="shrink-0 text-[14px]"
          >
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'Save'}
          </Button>
        </form>

        <button 
          type="button"
          className="flex items-center justify-between w-full p-3 bg-zinc-950/40 border border-white/[0.08] rounded-lg cursor-pointer hover:bg-white/[0.03] transition-colors duration-200 outline-none text-left"
          onClick={handleToggleClicks}
        >
          <span className="text-zinc-300 text-[14px] font-medium">
            {showClicks ? 'Hide Analytics' : 'Analytics'}
          </span>
          <span className="font-mono text-zinc-400 text-[14px]">
            {loadingClicks ? 'loading...' : `${link.clicks} click${link.clicks !== 1 ? 's' : ''}`}
          </span>
        </button>

        {showClicks && (
          <div className="flex flex-col gap-3 animate-fade-in-delayed">
            {clicks.length > 0 && (
              <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 text-[14px]">
                <button
                  type="button"
                  onClick={() => setAnalyticsTab('stats')}
                  className={`px-3 py-1 rounded-md transition-colors duration-150 cursor-pointer outline-none select-none ${
                    analyticsTab === 'stats'
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Stats
                </button>
                <button
                  type="button"
                  onClick={() => setAnalyticsTab('log')}
                  className={`px-3 py-1 rounded-md transition-colors duration-150 cursor-pointer outline-none select-none ${
                    analyticsTab === 'log'
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Log ({clicks.length})
                </button>
              </div>
            )}

            {analyticsTab === 'stats' && clicks.length > 0 && (
              <ClickStats clicks={clicks} />
            )}

            {analyticsTab === 'log' && clicks.length > 0 && (
              <div className="flex flex-col gap-1.5 animate-fade-in-delayed">
                {clicks.map((click) => {
                  const isExpanded = expandedClick === click.id;

                  return (
                    <div key={click.id} className="rounded-lg border border-white/[0.08] overflow-hidden bg-[#09090c]">
                      <button 
                        type="button"
                        className="flex items-center justify-between w-full px-3.5 py-2.5 hover:bg-white/[0.03] transition-colors duration-150 cursor-pointer outline-none text-left"
                        onClick={() => setExpandedClick(isExpanded ? null : click.id)}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-orange-400/80" />
                          <span className="text-zinc-200 truncate text-[14px]">
                            {click.browser || 'Unknown'}{click.browser_version ? ` ${click.browser_version.split('.')[0]}` : ''} on {click.os || 'Unknown'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-3 text-[14px]">
                          {click.country && (
                            <span className="text-zinc-400">{click.city || click.country}</span>
                          )}
                          <span className="text-zinc-500 font-mono">
                            {formatTime(click.created_at)}
                          </span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 border-t border-white/[0.05] bg-[#070709] animate-fade-in-delayed">
                          <div className="rounded bg-zinc-950/70 border border-white/[0.04] px-3 py-1">
                            <Field label="IP Address" value={click.ip_address} copyable />
                            <Field label="Location" value={buildLocation(click)} />
                            <Field label="Coordinates" value={
                              (click.latitude && click.longitude) 
                                ? `${click.latitude}, ${click.longitude}` 
                                : null
                            } />
                            <Field label="ISP" value={click.isp} />
                            <Field label="Timezone" value={click.timezone} />
                            <Field label="Device" value={click.device_type} />
                            <Field label="Browser" value={
                              click.browser 
                                ? `${click.browser}${click.browser_version ? ' ' + click.browser_version : ''}` 
                                : null
                            } />
                            <Field label="OS" value={
                              click.os 
                                ? `${click.os}${click.os_version ? ' ' + click.os_version : ''}` 
                                : null
                            } />
                            <Field label="Screen" value={
                              (click.screen_width && click.screen_height) 
                            ? `${click.screen_width} x ${click.screen_height}` 
                            : null
                            } />
                            <Field label="Language" value={click.language} />
                            <Field label="Referrer" value={click.referrer || 'Direct'} />
                            <Field label="Touch" value={click.is_touch ? 'Yes' : 'No'} />
                            <Field label="Time" value={formatDate(click.created_at)} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {clicks.length === 0 && !loadingClicks && (
              <div className="text-center py-6 text-zinc-500 border border-dashed border-white/10 rounded-lg text-[14px]">
                No click data recorded yet.
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-white/[0.08]">
          <button 
            type="button"
            onClick={() => onDelete(link.id)}
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors duration-150 cursor-pointer outline-none"
            title="Delete link"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-[14px]"
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LinkModal;
