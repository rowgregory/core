import { api } from './api'

const BASE_URL = '/rendezvous'

export const rendezvousApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    fetchRendezvousList: build.query({
      query: ({ chapterId }) => `${BASE_URL}/${chapterId}/fetch-rendezvous-list`,
      providesTags: ['Rendezvous']
    }),
    createRendezvous: build.mutation({
      query: ({ chapterId, ...rendezvous }) => ({
        url: `${BASE_URL}/${chapterId}/create-rendezvous`,
        method: 'POST',
        body: rendezvous
      }),
      invalidatesTags: ['Rendezvous']
    }),
    updateRendezvous: build.mutation({
      query: ({ chapterId, ...updateData }) => ({
        url: `${BASE_URL}/${chapterId}/update-rendezvous`,
        method: 'PATCH',
        body: updateData
      }),
      invalidatesTags: ['Rendezvous']
    })
  })
})

export const { useFetchRendezvousListQuery, useCreateRendezvousMutation, useUpdateRendezvousMutation } = rendezvousApi
