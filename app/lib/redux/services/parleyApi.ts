import { api } from './api'

const BASE_URL = '/parley'

export const parleyApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getParleys: build.query({
      query: ({ chapterId }) => `${BASE_URL}/${chapterId}`,
      providesTags: ['Parley']
    }),

    getMyParleys: build.query({
      query: ({ chapterId, userId }) => `${BASE_URL}/${chapterId}/${userId}`,
      providesTags: ['Parley']
    }),

    createParley: build.mutation({
      query: ({ chapterId, ...parley }) => ({
        url: `${BASE_URL}/${chapterId}/create`,
        method: 'POST',
        body: parley
      }),
      invalidatesTags: ['Parley', 'Dashboard']
    }),

    updateParley: build.mutation({
      query: ({ chapterId, userId, parleyId, ...updateData }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/update`,
        method: 'PUT',
        body: { parleyId, ...updateData }
      }),
      invalidatesTags: ['Parley', 'Dashboard']
    }),

    updateParleyStatus: build.mutation({
      query: ({ chapterId, userId, parleyId, status }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/update-status`,
        method: 'PATCH',
        body: { parleyId, status }
      }),
      invalidatesTags: ['Parley', 'Dashboard']
    }),
    deleteParley: build.mutation({
      query: ({ chapterId, userId, parleyId }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/${parleyId}/delete-parley`,
        method: 'DELETE'
      })
    })
  })
})

export const {
  useGetParleysQuery,
  useGetMyParleysQuery,
  useCreateParleyMutation,
  useUpdateParleyMutation,
  useUpdateParleyStatusMutation,
  useDeleteParleyMutation
} = parleyApi
