import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface AppStatePayload {
  handbookDrawer: boolean
  mobileNavigation: boolean
  navigationDrawer: boolean
  isNavigationCollapsed: boolean
}

const initialAppState: AppStatePayload = {
  handbookDrawer: false,
  mobileNavigation: false,
  navigationDrawer: false,
  isNavigationCollapsed: false
}

export const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    setOpenHandbookDrawer: (state) => {
      state.handbookDrawer = true
    },
    setCloseHandbookDrawer: (state) => {
      state.handbookDrawer = false
    },
    setOpenMobileNavigation: (state) => {
      state.mobileNavigation = true
    },
    setCloseMobileNavigation: (state) => {
      state.mobileNavigation = false
    },
    setOpenNavigationDrawer: (state) => {
      state.navigationDrawer = true
    },
    setCloseNavigationDrawer: (state) => {
      state.navigationDrawer = false
    },
    setIsNavigationCollapsed: (state, payload) => {
      state.isNavigationCollapsed = !payload
    }
  }
})

export const appReducer = appSlice.reducer as Reducer<AppStatePayload>

export const {
  setOpenHandbookDrawer,
  setCloseHandbookDrawer,
  setOpenMobileNavigation,
  setCloseMobileNavigation,
  setOpenNavigationDrawer,
  setCloseNavigationDrawer,
  setIsNavigationCollapsed
} = appSlice.actions
