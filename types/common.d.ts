export type Currency = 'EUR' | 'USD' | 'RSD'
export type OrderStatus =
  | 'CANCELED_BY_INVESTOR'
  | 'PENDING_PAYMENT'
  | 'MINTED'
  | 'MINT_IN_PROGRESS'
export type OrderType = 'regular' | 'installments' | 'gift'
