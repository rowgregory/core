import { Reducer, createSlice } from '@reduxjs/toolkit'
import { User, UserStats } from '@/types/user'
import { initialUserFormState } from '@/app/lib/constants/user/initialUserFormState'

export interface UserState {
  // Core data
  users: User[]
  user: User | null
  success: boolean

  // UI state
  loading: boolean
  submitting: boolean
  addUserDrawer: boolean
  editUserDrawer: boolean
  viewUserDrawer: boolean
  noUsers: boolean
  swabbieDrawer: boolean

  searchQuery: string

  // Statistics
  stats: UserStats

  // Error handling
  error: string | null

  signals: any
  stowawayDrawer: boolean
}

export const initialUserState: UserState = {
  // Core data
  users: [],
  user: initialUserFormState,
  success: false,

  // UI state
  loading: false,
  submitting: false,
  addUserDrawer: false,
  editUserDrawer: false,
  viewUserDrawer: false,
  noUsers: false,
  swabbieDrawer: false,
  searchQuery: '',

  // Statistics
  stats: {
    total: 0,
    active: 0,
    pending: 0,
    expired: 0,
    inactive: 0,
    suspended: 0,
    newThisMonth: 0,
    expiringThisMonth: 0
  },

  // Error handling
  error: null,

  signals: [],
  stowawayDrawer: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setOpenSwabbieDrawer: (state) => {
      state.swabbieDrawer = true
    },
    setCloseSwabbieDrawer: (state) => {
      state.swabbieDrawer = false
    },
    setOpenStowawayDrawer: (state) => {
      state.stowawayDrawer = true
    },
    setCloseStowawayDrawer: (state) => {
      state.stowawayDrawer = false
    },
    setOpenAddUserDrawer: (state) => {
      state.addUserDrawer = true
    },
    setCloseAddUserDrawer: (state) => {
      state.addUserDrawer = false
    },
    resetUser: (state) => {
      state.error = null
      state.user = null
    },
    setUsers: (state, { payload }) => {
      state.users = payload
      state.stats.total = payload?.length
      state.noUsers = payload?.length === 0
    },
    setUser: (state, { payload }) => {
      state.user = payload
    },
    addUserToState: (state, { payload }) => {
      state.users.push(payload)
    },
    updateUserInState: (state, { payload }) => {
      const index = state.users.findIndex((p) => p.id === payload.id)

      if (index !== -1) {
        state.users[index] = payload
      }
    },
    removeUserFromState: (state, { payload }) => {
      state.users = state.users.filter((user: { id: string }) => user?.id !== payload)
    }
  }
})

export const userReducer = userSlice.reducer as Reducer<UserState>

export const {
  setOpenSwabbieDrawer,
  setCloseSwabbieDrawer,
  setOpenAddUserDrawer,
  setCloseAddUserDrawer,
  resetUser,
  setUsers,
  setUser,
  addUserToState,
  updateUserInState,
  removeUserFromState,
  setOpenStowawayDrawer,
  setCloseStowawayDrawer
} = userSlice.actions
