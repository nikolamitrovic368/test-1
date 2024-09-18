import { create } from 'zustand'

type State = {
  verifyIdentityIsOpen: boolean
  integratedWalletIsOpen: boolean
  useIntegratedWallet: boolean
  selectedWalletType: 'wallet' | 'integratedWallet' | ''
  walletSignature: string
}

type QualificationState = State & {
  setVerifyIdentityIsOpen: (v: boolean) => void
  setintegratedWalletIsOpen: (v: boolean) => void
  setUseIntegratedWallet: (v: boolean) => void
  setSelectedWalletType: (v: 'wallet' | 'integratedWallet' | '') => void
  setWalletSignature: (v: string) => void
}

// Initialize a default state
const INITIAL_STATE: State = {
  verifyIdentityIsOpen: false,
  integratedWalletIsOpen: false,
  useIntegratedWallet: false,
  selectedWalletType: '',
  walletSignature: '',
}

const useQualificationStore = create<QualificationState>()(set => ({
  ...INITIAL_STATE,
  setVerifyIdentityIsOpen: verifyIdentityIsOpen =>
    set({ verifyIdentityIsOpen }),
  setintegratedWalletIsOpen: integratedWalletIsOpen =>
    set({ integratedWalletIsOpen }),
  setUseIntegratedWallet: useIntegratedWallet => set({ useIntegratedWallet }),
  setSelectedWalletType: selectedWalletType => set({ selectedWalletType }),
  setWalletSignature: walletSignature => set({ walletSignature }),
}))

export default useQualificationStore
