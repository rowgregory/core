import { createSlice } from '@reduxjs/toolkit'
import { GrogFormStateTyped } from '@/types/grog'
import { grogApi } from '../services/grogApi'

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
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(grogApi.endpoints.getGrogs.matchFulfilled, (state, { payload }: any) => {
        state.grogs = payload.grogs
        state.loading = false
      })
      .addMatcher(grogApi.endpoints.createGrog.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(grogApi.endpoints.updateGrog.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(grogApi.endpoints.updateGrogStatus.matchFulfilled, (state) => {
        state.loading = false
      })

      .addMatcher(
        (action) => action.type.endsWith('rejected') && action.payload?.data?.sliceName === 'grogApi',
        (state, { payload }: any) => {
          state.loading = false
          state.error = payload?.data?.message
        }
      )
  }
})

export const { resetGrogError, setOpenGrogDrawer, setCloseGrogDrawer } = grogSlice.actions
export const grogReducer = grogSlice.reducer
