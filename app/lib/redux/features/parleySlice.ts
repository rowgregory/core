import { IParley } from '@/types/parley'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ParleyStatePayload {
  loading: boolean
  submitting: boolean
  error: string | null
  parleyDrawer: boolean
  parleys: IParley[]
}

const initialParleyState: ParleyStatePayload = {
  loading: false,
  submitting: false,
  parleyDrawer: false,
  error: null,
  parleys: []
}

export const parleySlice = createSlice({
  name: 'parley',
  initialState: initialParleyState,
  reducers: {
    setOpenParleyDrawer: (state) => {
      state.parleyDrawer = true
    },
    setCloseParleyDrawer: (state) => {
      state.parleyDrawer = false
    },
    setParleys: (state, { payload }) => {
      state.parleys = payload
    },
    addParleyToState: (state, action: PayloadAction<any>) => {
      state.parleys.push(action.payload)
    },
    updateParleyInState: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const index = state.parleys.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.parleys[index] = { ...state.parleys[index], ...action.payload.data }
      }
    },
    deleteParleyFromState: (state, action: PayloadAction<string>) => {
      state.parleys = state.parleys.filter((p) => p.id !== action.payload)
    }
  }
})

export const {
  setOpenParleyDrawer,
  setCloseParleyDrawer,
  setParleys,
  addParleyToState,
  updateParleyInState,
  deleteParleyFromState
} = parleySlice.actions

export const parleyReducer = parleySlice.reducer
