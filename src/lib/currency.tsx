import { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'CVE' | 'EUR';

/** CVE is pegged to the Euro at a fixed rate (Acordo de Cooperação Cambial, 1998). */
const CVE_PER_EUR = 110.265;

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceInCve: number, suffix?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('CVE');

  const formatPrice = (priceInCve: number, suffix = '') => {
    if (currency === 'EUR') {
      const eur = priceInCve / CVE_PER_EUR;
      const formatted = new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
      }).format(eur);
      return `${formatted}${suffix}`;
    }
    const formatted = new Intl.NumberFormat('pt-CV', {
      style: 'currency',
      currency: 'CVE',
      minimumFractionDigits: 0,
    }).format(priceInCve);
    return `${formatted}${suffix}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
