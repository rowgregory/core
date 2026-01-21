import { Chapter } from '@/types/user'
import { api } from './api'

const BASE_URL = '/settings'

export const settingsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    updateChapterSettings: build.mutation({
      query: ({ chapterId, settings }) => ({
        url: `${BASE_URL}/${chapterId}`,
        method: 'PUT',
        body: settings
      }),
      invalidatesTags: (_, __, { chapterId }) => [{ type: 'Chapter', id: chapterId }]
    }),
    getChapterSettings: build.query<{ settings: Chapter }, string>({
      query: (chapterId) => `${BASE_URL}/${chapterId}`,
      providesTags: (_, __, chapterId) => [{ type: 'Chapter', id: chapterId }]
    })
  })
})

export const { useUpdateChapterSettingsMutation, useGetChapterSettingsQuery } = settingsApi
