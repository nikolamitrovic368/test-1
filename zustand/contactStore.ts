import { create } from 'zustand'

type State = {
  contact: any
}

type ContactState = State & {
  setContact: (v: any) => void
}

// Initialize a default state
const INITIAL_STATE: State = {
  contact: null,
}

const useContactStore = create<ContactState>()(set => ({
  ...INITIAL_STATE,
  setContact: contact => set({ contact }),
}))

export default useContactStore
