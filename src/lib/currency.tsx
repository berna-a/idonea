import { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'CVE' | 'EUR';

/** CVE is pegged to the Euro at a fixed rate (Acordo de Cooperação Cambial, 1998). */
const CVE_PER_EUR = 110.265;
const STORAGE_KEY = 'idonea-currency';

const readStored = (): Currency => {
  if (typeof window === 'undefined') return 'CVE';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === 'EUR' || saved === 'CVE' ? saved : 'CVE';
};

const num = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Price in the active currency, with an explicit, legible currency label. */
  formatPrice: (priceInCve: number, suffix?: string) => string;
  /** The same price expressed in the other currency, for a small "≈ …" line. */
  formatEquivalent: (priceInCve: number, suffix?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>(readStored);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* storage may be unavailable (private mode) — ignore */
    }
  };

  const formatPrice = (priceInCve: number, suffix = '') => {
    if (currency === 'EUR') {
      return `${num(priceInCve / CVE_PER_EUR, 'pt-PT')} €${suffix}`;
    }
    return `${num(priceInCve, 'pt-PT')} CVE${suffix}`;
  };

  const formatEquivalent = (priceInCve: number, suffix = '') => {
    if (currency === 'EUR') {
      return `≈ ${num(priceInCve, 'pt-PT')} CVE${suffix}`;
    }
    return `≈ ${num(priceInCve / CVE_PER_EUR, 'pt-PT')} €${suffix}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, formatEquivalent }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
