import { type ClassValue, clsx } from 'clsx'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'

import { Currency } from '../types/common'

/**
 * Combines multiple class names into a single string using tailwind-merge and clsx.
 * @param inputs - The class names to be combined.
 * @returns The combined class names as a string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number by adding commas as thousand separators.
 * @param n - The number to be formatted.
 * @returns The formatted number as a string.
 */
export function formatNumber(n: number | string) {
  return String(n)
    .replace(/\D/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Formats a number or string to display as a formatted number.
 * @param inputVal - The number or string to be formatted.
 * @returns The formatted number as a string.
 */
export function formatDisplayNumber(inputVal: string | number) {
  if (typeof inputVal === 'number') inputVal = inputVal.toString()
  if (inputVal === '') return ''
  if (inputVal.indexOf('.') >= 0) {
    let decimal_pos = inputVal.indexOf('.')
    let left_side = inputVal.substring(0, decimal_pos)
    let right_side = inputVal.substring(decimal_pos)
    left_side = formatNumber(left_side)
    right_side = formatNumber(right_side)
    right_side = right_side.substring(0, 2)
    inputVal = left_side + '.' + right_side
  } else {
    inputVal = formatNumber(inputVal)
    inputVal = inputVal
  }
  return inputVal
}

/**
 * Formats a number as a currency string.
 * @param v - The number to be formatted.
 * @param currency - The currency code to be used for formatting.
 * @returns The formatted currency string.
 */
export const currencyFormat = (v: number = 0, currency: Currency = 'EUR') =>
  Intl.NumberFormat(currency === 'RSD' ? 'sr' : 'en-US', {
    style: 'currency',
    currency,
  }).format(v)

/**
 * Formats a number as a string with thousand separators.
 * @param v - The number to be formatted.
 * @returns The formatted number as a string.
 */
export const numberFormat = (v: number | string) =>
  v ? new Intl.NumberFormat('en-US').format(Number(v)) : ''

/**
 * Formats a date string using the specified format.
 * @param v - The date string to be formatted.
 * @returns The formatted date string.
 */
export const dateFormat = (v: string) =>
  v ? format(v, 'd LLL yyyy, HH:mm:ss') : ''

/**
 * Calculates the bonus based on the number of tokens.
 * @param tokens - The number of tokens.
 * @returns The bonus percentage.
 */
function bonus(tokens: number) {
  if (tokens < 10) return 0
  if (tokens < 100) return 0.1
  if (tokens < 1000) return 0.12
  if (tokens < 5000) return 0.15
  return 0.2
}

export function bonusToken(tokens: number) {
  return Math.floor(bonus(tokens) * tokens)
}

/**
 * Calculates the total tokens including the bonus.
 * @param tokens - The number of tokens.
 * @returns The total tokens including the bonus.
 */
export function calculatedTokens(tokens: number) {
  return tokens + bonusToken(tokens)
}
