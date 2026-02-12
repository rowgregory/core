'use client'

import { useAppDispatch, useFormSelector } from '@/app/lib/redux/store'
import BeaconHeader from '@/app/components/beacon/BeaconHeader'
import BeaconForm from '@/app/components/forms/BeaconForm'
import { createFormActions } from '@/app/lib/redux/features/formSlice'
import useBeaconForm from '@/hooks/useBeaconForm'

const BeaconClient = ({ data }) => {
  const dispatch = useAppDispatch()
  const { beaconForm, isEditing } = useFormSelector()
  const { handleInput, handleToggle } = createFormActions('beaconForm', dispatch)
  const inputs = beaconForm?.inputs
  const errors = beaconForm?.errors

  useBeaconForm(data)

  return (
    <div className="bg-gray-900 min-h-[calc(100vh-68px)]">
      <div className="flex-1 px-3 py-6 sm:p-6 overflow-y-auto max-w-7xl">
        <div className="sm:px-8 py-6 border-b border-gray-700/50">
          <BeaconHeader inputs={inputs} isEditing={isEditing} />
        </div>
        <BeaconForm
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
          isEditing={isEditing}
          handleToggle={handleToggle}
        />
      </div>
    </div>
  )
}

export default BeaconClient
