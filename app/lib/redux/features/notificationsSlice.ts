import { Reducer, createSlice } from '@reduxjs/toolkit'
import { notificationApi } from '../services/notificationApi'

export interface NotificationStatePayload {
  loading: boolean
  notifications: any[]
}

const initialNotificationState: NotificationStatePayload = {
  loading: false,
  notifications: []
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialNotificationState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(notificationApi.endpoints.getNotifications.matchFulfilled, (state) => {
        state.loading = false
      })
      .addMatcher(notificationApi.endpoints.markNotificationAsRead.matchFulfilled, (state) => {
        state.loading = false
      })
  }
})

export const notificationReducer = notificationSlice.reducer as Reducer<NotificationStatePayload>

export const {} = notificationSlice.actions
