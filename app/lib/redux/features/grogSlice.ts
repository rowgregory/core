import { createSlice } from '@reduxjs/toolkit'
import { GrogFormStateTyped } from '@/types/grog'

interface GrogState {
  loading: boolean
  error: string | null
  grogs: GrogFormStateTyped[]
  grog: GrogFormStateTyped | null
  grogDrawer: boolean
}

const initialState: GrogState = {
  loading: false,
  error: null,
  grogs: [],
  grog: null,
  grogDrawer: false
}
export const grogSlice = createSlice({
  name: 'grog',
  initialState,
  reducers: {
    resetGrogError: (state) => {
      state.error = null
    },
    setOpenGrogDrawer: (state) => {
      state.grogDrawer = true
    },
    setCloseGrogDrawer: (state) => {
      state.grogDrawer = false
    }
  }
})

export const { resetGrogError, setOpenGrogDrawer, setCloseGrogDrawer } = grogSlice.actions
export const grogReducer = grogSlice.reducer
