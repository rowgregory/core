import { DeleteUserResponse, UserFilters, UserFormData, UpdateUserResponse } from '@/types/user'
import { api } from './api'

const BASE_URL = '/user'

export const userApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getUsers: build.query({
      query: (filters: UserFilters) => ({
        url: `${BASE_URL}/${filters.chapterId}/get-users-list`,
        params: { ...filters }
      }),
      providesTags: ['User']
    }),
    getMyProfile: build.query({
      query: ({ chapterId, userId }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/me/get-my-profile`
      }),
      providesTags: ['User']
    }),
    getUserById: build.query({
      query: ({ chapterId, userId }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/get-user-by-id`
      }),
      providesTags: ['User']
    }),
    updateMyProfile: build.mutation({
      query: ({ chapterId, userId, ...profileData }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/me/update-my-profile`,
        method: 'PUT',
        body: profileData
      }),
      invalidatesTags: ['User']
    }),
    createUser: build.mutation({
      query: (userData) => ({
        url: `${BASE_URL}/${userData.chapterId}/create-user`,
        method: 'POST',
        body: userData
      }),
      invalidatesTags: ['User']
    }),
    updateUser: build.mutation<UpdateUserResponse, { chapterId: string; userId: string; data: Partial<UserFormData> }>({
      query: ({ chapterId, userId, ...data }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/update-user`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['User']
    }),
    updateUserStatus: build.mutation({
      query: ({ chapterId, userId, ...data }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/update-user-status`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['User']
    }),
    deleteUser: build.mutation<DeleteUserResponse, { chapterId: string; userId: string }>({
      query: ({ chapterId, userId }) => ({
        url: `${BASE_URL}/${chapterId}/${userId}/delete`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    }),
    generateMemberMetrics: build.query({
      query: ({ chapterId, filterType }) =>
        `${BASE_URL}/${chapterId}/reports/generate-member-metrics?filterType=${filterType}`,
      providesTags: ['User']
    }),
    signalQuartermaster: build.mutation({
      query: ({ chapterId, ...data }) => ({
        url: `${BASE_URL}/${chapterId}/swabbie/signal-quartermaster`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['User']
    }),
    updatePapers: build.mutation({
      query: ({ chapterId, ...data }) => ({
        url: `${BASE_URL}/${chapterId}/swabbie/update-papers`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags: ['User']
    }),
    updateStowaway: build.mutation({
      query: ({ chapterId, ...data }) => ({
        url: `${BASE_URL}/${chapterId}/stowaway/update`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['User']
    })
  })
})

export const {
  useGetUsersQuery,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useGenerateMemberMetricsQuery,
  useSignalQuartermasterMutation,
  useUpdatePapersMutation,
  useUpdateStowawayMutation
} = userApi
