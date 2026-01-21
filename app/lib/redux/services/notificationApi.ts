import { api } from './api'
import { Notification } from '@/types/notification'

const BASE_URL = '/notification'

export const notificationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getNotifications: build.query<{ notification: Notification }, string>({
      query: (chapterId) => `${BASE_URL}/${chapterId}`,
      providesTags: (_, __, chapterId) => [{ type: 'Notification', id: chapterId }]
    }),
    markNotificationAsRead: build.mutation({
      query: ({ chapterId, ...rest }) => ({
        url: `${BASE_URL}/${chapterId}/mark-read`,
        method: 'POST',
        body: rest
      }),
      invalidatesTags: ['Notification']
    })
  })
})

export const { useGetNotificationsQuery, useMarkNotificationAsReadMutation } = notificationApi
