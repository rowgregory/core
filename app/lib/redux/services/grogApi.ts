import { api } from './api'

const BASE_URL = '/grog'

export const grogApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getGrogs: build.query({
      query: ({ chapterId }) => `${BASE_URL}/${chapterId}/get-grogs-list`,
      providesTags: ['Grog']
    }),
    createGrog: build.mutation({
      query: ({ chapterId, userId, ...grog }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/create-grog`,
        method: 'POST',
        body: grog
      }),
      invalidatesTags: ['Grog']
    }),
    updateGrog: build.mutation({
      query: ({ chapterId, userId, grogId, ...updateData }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/update-grog`,
        method: 'PUT',
        body: { grogId, ...updateData }
      }),
      invalidatesTags: ['Grog']
    }),
    updateGrogStatus: build.mutation({
      query: ({ chapterId, userId, grogId, ...updateData }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/update-grog-status`,
        method: 'PATCH',
        body: { grogId, ...updateData }
      }),
      invalidatesTags: ['Grog']
    })
  })
})

export const { useGetGrogsQuery, useCreateGrogMutation, useUpdateGrogMutation, useUpdateGrogStatusMutation } = grogApi
