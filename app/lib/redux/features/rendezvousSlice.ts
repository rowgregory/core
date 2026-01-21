import { RendezvousEvent } from '@/types/rendezvous'
import { createSlice } from '@reduxjs/toolkit'
import { rendezvousApi } from '../services/rendezvousApi'

interface RendezvousState {
  loading: boolean
  error: string | null
  rendezvous: RendezvousEvent[]
}

const initialState: RendezvousState = {
  loading: false,
  error: null,
  rendezvous: []
}
export const rendezvousSlice = createSlice({
  name: 'rendezvous',
  initialState,
  reducers: {
    resetRendezvousError: (state) => {
      state.error = null
    },
    setRendezvous: (state, { payload }) => {
      state.rendezvous = payload
    },
    setUpdateRendezvous: (state, { payload }) => {
      const index = state.rendezvous.findIndex((r) => r.id === payload.id)
      if (index !== -1) {
        state.rendezvous[index] = payload
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(rendezvousApi.endpoints.fetchRendezvousList.matchFulfilled, (state, { payload }: any) => {
        state.rendezvous = payload.rendezvous
        state.loading = false
      })
      .addMatcher(rendezvousApi.endpoints.createRendezvous.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(rendezvousApi.endpoints.updateRendezvous.matchFulfilled, (state) => {
        state.loading = false
      })

      .addMatcher(
        (action) => action.type.endsWith('rejected') && action.payload?.data?.sliceName === 'rendezvousApi',
        (state, { payload }: any) => {
          state.loading = false
          state.error = payload?.data?.message
        }
      )
  }
})

export const { resetRendezvousError, setRendezvous, setUpdateRendezvous } = rendezvousSlice.actions
export const rendezvousReducer = rendezvousSlice.reducer
