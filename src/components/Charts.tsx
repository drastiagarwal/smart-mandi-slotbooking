interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  highlightMax?: boolean;
}

export function BarChart({ data, height = 160, color = '#16a34a', highlightMax = false }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d, i) => {
        const h = max > 0 ? (d.value / max) * 100 : 0;
        const isMax = highlightMax && d.value === max;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
            <div className="text-[10px] font-bold text-earth-700 tabular-nums">{d.value}</div>
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t-md transition-all duration-500 hover:opacity-80 relative group"
                style={{
                  height: `${h}%`,
                  minHeight: d.value > 0 ? '4px' : '0',
                  background: isMax ? '#eab308' : color,
                }}
              />
            </div>
            <div className="text-[10px] font-semibold text-earth-500 truncate">{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 160 }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = size / 2 - 12;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-6 flex-wrap justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f5f5f4" strokeWidth={strokeWidth} />
          {data.map((d, i) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const circle = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                className="transition-all duration-500"
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-display font-bold text-earth-900">{total}</div>
          <div className="text-[10px] font-semibold text-earth-500 uppercase tracking-wide">Total</div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.color }} />
            <span className="font-medium text-earth-700 flex-1">{d.label}</span>
            <span className="font-bold text-earth-900 tabular-nums">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function LineChart({ data, height = 140, color = '#16a34a' }: LineChartProps) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const width = 100;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - min) / range) * (height - 20) - 10;
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
  const gradId = `grad-${color.replace('#', '')}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradId})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={color} />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {data.map((d, i) => (
          <div key={i} className="text-[10px] font-semibold text-earth-500">{d.label}</div>
        ))}
      </div>
    </div>
  );
}

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({ value, max, size = 120, color = '#16a34a', label, sublabel }: ProgressRingProps) {
  const radius = size / 2 - 10;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const fraction = max > 0 ? value / max : 0;
  const dash = fraction * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f5f5f4" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <div className="text-xl font-display font-bold text-earth-900">{label}</div>}
        {sublabel && <div className="text-[10px] font-semibold text-earth-500 uppercase tracking-wide">{sublabel}</div>}
      </div>
    </div>
  );
}
