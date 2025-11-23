import React, { createContext, useContext, useMemo, useState } from "react";

export type DateRange = {
  start: Date | null; // inclusive
  end: Date | null;   // inclusive
};

type DateRangeContextValue = {
  range: DateRange;
  setRange: (r: DateRange) => void;
  // convenient helpers
  setStart: (d: Date | null) => void;
  setEnd: (d: Date | null) => void;
  reset: () => void;
};

const DateRangeContext = createContext<DateRangeContextValue | undefined>(undefined);

const DEFAULT_RANGE: DateRange = { start: null, end: null };

export function DateRangeProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<DateRange>(DEFAULT_RANGE);

  const value = useMemo<DateRangeContextValue>(() => ({
    range,
    setRange,
    setStart: (start) => setRange((prev) => ({ ...prev, start })),
    setEnd: (end) => setRange((prev) => ({ ...prev, end })),
    reset: () => setRange(DEFAULT_RANGE),
  }), [range]);

  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const ctx = useContext(DateRangeContext);
  if (!ctx) throw new Error("useDateRange must be used within a DateRangeProvider");
  return ctx;
}
