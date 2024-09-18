import { Currency } from '../../../types/common'
import { currencyFormat } from '../../../utils/utils'
import { type ExchangeRate } from '../../rates/rates.services'

export function intlPrice(
  eurPrice: number,
  currency: Currency,
  rates: ExchangeRate,
) {
  if (currency === 'USD') return (rates.EUR * eurPrice) / rates.USD
  if (currency === 'EUR') return eurPrice
  if (currency === 'RSD') return rates.EUR * eurPrice
  return eurPrice
}

export function formatedIntlPrice(
  eurPrice: number,
  currency: Currency,
  rates: ExchangeRate,
) {
  return currencyFormat(intlPrice(eurPrice, currency, rates), currency)
}
