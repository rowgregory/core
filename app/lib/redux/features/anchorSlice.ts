import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IAnchor } from '@/types/anchor'

interface AnchorState {
  loading: boolean
  error: string | null
  anchors: IAnchor[]
  anchor: IAnchor | null
  anchorDrawer: boolean
}

const initialState: AnchorState = {
  loading: false,
  error: null,
  anchors: [],
  anchor: null,
  anchorDrawer: false
}
export const anchorSlice = createSlice({
  name: 'anchor',
  initialState,
  reducers: {
    setOpenAnchorDrawer: (state) => {
      state.anchorDrawer = true
    },
    setCloseAnchorDrawer: (state) => {
      state.anchorDrawer = false
    },
    setAnchors: (state, { payload }) => {
      state.anchors = payload
    },
    addAnchorToState: (state, action) => {
      state.anchors.push(action.payload)
    },
    updateAnchorInState: (state, action: PayloadAction<{ id: string; data: any }>) => {
      const index = state.anchors.findIndex((t) => t.id === action.payload.id)
      if (index !== -1) {
        state.anchors[index] = { ...state.anchors[index], ...action.payload.data }
      }
    }
  }
})

export const { setOpenAnchorDrawer, setCloseAnchorDrawer, setAnchors, addAnchorToState, updateAnchorInState } =
  anchorSlice.actions
export const anchorReducer = anchorSlice.reducer
