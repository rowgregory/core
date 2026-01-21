import { api } from './api'

const BASE_URL = '/treasure-map'

export const treasureMapApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getTreasureMaps: build.query({
      query: ({ chapterId }) => `${BASE_URL}/${chapterId}/get-treasure-maps-list`,
      providesTags: ['Treasure-Map']
    }),

    getMyTreasureMaps: build.query({
      query: ({ chapterId, userId }) => `${BASE_URL}/${chapterId}/${userId}/get-my-treasure-maps`,
      providesTags: ['Treasure-Map']
    }),

    createTreasureMap: build.mutation({
      query: ({ chapterId, userId, ...treasureMap }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/create-treasure-map`,
        method: 'POST',
        body: treasureMap
      }),
      invalidatesTags: ['Treasure-Map', 'Dashboard']
    }),

    updateTreasureMap: build.mutation({
      query: ({ chapterId, userId, ...updateData }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/update-treasure-map`,
        method: 'PUT',
        body: updateData
      }),
      invalidatesTags: ['Treasure-Map', 'Dashboard']
    }),

    updateTreasureMapStatus: build.mutation({
      query: ({ chapterId, userId, treasureMapId, status }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/update-treasure-map-status`,
        method: 'PATCH',
        body: { treasureMapId, status }
      }),
      invalidatesTags: ['Treasure-Map', 'Dashboard']
    }),
    deleteTreasureMap: build.mutation({
      query: ({ chapterId, userId, treasureMapId }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/${treasureMapId}/delete-treasure-map`,
        method: 'DELETE'
      })
    })
  })
})

export const {
  useGetTreasureMapsQuery,
  useGetMyTreasureMapsQuery,
  useCreateTreasureMapMutation,
  useUpdateTreasureMapMutation,
  useUpdateTreasureMapStatusMutation,
  useDeleteTreasureMapMutation
} = treasureMapApi
