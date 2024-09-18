import { create } from 'zustand'

import { Currency } from '../types/common'

type ExchangeRate = {
  EUR: number
  USD: number
}

type State = {
  rate: number
  tokens: number
  tokenPrice: number
  co2PerToken: number
  currency: Currency
  exchangeRate: ExchangeRate
  dirty: boolean
}

type CalculatorState = State & {
  setTokens: (val: State['tokens']) => void
  setDirty: (val: State['dirty']) => void
  setTokenPrice: (val: number) => void
  setCurrency: (val: Currency) => void
  setExchangeRate: (val: ExchangeRate) => void
  totalInvestmentEUR: () => number
  totalInvestment: () => number
  bonusTokens: () => number
  totalTokens: () => number
  bonusAmount: () => number
  discountedTokenPrice: () => number
  yieldAveragePerYear40Years: () => string
  bonus: () => number
  paybackYears: () => number
  reachAmount: () => number
  totalInvestorsReturn40: () => number
  totalReturn40: () => number
  totalCo240YearsMt: () => string
  totalCo2AveragePerYearMt: () => string
}

const INITIAL_STATE: State = {
  rate: 0.925,
  tokens: 1,
  tokenPrice: 102,
  co2PerToken: 6342,
  currency: 'EUR',
  exchangeRate: {
    EUR: 1,
    USD: 1,
  },
  dirty: false,
}

const useCalculatorStore = create<CalculatorState>()((set, get) => ({
  ...INITIAL_STATE,
  totalInvestmentEUR: () => get().tokens * get().tokenPrice,
  totalInvestorsReturn40: () => get().rate * 640.62,
  totalReturn40: () => {
    const currency = get().currency
    const eurValue = get().totalInvestorsReturn40() * get().totalTokens()
    const rates = get().exchangeRate

    if (currency === 'USD') return (eurValue * rates.EUR) / rates.USD
    if (currency === 'RSD') return eurValue * rates.EUR
    return eurValue
  },
  yieldAveragePerYear40Years: () =>
    (
      (((get().totalInvestorsReturn40() * get().totalTokens()) /
        get().totalInvestmentEUR() -
        1) /
        40) *
      100
    ).toFixed(2),
  bonus: () => {
    const tokens = get().tokens
    if (tokens < 10) return 0
    if (tokens < 100) return 0.1
    if (tokens < 1000) return 0.12
    if (tokens < 5000) return 0.15
    return 0.2
  },
  totalInvestment: () => {
    const currency = get().currency
    const rates = get().exchangeRate
    const totalInvestmentEUR = get().totalInvestmentEUR()
    if (currency === 'USD') return (rates.EUR * totalInvestmentEUR) / rates.USD
    if (currency === 'EUR') return totalInvestmentEUR
    if (currency === 'RSD') return rates.EUR * totalInvestmentEUR
    return totalInvestmentEUR
  },
  bonusTokens: () => Math.trunc(get().tokens * get().bonus()),
  bonusAmount: () => Math.trunc(get().totalInvestment() * get().bonus()),
  totalTokens: () => get().tokens + get().bonusTokens(),
  discountedTokenPrice: () =>
    Number(
      (get().totalInvestment() / (get().tokens + get().bonusTokens())).toFixed(
        2,
      ),
    ),
  paybackYears: () => {
    const tokens = get().tokens
    if (tokens < 10) return 10.32
    if (tokens < 100) return 9.84
    if (tokens < 1000) return 9.78
    if (tokens < 5000) return 9.69
    return 9.55
  },
  reachAmount: () => {
    const tokens = get().tokens
    if (tokens > 7 && tokens < 10) return 10 - tokens
    if (tokens > 90 && tokens < 100) return 100 - tokens
    if (tokens > 900 && tokens < 1000) return 1000 - tokens
    if (tokens > 4500 && tokens < 5000) return 5000 - tokens
    return 0
  },
  totalCo240YearsMt: () =>
    ((get().totalTokens() * get().co2PerToken) / 1000).toFixed(2),
  totalCo2AveragePerYearMt: () =>
    ((get().totalTokens() * get().co2PerToken) / 40 / 1000).toFixed(2),
  setTokens: tokens => set({ tokens }),
  setTokenPrice: tokenPrice => set({ tokenPrice }),
  setCurrency: currency => set({ currency }),
  setExchangeRate: exchangeRate => set({ exchangeRate }),
  setDirty: dirty => set({ dirty }),
}))

export default useCalculatorStore
