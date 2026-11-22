import { useState } from 'react';
import Checkbox from '@/components/ui/Checkbox';
import Button from '@/components/ui/Button';

const LinkTable = ({
  urls = [],
  isLoading = false,
  isDeleting = false,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onBulkDelete,
  onRowClick,
}) => {
  const [copiedId, setCopiedId] = useState(null);
  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || window.location.origin;

  const isAllSelected = urls.length > 0 && selectedIds.length === urls.length;
  const isSomeSelected = selectedIds.length > 0;

  const handleCopy = (u, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${websiteUrl}/${u.short_url}`);
    setCopiedId(u.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="text-zinc-500 text-[14px]">Loading links...</span>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-white/10 rounded-lg bg-[#09090c]/40">
        <p className="text-zinc-500 text-[14px]">No links shortened yet. Shorten one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3">
      {isSomeSelected && (
        <div className="flex items-center justify-between p-2.5 bg-[#101014] border border-white/10 rounded-lg animate-fade-in-delayed shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
          <span className="text-[14px] text-zinc-300 font-medium pl-1">
            {selectedIds.length} link{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="danger"
            size="sm"
            onClick={onBulkDelete}
            disabled={isDeleting}
            className="text-[14px]"
          >
            {isDeleting ? 'Deleting...' : `Delete (${selectedIds.length})`}
          </Button>
        </div>
      )}

      <div className="w-full overflow-x-auto border border-white/10 bg-[#09090c] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]">
        <table className="w-full text-left text-[14px] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] text-zinc-400 font-medium">
              <th className="py-2.5 px-3.5 w-10 text-center">
                <Checkbox
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  title="Select all links"
                />
              </th>
              <th className="py-2.5 px-3.5 font-medium">Original URL</th>
              <th className="py-2.5 px-3.5 font-medium w-32">Short Link</th>
              <th className="py-2.5 px-3.5 font-medium text-right w-16">Clicks</th>
              <th className="py-2.5 px-3.5 w-12 text-center" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {urls.map((u) => {
              const isSelected = selectedIds.includes(u.id);
              const isCopied = copiedId === u.id;

              return (
                <tr
                  key={u.id}
                  onClick={() => onRowClick(u)}
                  className={`group cursor-pointer transition-colors duration-150 hover:bg-white/[0.04] ${
                    isSelected ? 'bg-orange-500/[0.06]' : ''
                  }`}
                >
                  <td className="py-2.5 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onToggleSelect(u.id)}
                    />
                  </td>
                  <td className="py-2.5 px-3.5 max-w-[240px] sm:max-w-xs truncate">
                    <span 
                      className="text-zinc-200 group-hover:text-white transition-colors block truncate text-[14px]" 
                      title={u.original_url}
                    >
                      {u.original_url}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 whitespace-nowrap">
                    <span className="font-mono text-orange-400 text-[14px]">
                      /{u.short_url}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-zinc-400 whitespace-nowrap text-[14px]">
                    {u.clicks}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(u, e)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded hover:bg-white/[0.06] transition-colors cursor-pointer outline-none"
                      title={isCopied ? 'Copied!' : 'Copy short link'}
                    >
                      {isCopied ? (
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LinkTable;
