import { Currency, OrderStatus, OrderType } from '../../types/common'

export type OrderItemType = {
  id: string
  subscriptionId: string
  tokenId: string
  subscriptionIntervalId: string
  holderIdentityId: string
  holderId: string
  holderName: string
  holderEmail: string
  tokenPrice: number
  tokenPriceAt: string
  baseCurrency: Currency
  investmentCurrency: Currency
  status: OrderStatus
  feeAtCreation: number
  feeAtPayment: null
  docuSignEnvelop: null
  investmentAmountAtCreation: string
  tokensAtCreation: number
  exchangeRateAtCreation: string
  exchangeRateDateAtCreation: string
  distributorId: null
  paymentReference: string
  investmentAmountAtPayment: number
  investmentAmountAtPaymentInBaseCurrency: null
  tokensAtPayment: string
  exchangeRateAtPayment: null
  exchangeRateType: null
  exchangeRateDateAtPayment: null
  confirmedAt: null
  txHash: null
  pendingTransactionHash: null
  createdAt: string
  updatedAt: string
  paymentNetwork: null
  paymentAddress: null
  cutOff: null
  tradeDate: null
  orderType?: OrderType
  installmentOrder?: number
  orderId?: number
}

export type OrderItemsType = OrderItemType[]

export type OrdersType = {
  items: OrderItemsType
  totalItemsFound: number
}

export type ConfirmOrderType = {
  ShoppingCartID: string
  Success: string
  ApprovalCode: string
  Signature: string
  Amount: string
}
