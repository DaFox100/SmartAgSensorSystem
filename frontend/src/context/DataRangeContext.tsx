import { createContext, useContext, useState, type ReactNode } from "react";

type RangeMode = "24h" | "week" | "month" | "custom";

interface DateRangeContextValue {
  rangeMode: RangeMode;
  setRangeMode: (mode: RangeMode) => void;
  startDate: string | null; // "YYYY-MM-DD"
  endDate: string | null;
  setStartDate: (value: string | null) => void;
  setEndDate: (value: string | null) => void;
}

const DateRangeContext = createContext<DateRangeContextValue | undefined>(
  undefined
);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  // default: last 24h
  const [rangeMode, setRangeMode] = useState<RangeMode>("24h");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  return (
    <DateRangeContext.Provider
      value={{
        rangeMode,
        setRangeMode,
        startDate,
        endDate,
        setStartDate,
        setEndDate,
      }}
    >
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const ctx = useContext(DateRangeContext);
  if (!ctx) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return ctx;
}
