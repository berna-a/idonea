import { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'CVE' | 'EUR' | 'USD';

/** CVE is pegged to the Euro at a fixed rate (Acordo de Cooperação Cambial, 1998). */
const CVE_PER_EUR = 110.265;
/** Approximate — EUR/USD floats. Illustrative only; not a live rate. */
const USD_PER_EUR = 1.08;
const STORAGE_KEY = 'idonea-currency';

const CURRENCIES: Currency[] = ['CVE', 'EUR', 'USD'];

const readStored = (): Currency => {
  if (typeof window === 'undefined') return 'CVE';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return (CURRENCIES as string[]).includes(saved ?? '') ? (saved as Currency) : 'CVE';
};

const num = (value: number) =>
  new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 0 }).format(value);

const toCurrency = (priceInCve: number, currency: Currency): number => {
  if (currency === 'CVE') return priceInCve;
  const priceInEur = priceInCve / CVE_PER_EUR;
  return currency === 'EUR' ? priceInEur : priceInEur * USD_PER_EUR;
};

const SYMBOL: Record<Currency, string> = { CVE: 'CVE', EUR: '€', USD: '$' };

const formatIn = (priceInCve: number, currency: Currency, suffix: string) =>
  `${num(toCurrency(priceInCve, currency))} ${SYMBOL[currency]}${suffix}`;

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** Price in the active (primary) currency, with an explicit, legible label. */
  formatPrice: (priceInCve: number, suffix?: string) => string;
  /** The price in the two other currencies, for small "≈ …" lines beneath the primary. */
  formatEquivalents: (priceInCve: number, suffix?: string) => string[];
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

  const formatPrice = (priceInCve: number, suffix = '') => formatIn(priceInCve, currency, suffix);

  const formatEquivalents = (priceInCve: number, suffix = '') =>
    CURRENCIES.filter((c) => c !== currency).map((c) => `≈ ${formatIn(priceInCve, c, suffix)}`);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, formatEquivalents }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
