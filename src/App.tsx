import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, Shield, Activity, Users, Check, Menu, X as CloseIcon, 
  ArrowRight, BarChart2, Smartphone, Sun, Moon, Calendar, 
  ChevronLeft, ChevronRight, Instagram, Send, Youtube, MessageCircle, Calculator, RefreshCw
} from 'lucide-react';

// --- TYPES ---
interface DayData {
  day: number;
  pips: number;
  isWin: boolean;
  noTrade: boolean;
}

interface ManualDataMap {
  [key: string]: DayData[];
}

interface MarketPair {
  pair: string;
  price: number;
  change: number;
  isForex: boolean;
}

interface PricingCardProps {
  title: string;
  oldTitle?: string;
  price: string;
  period: string;
  oldPeriod?: string;
  features: string[];
  recommended?: boolean;
  badgeText?: string;
}

// --- DATA SOURCE: June 2025 - Nov 2025 ---
// Based on Intraday pips history.xlsx (Week 1 - Week 24)
const MANUAL_DATA: ManualDataMap = {
  // June 2025 (Month 5)
  "2025-5": [
    { day: 16, pips: 160, isWin: true, noTrade: false },
    { day: 17, pips: -26, isWin: false, noTrade: false },
    { day: 18, pips: 139, isWin: true, noTrade: false },
    { day: 19, pips: 44, isWin: true, noTrade: false },
    { day: 20, pips: 31, isWin: true, noTrade: false },
    { day: 23, pips: 83, isWin: true, noTrade: false },
    { day: 24, pips: -12, isWin: false, noTrade: false },
    { day: 25, pips: 91, isWin: true, noTrade: false },
    { day: 26, pips: 74, isWin: true, noTrade: false },
    { day: 27, pips: -38, isWin: false, noTrade: false },
    { day: 30, pips: 3, isWin: true, noTrade: false },
  ],
  // July 2025 (Month 6)
  "2025-6": [
    { day: 1, pips: 29, isWin: true, noTrade: false },
    { day: 2, pips: -37, isWin: false, noTrade: false },
    { day: 3, pips: 61, isWin: true, noTrade: false },
    { day: 4, pips: -18, isWin: false, noTrade: false },
    { day: 7, pips: 44, isWin: true, noTrade: false },
    { day: 8, pips: -22, isWin: false, noTrade: false },
    { day: 9, pips: 98, isWin: true, noTrade: false },
    { day: 10, pips: 37, isWin: true, noTrade: false },
    { day: 11, pips: -41, isWin: false, noTrade: false },
    { day: 14, pips: 56, isWin: true, noTrade: false },
    { day: 15, pips: 102, isWin: true, noTrade: false },
    { day: 16, pips: -15, isWin: false, noTrade: false },
    { day: 17, pips: 64, isWin: true, noTrade: false },
    { day: 18, pips: -29, isWin: false, noTrade: false },
    { day: 21, pips: 88, isWin: true, noTrade: false },
    { day: 22, pips: -17, isWin: false, noTrade: false },
    { day: 23, pips: 110, isWin: true, noTrade: false },
    { day: 24, pips: 45, isWin: true, noTrade: false },
    { day: 25, pips: -33, isWin: false, noTrade: false },
    { day: 28, pips: 71, isWin: true, noTrade: false },
    { day: 29, pips: -19, isWin: false, noTrade: false },
    { day: 30, pips: 93, isWin: true, noTrade: false },
    { day: 31, pips: 58, isWin: true, noTrade: false },
  ],
  // August 2025 (Month 7)
  "2025-7": [
    { day: 1, pips: -24, isWin: false, noTrade: false },
    { day: 4, pips: 84, isWin: true, noTrade: false },
    { day: 5, pips: -11, isWin: false, noTrade: false },
    { day: 6, pips: 96, isWin: true, noTrade: false },
    { day: 7, pips: 35, isWin: true, noTrade: false },
    { day: 8, pips: -27, isWin: false, noTrade: false },
    { day: 11, pips: 79, isWin: true, noTrade: false },
    { day: 12, pips: -14, isWin: false, noTrade: false },
    { day: 13, pips: 104, isWin: true, noTrade: false },
    { day: 14, pips: 42, isWin: true, noTrade: false },
    { day: 15, pips: -31, isWin: false, noTrade: false },
    { day: 18, pips: 90, isWin: true, noTrade: false },
    { day: 19, pips: -16, isWin: false, noTrade: false },
    { day: 20, pips: 111, isWin: true, noTrade: false },
    { day: 21, pips: 49, isWin: true, noTrade: false },
    { day: 22, pips: -28, isWin: false, noTrade: false },
    { day: 25, pips: 87, isWin: true, noTrade: false },
    { day: 26, pips: -12, isWin: false, noTrade: false },
    { day: 27, pips: 101, isWin: true, noTrade: false },
    { day: 28, pips: 54, isWin: true, noTrade: false },
    { day: 29, pips: -22, isWin: false, noTrade: false },
  ],
  // September 2025 (Month 8)
  "2025-8": [
    { day: 1, pips: 92, isWin: true, noTrade: false },
    { day: 2, pips: -17, isWin: false, noTrade: false },
    { day: 3, pips: 108, isWin: true, noTrade: false },
    { day: 4, pips: 47, isWin: true, noTrade: false },
    { day: 5, pips: -35, isWin: false, noTrade: false },
    { day: 8, pips: 76, isWin: true, noTrade: false },
    { day: 9, pips: -21, isWin: false, noTrade: false },
    { day: 10, pips: 95, isWin: true, noTrade: false },
    { day: 11, pips: 39, isWin: true, noTrade: false },
    { day: 12, pips: -26, isWin: false, noTrade: false },
    { day: 15, pips: 83, isWin: true, noTrade: false },
    { day: 16, pips: -18, isWin: false, noTrade: false },
    { day: 17, pips: 102, isWin: true, noTrade: false },
    { day: 18, pips: 44, isWin: true, noTrade: false },
    { day: 19, pips: -30, isWin: false, noTrade: false },
    { day: 22, pips: 91, isWin: true, noTrade: false },
    { day: 23, pips: -15, isWin: false, noTrade: false },
    { day: 24, pips: 106, isWin: true, noTrade: false },
    { day: 25, pips: 51, isWin: true, noTrade: false },
    { day: 26, pips: -28, isWin: false, noTrade: false },
    { day: 29, pips: 85, isWin: true, noTrade: false },
    { day: 30, pips: -19, isWin: false, noTrade: false },
  ],
  // October 2025 (Month 9)
  "2025-9": [
    { day: 1, pips: 97, isWin: true, noTrade: false },
    { day: 2, pips: 43, isWin: true, noTrade: false },
    { day: 3, pips: -33, isWin: false, noTrade: false },
    { day: 6, pips: 88, isWin: true, noTrade: false },
    { day: 7, pips: -17, isWin: false, noTrade: false },
    { day: 8, pips: 103, isWin: true, noTrade: false },
    { day: 9, pips: 49, isWin: true, noTrade: false },
    { day: 10, pips: -24, isWin: false, noTrade: false },
    { day: 13, pips: 79, isWin: true, noTrade: false },
    { day: 14, pips: -13, isWin: false, noTrade: false },
    { day: 15, pips: 94, isWin: true, noTrade: false },
    { day: 16, pips: 37, isWin: true, noTrade: false },
    { day: 17, pips: -29, isWin: false, noTrade: false },
    { day: 20, pips: 86, isWin: true, noTrade: false },
    { day: 21, pips: -18, isWin: false, noTrade: false },
    { day: 22, pips: 109, isWin: true, noTrade: false },
    { day: 23, pips: 52, isWin: true, noTrade: false },
    { day: 24, pips: -34, isWin: false, noTrade: false },
    { day: 27, pips: 90, isWin: true, noTrade: false },
    { day: 28, pips: -16, isWin: false, noTrade: false },
    { day: 29, pips: 101, isWin: true, noTrade: false },
    { day: 30, pips: 45, isWin: true, noTrade: false },
    { day: 31, pips: -27, isWin: false, noTrade: false },
  ],
  // November 2025 (Month 10)
  "2025-10": [
    { day: 3, pips: 85, isWin: true, noTrade: false },
    { day: 4, pips: -14, isWin: false, noTrade: false },
    { day: 5, pips: 97, isWin: true, noTrade: false },
    { day: 6, pips: 41, isWin: true, noTrade: false },
    { day: 7, pips: -31, isWin: false, noTrade: false },
    { day: 10, pips: 88, isWin: true, noTrade: false },
    { day: 11, pips: -19, isWin: false, noTrade: false },
    { day: 12, pips: 104, isWin: true, noTrade: false },
    { day: 13, pips: 47, isWin: true, noTrade: false },
    { day: 14, pips: -28, isWin: false, noTrade: false },
    { day: 17, pips: 92, isWin: true, noTrade: false },
    { day: 18, pips: -15, isWin: false, noTrade: false },
    { day: 19, pips: 110, isWin: true, noTrade: false },
    { day: 20, pips: 53, isWin: true, noTrade: false },
    { day: 21, pips: -26, isWin: false, noTrade: false },
    { day: 24, pips: 13, isWin: true, noTrade: false },
    { day: 25, pips: 79, isWin: true, noTrade: false },
    { day: 26, pips: 68, isWin: true, noTrade: false },
    { day: 27, pips: 142, isWin: true, noTrade: false },
    { day: 28, pips: -26, isWin: false, noTrade: false },
  ]
};

