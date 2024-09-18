import { create } from 'zustand'

import { OrderItemType } from '@/redux/services/order-types'

type PayType = 'bank' | 'paypal' | 'credit' | undefined

/**
 * Represents the state of the order.
 */
type State = {
  order?: OrderItemType
  page: number
  sendMailModalIsOpen: boolean
  redemptionLink: string
  paypalOrder: any
  payType: PayType
  firstInvestmentAmount: number
}

/**
 * Represents the order state with additional setter function.
 */
type OrderState = State & {
  /**
   * Sets the order value.
   * @param v - The new order value.
   */
  setOrder: (v: OrderItemType) => void
  setRedemptionLink: (v: string) => void
  setPage: (v: number) => void
  setFirstInvestmentAmount: (v: number) => void
  openSendMailModal: () => void
  closeSendMailModal: () => void
  setPaypalOrder: (paypalOrder: any) => void
  setPayType: (val: PayType) => void
}

// Initialize a default state
const INITIAL_STATE: State = {
  order: undefined,
  page: 0,
  sendMailModalIsOpen: false,
  redemptionLink: '',
  paypalOrder: undefined,
  payType: undefined,
  firstInvestmentAmount: 0,
}

/**
 * Custom hook for managing the order state.
 * @returns The order state and setter function.
 */
const useOrderStore = create<OrderState>()(set => ({
  ...INITIAL_STATE,
  setOrder: order => set({ order }),
  setPage: page => set({ page }),
  setPaypalOrder: paypalOrder => set({ paypalOrder }),
  setPayType: payType => set({ payType }),
  setRedemptionLink: redemptionLink => set({ redemptionLink }),
  setFirstInvestmentAmount: firstInvestmentAmount =>
    set({ firstInvestmentAmount }),
  openSendMailModal: () => set({ sendMailModalIsOpen: true }),
  closeSendMailModal: () => set({ sendMailModalIsOpen: false }),
}))

export default useOrderStore
