/**
 * TimeFilter Component
 * Admin Analytics Dashboard - Phase 4
 * Period selection buttons (Hoy, 7 días, 30 días, Personalizado)
 */

'use client';

import { useState } from 'react';

type Period = 'today' | '7d' | '30d' | 'custom';

interface TimeFilterProps {
  /** Current active period */
  activePeriod: Period;
  /** Callback when period changes */
  onPeriodChange: (period: Period) => void;
  /** Show custom date picker (optional) */
  showCustom?: boolean;
  /** Custom date range (if custom is selected) */
  customRange?: { start: string; end: string };
  /** Callback for custom date changes */
  onCustomRangeChange?: (start: string, end: string) => void;
}

export default function TimeFilter({
  activePeriod,
  onPeriodChange,
  showCustom = false,
  customRange,
  onCustomRangeChange,
}: TimeFilterProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const periods: { value: Period; label: string }[] = [
    { value: 'today', label: 'Hoy' },
    { value: '7d', label: '7 días' },
    { value: '30d', label: '30 días' },
  ];

  const handleCustomClick = () => {
    if (activePeriod !== 'custom') {
      onPeriodChange('custom');
      setShowDatePicker(true);
    } else {
      setShowDatePicker(!showDatePicker);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Period buttons */}
      <div className="flex bg-surface-darker/50 rounded-lg p-1 border border-white/5">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => onPeriodChange(period.value)}
            className={`
              px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${activePeriod === period.value
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }
            `}
          >
            {period.label}
          </button>
        ))}

        {/* Custom button */}
        <button
          onClick={handleCustomClick}
          className={`
            px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${activePeriod === 'custom'
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'text-white/60 hover:text-white hover:bg-white/5'
            }
          `}
        >
          Custom
        </button>
      </div>

      {/* Custom date picker */}
      {showCustom && activePeriod === 'custom' && (
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <input
            type="date"
            value={customRange?.start || ''}
            onChange={(e) => {
              if (onCustomRangeChange && customRange) {
                onCustomRangeChange(e.target.value, customRange.end);
              }
            }}
            className="
              bg-surface-darker/50 border border-white/10 rounded-lg px-3 py-2
              text-sm text-white placeholder-white/40
              focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
            "
          />
          <span className="text-white/40 text-sm">—</span>
          <input
            type="date"
            value={customRange?.end || ''}
            onChange={(e) => {
              if (onCustomRangeChange && customRange) {
                onCustomRangeChange(customRange.start, e.target.value);
              }
            }}
            className="
              bg-surface-darker/50 border border-white/10 rounded-lg px-3 py-2
              text-sm text-white placeholder-white/40
              focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
            "
          />
        </div>
      )}
    </div>
  );
}