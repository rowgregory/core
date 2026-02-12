'use client'

import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { api } from './services/api'
import { formReducer } from './features/formSlice'
import { logReducer } from './features/logSlice'
import { adminReducer } from './features/adminSlice'
import { parleyReducer } from './features/parleySlice'
import { userReducer } from './features/userSlice'
import { toastReduer } from './features/toastSlice'
import { settingsReducer } from './features/settingsSlice'
import { appReducer } from './features/appSlice'
import { anchorReducer } from './features/anchorSlice'
import { treasureMapReducer } from './features/treasureMapSlice'
import { dashboardReducer } from './features/dashboardSlice'
import { grogReducer } from './features/grogSlice'
import { reportReducer } from './features/reportSlice'

const rootReducer = combineReducers({
  form: formReducer,
  user: userReducer,
  log: logReducer,
  admin: adminReducer,
  parley: parleyReducer,
  toast: toastReduer,
  settings: settingsReducer,
  app: appReducer,
  anchor: anchorReducer,
  treasureMap: treasureMapReducer,
  dashboard: dashboardReducer,
  grog: grogReducer,
  report: reportReducer,
  [api.reducerPath]: api.reducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false
    }).concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppSelector = typeof store.getState

export const useAppDispatch: () => AppDispatch = useDispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useUserSelector = () => useAppSelector((state) => state.user)
export const useAdminSelector = () => useAppSelector((state) => state.admin)
export const useToastSelector = () => useAppSelector((state) => state.toast)
export const useSettingsSelector = () => useAppSelector((state) => state.settings)
export const useParleySelector = () => useAppSelector((state) => state.parley)
export const useFormSelector = () => useAppSelector((state) => state.form)
export const useAnchorSelector = () => useAppSelector((state) => state.anchor)
export const useTreasureMapSelector = () => useAppSelector((state) => state.treasureMap)
export const useDashboardSelector = () => useAppSelector((state) => state.dashboard)
export const useGrogSelector = () => useAppSelector((state) => state.grog)
export const useApplicationSelector = () => useAppSelector((state) => state.app)
export const useReportSlice = () => useAppSelector((state) => state.report)
