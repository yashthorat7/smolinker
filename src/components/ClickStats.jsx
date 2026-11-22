import { useMemo, useCallback } from 'react';

const ClickStats = ({ clicks = [] }) => {
  const timeline = useMemo(() => {
    if (!clicks.length) return [];

    const dateMap = {};
    clicks.forEach((c) => {
      const d = new Date(c.created_at);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateMap[key] = (dateMap[key] || 0) + 1;
    });

    const entries = Object.entries(dateMap);
    const max = Math.max(...entries.map(([, count]) => count), 1);

    return entries.map(([date, count]) => ({
      date,
      count,
      heightPercent: Math.max((count / max) * 100, 12),
    }));
  }, [clicks]);

  const computeFrequencies = useCallback((key, fallback = 'Unknown') => {
    const map = {};
    clicks.forEach((c) => {
      const val = c[key] || fallback;
      map[val] = (map[val] || 0) + 1;
    });
    const total = clicks.length || 1;
    return Object.entries(map)
      .map(([label, count]) => ({
        label,
        count,
        percent: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [clicks]);

  const devices = useMemo(() => computeFrequencies('device_type', 'Desktop'), [computeFrequencies]);
  const countries = useMemo(() => computeFrequencies('country', 'Unknown'), [computeFrequencies]);
  const browsers = useMemo(() => computeFrequencies('browser', 'Unknown'), [computeFrequencies]);

  if (!clicks.length) {
    return (
      <div className="text-center py-6 text-zinc-500 text-[14px]">
        No analytics data available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in-delayed">
      <div className="p-4 bg-zinc-950/80 border border-white/[0.08] rounded-lg">
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-zinc-400 text-[14px] font-medium">Activity</span>
          <span className="font-mono text-zinc-400 text-[14px]">
            {clicks.length} total click{clicks.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="h-28 flex items-end gap-2 pt-4 pb-1 border-b border-white/[0.06]">
          {timeline.map((item, idx) => {
            const isLatest = idx === timeline.length - 1;
            return (
              <div 
                key={item.date} 
                className="flex-1 flex flex-col items-center justify-end h-full group"
                title={`${item.date}: ${item.count} click${item.count !== 1 ? 's' : ''}`}
              >
                <span className="font-mono text-[12px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  {item.count}
                </span>
                <div 
                  className={`w-full max-w-[28px] rounded-[2px] transition-all duration-300 ${
                    isLatest 
                      ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.3)]' 
                      : 'bg-zinc-700 hover:bg-zinc-600'
                  }`}
                  style={{ height: `${item.heightPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between pt-2">
          {timeline.map((item) => (
            <span key={item.date} className="font-mono text-[12px] text-zinc-500">
              {item.date}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 bg-zinc-950/80 border border-white/[0.08] rounded-lg">
        <div className="flex justify-between items-baseline mb-2.5">
          <span className="text-zinc-400 text-[14px] font-medium">Devices</span>
          <div className="flex gap-4 text-[14px] font-mono">
            {devices.map((d) => (
              <span key={d.label} className="text-zinc-300">
                {d.label} <span className="text-zinc-500">{d.percent}%</span>
              </span>
            ))}
          </div>
        </div>

        <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden flex gap-0.5">
          {devices.map((d, i) => (
            <div
              key={d.label}
              className={`h-full transition-all duration-300 ${
                i === 0 ? 'bg-orange-500' : i === 1 ? 'bg-zinc-500' : 'bg-zinc-700'
              }`}
              style={{ width: `${d.percent}%` }}
              title={`${d.label}: ${d.count} (${d.percent}%)`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 bg-zinc-950/80 border border-white/[0.08] rounded-lg flex flex-col gap-2.5">
          <span className="text-zinc-400 text-[14px] font-medium mb-1">Locations</span>
          {countries.slice(0, 4).map((c) => (
            <div key={c.label} className="flex flex-col gap-1">
              <div className="flex justify-between text-[14px]">
                <span className="text-zinc-200 truncate">{c.label}</span>
                <span className="font-mono text-zinc-500 shrink-0 ml-2">{c.percent}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500/80 transition-all duration-300"
                  style={{ width: `${c.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-zinc-950/80 border border-white/[0.08] rounded-lg flex flex-col gap-2.5">
          <span className="text-zinc-400 text-[14px] font-medium mb-1">Browsers</span>
          {browsers.slice(0, 4).map((b) => (
            <div key={b.label} className="flex flex-col gap-1">
              <div className="flex justify-between text-[14px]">
                <span className="text-zinc-200 truncate">{b.label}</span>
                <span className="font-mono text-zinc-500 shrink-0 ml-2">{b.percent}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-500 transition-all duration-300"
                  style={{ width: `${b.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClickStats;
