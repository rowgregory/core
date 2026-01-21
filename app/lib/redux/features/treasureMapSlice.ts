import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialTreasureMapState } from '@/types/treasure-map'

export const treasureMapSlice = createSlice({
  name: 'treasureMap',
  initialState: initialTreasureMapState,
  reducers: {
    setOpenTreasureMapDrawer: (state) => {
      state.treasureMapDrawer = true
    },
    setCloseTreasureMapDrawer: (state) => {
      state.treasureMapDrawer = false
    },
    setTreasureMaps: (state, { payload }) => {
      state.treasureMaps = payload
    },
    addTreasureMapToState: (state, action) => {
      state.treasureMaps.push(action.payload)
    },
    updateTreasureMapInState: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const index = state.treasureMaps.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.treasureMaps[index] = { ...state.treasureMaps[index], ...action.payload.data }
      }
    },
    deleteTreasureMapFromState: (state, action: PayloadAction<string>) => {
      state.treasureMaps = state.treasureMaps.filter((t) => t.id !== action.payload)
    }
  }
})

export const {
  setOpenTreasureMapDrawer,
  setCloseTreasureMapDrawer,
  setTreasureMaps,
  addTreasureMapToState,
  deleteTreasureMapFromState,
  updateTreasureMapInState
} = treasureMapSlice.actions

export const treasureMapReducer = treasureMapSlice.reducer
