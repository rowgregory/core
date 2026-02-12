import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface UserState {
  addUserDrawer: boolean
  swabbieDrawer: boolean
  stowawayDrawer: boolean
}

export const initialUserState: UserState = {
  addUserDrawer: false,
  swabbieDrawer: false,
  stowawayDrawer: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setOpenSwabbieDrawer: (state) => {
      state.swabbieDrawer = true
    },
    setCloseSwabbieDrawer: (state) => {
      state.swabbieDrawer = false
    },
    setOpenStowawayDrawer: (state) => {
      state.stowawayDrawer = true
    },
    setCloseStowawayDrawer: (state) => {
      state.stowawayDrawer = false
    },
    setOpenAddUserDrawer: (state) => {
      state.addUserDrawer = true
    },
    setCloseAddUserDrawer: (state) => {
      state.addUserDrawer = false
    }
  }
})

export const userReducer = userSlice.reducer as Reducer<UserState>

export const {
  setOpenSwabbieDrawer,
  setCloseSwabbieDrawer,
  setOpenAddUserDrawer,
  setCloseAddUserDrawer,
  setOpenStowawayDrawer,
  setCloseStowawayDrawer
} = userSlice.actions