// Generates data for the calendar view
const generateMonthData = (year: number, month: number): DayData[] => {
  const key = `${year}-${month}`;
  
  if (MANUAL_DATA[key]) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const manualDays = MANUAL_DATA[key];
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const foundDay = manualDays.find(d => d.day === dayNum);
      if (foundDay) return { ...foundDay, noTrade: false };
      return { day: dayNum, pips: 0, isWin: false, noTrade: true };
    });
  }

  // Fallback: Return empty data for non-manual months
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    return { day: i + 1, pips: 0, isWin: false, noTrade: true };
  });
};

const getMonthName = (monthIndex: number): string => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthIndex];
};

// --- COMPONENTS ---

const PipsCalculator = () => {
  const [pair, setPair] = useState('EUR/USD');
  const [lotSize, setLotSize] = useState('1.0');
  const [pips, setPips] = useState('10');
  const [rates, setRates] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // New States for Price inputs
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [forecastPrice, setForecastPrice] = useState<string>('');

  const getPipDecimal = (p: string) => (p.includes('JPY') || p.includes('XAU')) ? 0.01 : 0.0001;
  const getDisplayDecimals = (p: string) => (p.includes('JPY') || p.includes('XAU')) ? 2 : 4;

  // Helper to calculate exchange rate from USD-based rates object
  const getExchangeRate = (pairName: string, ratesData: any) => {
    if (!ratesData) return 1;
    const base = pairName.split('/')[0];
    const quote = pairName.split('/')[1];
    const rateBase = base === 'USD' ? 1 : (ratesData[base] || 1);
    const rateQuote = quote === 'USD' ? 1 : (ratesData[quote] || 1);
    return rateQuote / rateBase;
  };

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        setRates(data.rates);
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch rates");
        setLoading(false);
      }
    };
    fetchRates();
    // Refresh every minute
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, []);

  // Update current price & recalculate forecast when rates or pair change
  useEffect(() => {
    if (rates) {
      const rate = getExchangeRate(pair, rates);
      const cpStr = rate.toFixed(getDisplayDecimals(pair));
      setCurrentPrice(cpStr);
      
      // Recalc forecast based on current pips
      const cp = parseFloat(cpStr);
      const p = parseFloat(pips) || 0;
      const pipSize = getPipDecimal(pair);
      const newForecast = cp + (p * pipSize);
      setForecastPrice(newForecast.toFixed(getDisplayDecimals(pair)));
    }
  }, [rates, pair]); // Removed 'pips' from dependency to prevent loop, logic handles init

  // Handler: Change Pips -> Update Forecast
  const handlePipsChange = (val: string) => {
    setPips(val);
    const p = parseFloat(val);
    const cp = parseFloat(currentPrice);
    if (!isNaN(p) && !isNaN(cp)) {
      const pipSize = getPipDecimal(pair);
      const newForecast = cp + (p * pipSize);
      setForecastPrice(newForecast.toFixed(getDisplayDecimals(pair)));
    }
  };

  // Handler: Change Forecast -> Update Pips
  const handleForecastChange = (val: string) => {
    setForecastPrice(val);
    const fp = parseFloat(val);
    const cp = parseFloat(currentPrice);
    if (!isNaN(fp) && !isNaN(cp)) {
      const pipSize = getPipDecimal(pair);
      const newPips = (fp - cp) / pipSize;
      setPips(newPips.toFixed(1));
    }
  };

  // Handler: Change Current Price -> Update Forecast (keep pips constant)
  const handleCurrentPriceChange = (val: string) => {
    setCurrentPrice(val);
    const cp = parseFloat(val);
    const p = parseFloat(pips);
    if (!isNaN(cp) && !isNaN(p)) {
      const pipSize = getPipDecimal(pair);
      const newForecast = cp + (p * pipSize);
      setForecastPrice(newForecast.toFixed(getDisplayDecimals(pair)));
    }
  };

  const calculateProfit = () => {
    // Uses notebook logic for pip value
    if (!rates) return { pipValue: 0, totalProfit: 0 };
    
    const lots = parseFloat(lotSize) || 0;
    const pipCount = parseFloat(pips) || 0;
    const cp = parseFloat(currentPrice) || 1; // Use current price from input

    // 1. Determine Unit Size
    const tradeSizeUnits = lots * 100000;

    // 2. Determine Pip Size
    const isJPY = pair.includes('JPY');
    const isXAU = pair.includes('XAU');
    const pipDecimal = getPipDecimal(pair);

    // 3. Determine Exchange Rate (Use the input current price for accuracy)
    const exchangeRate = cp; 

    // 4. Calculate Pip Value in BASE Currency
    const pipValueInBase = (pipDecimal / exchangeRate) * tradeSizeUnits;

    // 5. Convert to USD (Account Currency)
    const base = pair.split('/')[0];
    // Need rate of Base -> USD. 
    // rates[base] gives USD -> Base. So 1 / rates[base] is Base -> USD.
    // If base is USD, factor is 1.
    const rateUSDToBase = base === 'USD' ? 1 : (rates[base] || 1);
    const pipValueUSD = pipValueInBase * (1 / rateUSDToBase); // This logic assumes rateUSDToBase is USD per 1 unit of Base?
    // Wait: API returns rates relative to 1 USD. e.g. EUR: 0.95.
    // So 1 USD = 0.95 EUR. 
    // Value is in EUR. To get USD: ValueEUR / 0.95.
    // So: pipValueUSD = pipValueInBase / rates[base]
    
    let finalPipValue = 0;
    if (base === 'USD') {
        finalPipValue = pipValueInBase;
    } else {
        finalPipValue = pipValueInBase / (rates[base] || 1);
    }

    // Override for XAU/USD industry standard
    if (isXAU) finalPipValue = lots * 10;

    // Override for simple USD Quote pairs (EUR/USD) to strictly $10/lot
    // The formula above is mathematically correct for cross pairs but usually EURUSD is exactly $10.
    if (pair.endsWith('USD') && !isXAU) finalPipValue = lots * 10;

    // For USD/JPY type pairs, the formula: (0.01 / Rate) * 100,000 is correct value in USD.
    // Let's verify USD/JPY. Base=USD. Rate=150.
    // val_base (USD) = (0.01 / 150) * 100000 = 6.66 USD. Correct.

    return {
      pipValue: finalPipValue,
      totalProfit: finalPipValue * pipCount
    };
  };

  const { pipValue, totalProfit } = calculateProfit();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md mx-auto relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center space-x-2">
           <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
             <Calculator size={20} className="text-blue-600 dark:text-blue-400" />
           </div>
           <div>
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pip Calculator</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
               Live Rates {loading && <RefreshCw size={10} className="ml-1 animate-spin"/>}
             </p>
           </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Row 1: Pair & Lot */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Pair</label>
            <select 
              value={pair} 
              onChange={(e) => setPair(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="EUR/USD">EUR/USD</option>
              <option value="GBP/USD">GBP/USD</option>
              <option value="XAU/USD">XAU/USD</option>
              <option value="USD/JPY">USD/JPY</option>
              <option value="USD/CAD">USD/CAD</option>
              <option value="USD/CHF">USD/CHF</option>
              <option value="AUD/USD">AUD/USD</option>
            </select>
          </div>
          <div>
             <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Lot Size</label>
             <input 
               type="number" 
               step="0.01"
               value={lotSize}
               onChange={(e) => setLotSize(e.target.value)}
               className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
             />
          </div>
        </div>

        {/* Row 2: Current Price & Forecast Price */}
        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Current Price</label>
             <input 
               type="number" 
               value={currentPrice}
               onChange={(e) => handleCurrentPriceChange(e.target.value)}
               className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
             />
           </div>
           <div>
             <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Forecast Price</label>
             <input 
               type="number" 
               value={forecastPrice}
               onChange={(e) => handleForecastChange(e.target.value)}
               className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
             />
           </div>
        </div>

        {/* Pips */}
        <div>
           <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Target Pips</label>
           <input 
             type="number" 
             value={pips}
             onChange={(e) => handlePipsChange(e.target.value)}
             className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
           />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-4 pt-2">
           <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Pip Value (1 Pip)</span>
              <span className="text-lg font-bold text-slate-700 dark:text-slate-200">${pipValue.toFixed(2)}</span>
           </div>
           <div className={`bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/30`}>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 block mb-1">Estimated Profit</span>
              <span className={`text-lg font-bold ${totalProfit >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
              </span>
           </div>
        </div>
      </div>
    </div>
  );
};

const MarketTicker = () => {
  const [pairs, setPairs] = useState<MarketPair[]>([
    { pair: 'EUR/USD', price: 1.0550, change: 0.15, isForex: true },
    { pair: 'GBP/USD', price: 1.2680, change: -0.10, isForex: true },
    { pair: 'USD/JPY', price: 151.40, change: 0.45, isForex: true },
    { pair: 'XAU/USD', price: 4188.625, change: 1.25, isForex: true }, 
    { pair: 'BTC/USD', price: 96500.00, change: 2.50, isForex: false },
    { pair: 'ETH/USD', price: 3650.00, change: 1.80, isForex: false },
  ]);

  useEffect(() => {
    let ws: WebSocket | null = null;

    try {
      ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@miniTicker/ethusdt@miniTicker');
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        setPairs(currentPairs => 
          currentPairs.map(p => {
            if (msg.s === 'BTCUSDT' && p.pair === 'BTC/USD') {
              return { ...p, price: parseFloat(msg.c), change: parseFloat(msg.P) };
            }
            if (msg.s === 'ETHUSDT' && p.pair === 'ETH/USD') {
              return { ...p, price: parseFloat(msg.c), change: parseFloat(msg.P) };
            }
            return p;
          })
        );
      };
    } catch (e) {
      console.log("WS Blocked by environment");
    }

    const fetchForexBase = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await res.json();
        if (data && data.rates) {
          setPairs(prev => prev.map(p => {
             if (p.pair === 'EUR/USD') return { ...p, price: 1 / data.rates.EUR };
             if (p.pair === 'GBP/USD') return { ...p, price: 1 / data.rates.GBP };
             if (p.pair === 'USD/JPY') return { ...p, price: data.rates.JPY };
             return p;
          }));
        }
      } catch (e) {}
    };
    fetchForexBase();

    const interval = setInterval(() => {
      setPairs(currentPairs => 
        currentPairs.map(p => {
          const isCrypto = !p.isForex;
          const volatility = isCrypto ? (p.price * 0.0005) : (p.pair === 'XAU/USD' ? 0.5 : 0.0005); 
          return {
            ...p,
            price: p.price + (Math.random() - 0.5) * volatility,
            change: p.change + (Math.random() - 0.5) * 0.02
          };
        })
      );
    }, 1500);

    return () => {
      if (ws) ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full bg-slate-900 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 overflow-hidden py-2 transition-colors duration-300 relative">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...pairs, ...pairs, ...pairs].map((p, i) => (
          <div key={i} className="flex items-center mx-4 md:mx-6 space-x-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 text-xs md:text-sm">{p.pair}</span>
            <span className={`text-xs md:text-sm font-mono ${p.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-500'}`}>
              {p.price.toFixed(p.pair.includes('JPY') || p.pair.includes('XAU') ? 2 : 4)}
            </span>
            <span className={`text-[10px] md:text-xs ${p.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-500'}`}>
              {p.change >= 0 ? '+' : ''}{p.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Navbar = ({ isDarkMode, toggleTheme }: { isDarkMode: boolean, toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-2 md:top-4 z-50 px-2 md:px-4 mb-8">
      <nav className="max-w-7xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl rounded-full transition-all duration-300">
        <div className="px-4 sm:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  INTRADAY<span className="text-slate-800 dark:text-white">PIPS</span>
                </span>
              </div>
              <div className="hidden lg:block">
                <div className="ml-10 flex items-baseline space-x-6">
                  <a href="#home" className="text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</a>
                  <a href="#features" className="text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Why Us</a>
                  <a href="#results" className="text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Results</a>
                  <a href="#pricing" className="text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Pricing</a>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <a href="https://t.me/IntradayPips" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/20 inline-block">
                Join Free Channel
              </a>
            </div>
            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center space-x-2">
                <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
              >
                {isOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-2xl px-4 pb-4">
            <div className="pt-2 space-y-1">
              <a href="#home" onClick={() => setIsOpen(false)} className="text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 block px-3 py-3 rounded-md text-base font-medium border-b border-slate-100 dark:border-slate-800">Home</a>
              <a href="#features" onClick={() => setIsOpen(false)} className="text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 block px-3 py-3 rounded-md text-base font-medium border-b border-slate-100 dark:border-slate-800">Why Us</a>
              <a href="#results" onClick={() => setIsOpen(false)} className="text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 block px-3 py-3 rounded-md text-base font-medium border-b border-slate-100 dark:border-slate-800">Results</a>
              <a href="#pricing" onClick={() => setIsOpen(false)} className="text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 block px-3 py-3 rounded-md text-base font-medium">Pricing</a>
              <a href="https://t.me/IntradayPips" target="_blank" rel="noopener noreferrer" className="w-full mt-4 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-transform block text-center">
                Join Free Channel
              </a>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

const Hero = () => {
  return (
    <div id="home" className="relative bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-transparent via-slate-50/50 dark:via-slate-900/50 to-slate-50 dark:to-slate-900 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16 md:pb-32">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6 md:mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
            <span className="text-slate-600 dark:text-slate-300 text-[10px] md:text-xs font-semibold tracking-wide uppercase">Live Signals Active</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 md:mb-8 leading-tight">
            Master the Markets <br />
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
              One Pip at a Time
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 md:mb-10 px-4">
            Professional Forex & Gold signals, detailed market analysis, and a community of disciplined traders. Stop gambling, start trading.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4">
            <a href="#pricing" className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-white bg-blue-600 hover:bg-blue-500 md:text-lg transition-all shadow-lg shadow-blue-500/25 active:scale-95">
              Get VIP Access
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a href="#results" className="flex items-center justify-center px-8 py-4 border border-slate-300 dark:border-slate-600 text-base font-bold rounded-full text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 md:text-lg transition-all backdrop-blur-sm active:scale-95">
              View Monthly Results
            </a>
          </div>
        </div>

        {/* --- PIPS CALCULATOR --- */}
        <div className="mt-12 md:mt-16 transform transition-all duration-300 hover:scale-105">
           <PipsCalculator />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactElement, title: string, desc: string }) => (
  <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl hover:shadow-xl dark:hover:bg-slate-800 transition-all duration-300 group">
    <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
      {React.cloneElement(icon, { className: "text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" })}
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">{desc}</p>
  </div>
);

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Why Traders Choose <span className="text-blue-600 dark:text-blue-500">IntradayPips</span></h2>
          <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We don't just provide signals; we provide a framework for profitability.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard 
            icon={<TrendingUp size={24} />} 
            title="High Probability Setups" 
            desc="Our analysis filters out the noise. We only trade when the technicals and fundamentals align perfectly."
          />
          <FeatureCard 
            icon={<Shield size={24} />} 
            title="Strict Risk Management" 
            desc="Capital preservation is key. Every signal includes precise Stop Loss and Take Profit levels calculated for optimal R:R."
          />
          <FeatureCard 
            icon={<Activity size={24} />} 
            title="Live Market Updates" 
            desc="Markets change fast. We provide real-time updates on active trades to secure profits or minimize risk."
          />
          <FeatureCard 
            icon={<Users size={24} />} 
            title="Mentorship Community" 
            desc="Join over 5,000 traders. Share analysis, ask questions, and grow alongside disciplined individuals."
          />
          <FeatureCard 
            icon={<BarChart2 size={24} />} 
            title="Transparent Performance" 
            desc="No hiding losses. We publish weekly and monthly recaps of every trade taken by our team."
          />
          <FeatureCard 
            icon={<Smartphone size={24} />} 
            title="Mobile Alerts" 
            desc="Never miss a move. Get instant notifications on your phone via our premium Telegram channel."
          />
        </div>
      </div>
    </section>
  );
};

// --- CALENDAR & RESULTS COMPONENTS ---

const CalendarDay = ({ day, pips, isWin, noTrade }: DayData) => (
  <div className={`aspect-square p-1 border rounded-lg md:rounded-xl flex flex-col items-center justify-between transition-all hover:scale-105 ${
    noTrade || pips === 0 
        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
        : isWin 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' 
            : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50'
  }`}>
    <span className={`text-[9px] md:text-xs font-bold self-start ${
      noTrade || pips === 0 ? 'text-slate-400' : isWin ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
    }`}>
      {day}
    </span>
    {!noTrade && pips !== 0 ? (
      <div className="flex flex-col items-center">
         <span className={`text-[10px] sm:text-xs md:text-lg font-mono font-bold ${
           isWin ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
         }`}>
           {isWin ? '+' : ''}{pips}
         </span>
         <span className="hidden md:inline text-[10px] uppercase font-bold opacity-60 text-slate-500">pips</span>
      </div>
    ) : (
      <span className="text-[10px] md:text-xs text-slate-300 dark:text-slate-600">-</span>
    )}
    <div className={`h-1 w-full rounded-full ${
      noTrade || pips === 0 ? 'bg-transparent' : isWin ? 'bg-emerald-500' : 'bg-rose-500'
    }`}></div>
  </div>
);

const WeeklyTotal = ({ total }: { total: number }) => (
  <div className={`aspect-square p-1 border rounded-lg md:rounded-xl flex flex-col items-center justify-center transition-all bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700`}>
    <span className="text-[8px] md:text-[10px] uppercase font-bold text-slate-500 mb-1">Total</span>
    <span className={`text-xs md:text-lg font-mono font-bold ${
      total > 0 ? 'text-emerald-600 dark:text-emerald-400' : total < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'
    }`}>
      {total > 0 ? '+' : ''}{total}
    </span>
  </div>
);

const Results = () => {
  const [viewDate, setViewDate] = useState(new Date(2025, 10, 1)); 
  const [cachedData, setCachedData] = useState<ManualDataMap>({});

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cacheKey = `${year}-${month}`;

  const hasData = MANUAL_DATA[cacheKey] !== undefined;
  const startDayOffset = new Date(year, month, 1).getDay();

  useEffect(() => {
     if (!cachedData[cacheKey]) {
        const newData = generateMonthData(year, month);
        setCachedData(prev => ({ ...prev, [cacheKey]: newData }));
     }
  }, [cacheKey]);

  const currentData = cachedData[cacheKey] || [];
  
  const activeTrades = currentData.filter(d => !d.noTrade && d.pips !== 0);
  const totalPips = activeTrades.reduce((acc, curr) => acc + curr.pips, 0);
  const winCount = activeTrades.filter(d => d.isWin).length;
  const winRate = activeTrades.length > 0 ? Math.round((winCount / activeTrades.length) * 100) : 0;

  // Process data into weeks
  const weeks = useMemo(() => {
    const fullList = [...Array(startDayOffset).fill(null), ...currentData];
    const chunks = [];
    for (let i = 0; i < fullList.length; i += 7) {
        const weekDays = fullList.slice(i, i + 7);
        // Fill remaining days if last week is incomplete
        while(weekDays.length < 7) weekDays.push(null);
        
        // Calculate weekly total
        const weekTotal = weekDays.reduce((acc, day) => {
            if (day && !day.noTrade) return acc + day.pips;
            return acc;
        }, 0);
        
        chunks.push({ days: weekDays, total: weekTotal });
    }
    return chunks;
  }, [currentData, startDayOffset]);

  const navigateMonth = (direction: number) => {
     const newDate = new Date(viewDate);
     newDate.setMonth(viewDate.getMonth() + direction);
     setViewDate(newDate);
  };

  return (
    <section id="results" className="py-16 md:py-24 bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Transparency First</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 text-base md:text-lg">
              We track every pip. Our monthly calendar is updated daily. Green days mean profit, red days mean we managed risk. Use the arrows to browse our history.
            </p>
            
            {hasData ? (
               <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
                  <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                     <div className={`text-2xl md:text-3xl font-bold mb-1 ${totalPips >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                        {totalPips > 0 ? '+' : ''}{totalPips}
                     </div>
                     <div className="text-slate-500 text-xs md:text-sm">{getMonthName(month)} Pips</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                     <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{winRate}%</div>
                     <div className="text-slate-500 text-xs md:text-sm">{getMonthName(month)} Win Rate</div>
                  </div>
               </div>
            ) : (
               <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Data Available</h3>
                  <p className="text-slate-500">We don't have public data for this month. Try navigating to June - Nov 2025.</p>
               </div>
            )}

            <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Profit Day</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Loss Day</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 mr-2"></div>
                    <span className="text-sm text-slate-600 dark:text-slate-400">No Trades</span>
                </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl transform -translate-y-4"></div>
            
            <div className="w-full bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative z-10">
               <div className="px-4 md:px-6 py-4 md:py-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center space-x-4">
                     <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                       <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
                     </div>
                     <div className="text-center sm:text-left">
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">Trading Performance</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{getMonthName(month)} {year}</p>
                     </div>
                  </div>
                  <div className="flex space-x-2">
                     <button onClick={() => navigateMonth(-1)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><ChevronLeft size={20}/></button>
                     <button onClick={() => navigateMonth(1)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><ChevronRight size={20}/></button>
                  </div>
               </div>

               {/* Calendar Grid Container - Scrollable on small mobile */}
               <div className="p-4 md:p-6 overflow-x-auto">
                  <div className="min-w-[600px] md:min-w-0"> {/* Minimum width to prevent crushing on mobile */}
                      {/* Header Row */}
                      <div className="grid grid-cols-8 gap-1 md:gap-2 mb-2 text-center">
                         {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                            <div key={d} className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">{d}</div>
                         ))}
                         <div className="text-[10px] md:text-xs font-bold text-blue-500 uppercase tracking-wider">Total</div>
                      </div>
                      
                      {/* Weeks Rows */}
                      <div className="space-y-1 md:space-y-2">
                         {weeks.map((week, wIdx) => (
                            <div key={wIdx} className="grid grid-cols-8 gap-1 md:gap-2">
                               {week.days.map((d, dIdx) => (
                                  d ? <CalendarDay key={d.day} {...d} /> : <div key={`empty-${dIdx}`} className="aspect-square"></div>
                               ))}
                               <WeeklyTotal total={week.total} />
                            </div>
                         ))}
                      </div>
                  </div>
               </div>
               
               <div className="bg-slate-50 dark:bg-slate-950/50 px-4 md:px-6 py-4 flex justify-between items-center text-sm border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-6">
                     <div>
                        <span className="block text-slate-500 text-[10px] uppercase font-bold">Net Pips</span>
                        <span className={`text-base md:text-lg font-bold ${totalPips > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                           {totalPips > 0 ? '+' : ''}{totalPips}
                        </span>
                     </div>
                     <div>
                        <span className="block text-slate-500 text-[10px] uppercase font-bold">Win Rate</span>
                        <span className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">{winRate}%</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PricingCard = ({ title, oldTitle, price, period, oldPeriod, features, recommended = false, badgeText }: PricingCardProps) => (
  <div className={`relative flex flex-col p-6 md:p-8 rounded-3xl border transition-all duration-300 ${
    recommended 
      ? 'bg-slate-900 dark:bg-slate-900 border-blue-500 shadow-2xl shadow-blue-900/20 scale-100 md:scale-105 z-10' 
      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700'
  }`}>
    {recommended && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-4 py-1 rounded-full text-xs md:text-sm font-bold shadow-lg whitespace-nowrap">
        Most Popular
      </div>
    )}
    {badgeText && !recommended && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-rose-500 text-white px-4 py-1 rounded-full text-xs md:text-sm font-bold shadow-lg whitespace-nowrap">
        {badgeText}
      </div>
    )}
    <h3 className={`text-base md:text-lg font-medium uppercase tracking-wide ${recommended ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
        {oldTitle && <span className="line-through decoration-rose-500 decoration-2 opacity-70 mr-2">{oldTitle}</span>}
        {title}
    </h3>
    <div className={`mt-4 flex items-baseline ${recommended ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
      <span className="text-3xl md:text-4xl font-extrabold tracking-tight">${price}</span>
      <span className="ml-1 text-lg md:text-xl text-slate-500">
        {oldPeriod && <span className="line-through decoration-rose-500 decoration-2 mr-1">/{oldPeriod}</span>}
        /{period}
      </span>
    </div>
    <ul className="mt-6 md:mt-8 space-y-4 flex-1">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-start">
          <Check className="flex-shrink-0 h-5 w-5 text-emerald-500" />
          <span className={`ml-3 text-sm ${recommended ? 'text-slate-300' : 'text-slate-600 dark:text-slate-300'}`}>{feature}</span>
        </li>
      ))}
    </ul>
    <a href="https://t.me/IntradayPips" target="_blank" rel="noopener noreferrer" className={`mt-8 w-full block py-3 px-6 border border-transparent rounded-full text-center font-bold transition-all shadow-lg active:scale-95 ${
      recommended 
        ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/25' 
        : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`}>
      {price === '0' ? 'Join Now' : 'Get Started'}
    </a>
  </div>
);

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Choose the plan that fits your trading journey.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto items-start">
          <PricingCard 
            title="2 Weeks Access" 
            oldTitle="Weekly Trial"
            price="20" 
            period="2wks" 
            oldPeriod="wk"
            badgeText="Special Offer  Limited Time Only"
            features={[
              "2 Weeks for Price of 1",
              "Full VIP Signal Access",
              "Entry & Exit Updates"
            ]} 
          />
          <PricingCard 
            title="Monthly VIP" 
            price="49" 
            period="mo" 
            features={[
              "All Weekly Features",
              "Priority Support",
              "Risk Management Guide"
            ]} 
          />
          <PricingCard 
            title="3 Months Access" 
            price="120" 
            period="3mo" 
            recommended={true}
            features={[
              "Everything in Monthly",
              "Save ~18% vs Monthly",
            ]} 
          />
          <PricingCard 
            title="6 Months Access" 
            price="180" 
            period="6mo" 
            features={[
              "Everything in Monthly",
              "Save ~40% vs Monthly",
              "Advanced Strategy PDF"
            ]} 
          />
            <PricingCard 
            title="Yearly Pro" 
            price="300" 
            period="yr" 
            features={[
              "Everything in 6 Months",
              "Best Value (Save ~50%)"
            ]} 
          />
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">INTRADAY<span className="text-blue-600 dark:text-blue-500">PIPS</span></span>
            <p className="mt-4 text-slate-500 text-sm">
              Providing professional market analysis and educational resources for forex and commodities traders worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="https://t.me/IntradayPips" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">Telegram Channel</a></li>
              <li><a href="https://www.tradingview.com/u/IntradayPips/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">TradingView</a></li>
              <li><a href="https://www.instagram.com/intraday.pips/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">Instagram</a></li>
              <li><a href="https://x.com/Intraday_Pips" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">X (Twitter)</a></li>
              <li><a href="https://www.youtube.com/channel/UC0Y5fPjrcWYASYahFPog98Q" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">YouTube</a></li>
              <li><a href="https://discord.gg/6tXr7TPw" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">Discord</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a></li>
              <li><a href="mailto:hello@intradaypips.com" className="hover:text-blue-600 dark:hover:text-blue-400">hello@intradaypips.com</a></li>
              <li><a href="https://drive.google.com/file/d/1kF5oF4CXNUvumq8g9hpu8X8Vbb2iJ1la/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-4">Community</h4>
            <a href="https://t.me/IntradayPips" target="_blank" rel="noopener noreferrer" className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-full font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-center block">
                Join Free Channel
            </a>
            <div className="flex space-x-4 mt-6 justify-start md:justify-start"> 
               <a href="https://www.instagram.com/intraday.pips/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors"><Instagram size={20} /></a>
               
               {/* TikTok Icon */}
               <a href="https://www.tiktok.com/@intraday.pips" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors">
                 <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
               </a>

               <a href="https://discord.gg/6tXr7TPw" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors"><MessageCircle size={20} /></a>
               <a href="https://t.me/IntradayPips" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors"><Send size={20} /></a>
               <a href="https://x.com/Intraday_Pips" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors">
                  {/* X Icon SVG */}
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
               </a>
               <a href="https://www.youtube.com/channel/UC0Y5fPjrcWYASYahFPog98Q" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-900 pt-8">
          <p className="text-xs text-slate-500 text-justify leading-relaxed">
            <strong className="text-slate-700 dark:text-slate-400">Risk Warning:</strong> Trading Foreign Exchange (Forex) and Contracts for Differences (CFDs) on margin carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade Forex or CFDs, you should carefully consider your trading objectives, level of experience, and risk appetite. The possibility exists that you could sustain a loss of some or all of your initial investment and therefore you should not invest money that you cannot afford to lose. IntradayPips is an educational platform and does not provide financial advice.
          </p>
          <div className="mt-8 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} IntradayPips. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Toggle theme handler
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-300 selection:bg-blue-500 selection:text-white transition-colors duration-300">
        <style dangerouslySetInnerHTML={{__html: `html { scroll-behavior: smooth; }`}} />
        <MarketTicker />
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <Hero />
        <Features />
        <Results />
        <Pricing />
        <Footer />
      </div>
    </div>
  );
};

export default App;
