import { initialParleyFormState } from '@/app/lib/constants/entities/initialParleyFormState'
import { createInitialUserWithMeta } from '@/app/lib/constants/user/initialUserFormState'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Inputs = {
  [key: string]: string | number | boolean | undefined | unknown
}

export type Errors = {
  [key: string]: string
}

interface SetInputProps {
  formName: string
  data: any
}
interface SetErrorsProps {
  formName: string
  errors: Errors
}
interface SetSubmitttedProps {
  formName: string
  submitted: boolean
}
interface HandleInputProps {
  formName: string
  name: string
  value: any
}

const joinedAt = new Date()
const expiresAt = new Date()
expiresAt.setFullYear(joinedAt.getFullYear() + 1)

export const navigatorInputs = {
  name: '',
  email: '',
  phone: '',
  company: '',
  industry: '',
  chapterId: '',
  joinedAt: joinedAt.toISOString().split('T')[0],
  expiresAt: expiresAt.toISOString().split('T')[0],
  membershipStatus: 'PENDING',
  isAdmin: false
}

const formInitialState = {
  isCreating: false,
  isEditing: false,
  navigatorForm: {
    inputs: navigatorInputs,
    errors: {}
  },
  settingsForm: {
    inputs: { name: '', location: '', meetingDay: '', meetingTime: '', meetingFrequency: '' },
    errors: {}
  },
  beaconForm: {
    inputs: createInitialUserWithMeta(),
    errors: {}
  },
  swabbieForm: {
    inputs: {
      name: '',
      email: '',
      location: '',
      phone: '',
      company: '',
      industry: '',
      membershipStatus: 'PENDING',
      role: 'SKIPPER'
    },
    errors: {}
  },
  parleyForm: {
    inputs: initialParleyFormState,
    errors: {}
  },
  anchorForm: { inputs: { status: 'VERIFIED' }, errors: {} },
  treasureMapForm: { inputs: {}, errors: {} },
  grogForm: { inputs: {}, errors: {} },
  rendezvousForm: { inputs: {}, errors: {} },
  stowawayForm: { inputs: {}, errors: {} }
} as any

const formSlice = createSlice({
  name: 'form',
  initialState: formInitialState,
  reducers: {
    setIsCreating: (state) => {
      state.isCreating = true
    },
    setIsEditing: (state) => {
      state.isEditing = true
    },
    setIsNotEditing: (state) => {
      state.isEditing = false
    },
    setIsNotCreating: (state) => {
      state.isCreating = false
    },
    resetForm: (state, { payload }) => {
      if (state[payload] && state[payload].inputs !== undefined) {
        state[payload].inputs = null
        state[payload].errors = null
      }
    },
    setInputs: (state, { payload }: PayloadAction<SetInputProps>) => {
      const { formName, data } = payload
      if (!state[formName]) state[formName] = { inputs: {}, errors: {}, submitted: false }
      state[formName].inputs = { ...state[formName].inputs, ...data }
    },
    clearInputs: (state, { payload }: PayloadAction<{ formName: string }>) => {
      const { formName } = payload
      state[formName].inputs = {}
    },
    clearErrors: (state, { payload }: PayloadAction<{ formName: string }>) => {
      const { formName } = payload
      state[formName].errors = {}
    },
    setErrors: (state, { payload }: PayloadAction<SetErrorsProps>) => {
      const { formName, errors } = payload
      if (!state[formName]) {
        return
      }

      state[formName].errors = errors
    },

    setSubmitted: (state, { payload }: PayloadAction<SetSubmitttedProps>) => {
      const { formName, submitted } = payload
      if (!state[formName]) return
      state[formName].submitted = submitted
    },
    handleInput: (state, action: PayloadAction<HandleInputProps>) => {
      const { formName, name, value } = action.payload

      const form = state[formName]

      state[formName] = {
        ...form,
        inputs: {
          ...form?.inputs,
          [name]: value
        },
        errors: {
          ...form?.errors
        }
      }
    },
    handleSelect: (state, { payload }: PayloadAction<{ formName: string; name: string; value: string }>) => {
      const { formName, name, value } = payload
      if (!state[formName]) return
      state[formName].inputs[name] = value
    },
    handleToggle: (state, { payload }: PayloadAction<{ formName: string; name: string; checked: boolean }>) => {
      const { formName, name, checked } = payload
      const form = state[formName]

      state[formName] = {
        ...form,
        inputs: {
          ...form?.inputs,
          [name]: checked
        },
        errors: {
          ...form?.errors
        }
      }
    },
    setUploadProgress: (state, { payload }: any) => {
      state.progress = payload
    }
  }
})

export const createFormActions = (formName: string, dispatch: any) => ({
  setInputs: (data: any) => dispatch(formSlice.actions.setInputs({ formName, data })),
  clearInputs: () => dispatch(formSlice.actions.clearInputs({ formName })),
  setErrors: (errors: Errors) => dispatch(formSlice.actions.setErrors({ formName, errors })),
  setSubmitted: (submitted: boolean) => dispatch(formSlice.actions.setSubmitted({ formName, submitted })),
  handleInput: (e: any) =>
    dispatch(formSlice.actions.handleInput({ formName, name: e.target.name, value: e.target.value })),
  handleSelect: (e: any) =>
    dispatch(formSlice.actions.handleSelect({ formName, name: e.target.name, value: e.target.value })),
  handleToggle: (e: any) =>
    dispatch(formSlice.actions.handleToggle({ formName, name: e.target.name, checked: e.target.checked })),
  handleUploadProgress: (progress: any) => dispatch(formSlice.actions.setUploadProgress(progress))
})

export const {
  resetForm,
  setIsCreating,
  setIsNotCreating,
  setInputs,
  clearInputs,
  clearErrors,
  setIsEditing,
  setIsNotEditing
} = formSlice.actions
export const formReducer = formSlice.reducer
