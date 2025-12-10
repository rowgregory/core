'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShipWheel } from 'lucide-react'
import { createFormActions } from '../redux/features/formSlice'
import { RootState, useAppDispatch, useAppSelector } from '../redux/store'
import { useRouter } from 'next/navigation'
import { useCreateUserMutation } from '../redux/services/userApi'
import { chapterId } from '../lib/constants/api/chapterId'
import { showToast } from '../redux/features/toastSlice'
import validateSwabbieForm from '../components/forms/validations/validateSwabbieForm'
import StormEffects from '../components/common/StormEffects'
import SwabbieApplicationForm from '../components/forms/SwabbieApplicationForm'

const Swabbie = () => {
  const dispatch = useAppDispatch()
  const { handleInput, handleToggle, setErrors } = createFormActions('swabbieForm', dispatch)
  const { swabbieForm } = useAppSelector((state: RootState) => state.form)
  const { push } = useRouter()
  const [createSwabbie, { isLoading }] = useCreateUserMutation() as any
  const inputs = swabbieForm?.inputs
  const errors = swabbieForm?.errors

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!validateSwabbieForm(swabbieForm.inputs, setErrors)) return

    try {
      const result = await createSwabbie({ chapterId, hasCompletedApplication: true, ...swabbieForm.inputs }).unwrap()

      push(`/swabbie/port?swabbieId=${result.user.id}`)
      dispatch(
        showToast({
          type: 'success',
          message: 'Application submitted successfully!',
          description: `Thank you for your interest, ${swabbieForm.inputs.firstName}!`
        })
      )
    } catch (error: any) {
      dispatch(
        showToast({
          type: 'error',
          message: 'Submission failed',
          description: error?.data?.message || 'Something went wrong. Please try again.'
        })
      )
    }
  }

  return (
    <div className="min-h-screen py-12 relative overflow-hidden bg-gray-900">
      <StormEffects />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="md:flex h-12 w-12 bg-linear-to-r from-teal-500 via-cyan-600 to-blue-700 rounded-xl hidden items-center justify-center shadow-lg shadow-cyan-900/50">
              <ShipWheel className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Coastal Referral Exchange</h1>
          </div>
          <p className="text-cyan-200">Join Storm Harbor&apos;s Elite Business Network</p>
        </motion.div>

        {/* Form Container */}
        <SwabbieApplicationForm
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
          handleSubmit={handleSubmit}
          handleToggle={handleToggle}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default Swabbie
