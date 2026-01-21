import { api } from './api'

const BASE_URL = '/anchor'

export const anchorApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getAnchors: build.query({
      query: ({ chapterId }) => `${BASE_URL}/${chapterId}/get-anchors-list`,
      providesTags: ['Anchor']
    }),
    getMyAnchors: build.query({
      query: ({ chapterId, userId }) => `${BASE_URL}/${chapterId}/${userId}/get-my-anchors`,
      providesTags: ['Anchor']
    }),
    createAnchor: build.mutation({
      query: ({ chapterId, userId, ...anchor }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/create-anchor`,
        method: 'POST',
        body: anchor
      }),
      invalidatesTags: ['Anchor', 'Dashboard']
    }),
    updateAnchor: build.mutation({
      query: ({ chapterId, userId, anchorId, ...updateData }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/update-anchor`,
        method: 'PUT',
        body: { anchorId, ...updateData }
      }),
      invalidatesTags: ['Anchor', 'Dashboard']
    })
  })
})

export const { useGetAnchorsQuery, useGetMyAnchorsQuery, useCreateAnchorMutation, useUpdateAnchorMutation } = anchorApi
