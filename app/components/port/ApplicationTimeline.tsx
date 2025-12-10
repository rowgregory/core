import { formatDate, formatDateRange } from '@/app/lib/utils/date/formatDate'
import { User } from '@/types/user'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, AlertTriangle, Eye, Shield, Gavel, FileText } from 'lucide-react'

const ApplicationTimeline = ({ user }: { user: User }) => {
  const applicationSteps = [
    {
      id: 'APPLICATION_SUBMITTED',
      title: 'Application Submitted',
      status: 'completed',
      estimatedDate: null, // No estimate needed for submitted
      completedDate: formatDate(user?.createdAt, { includeTime: true }),
      description: 'Your application has safely landed at port'
    },
    {
      id: 'INITIAL_REVIEW',
      title: 'Initial Review',
      status: user?.isInitialReviewCompleted ? 'completed' : 'pending',
      estimatedDate: formatDateRange(0, 1),
      completedDate:
        user?.isInitialReviewCompleted && user?.initialReviewCompletedAt
          ? formatDate(user.initialReviewCompletedAt, { includeTime: true })
          : null,
      description: 'Quartermaster is reviewing your submission'
    },
    {
      id: 'BACKGROUND_CHECK',
      title: 'Background Check',
      status: user?.isBackgroudCheckCompleted ? 'completed' : 'pending',
      estimatedDate: formatDateRange(1, 3),
      completedDate:
        user?.isBackgroudCheckCompleted && user?.backgroundCheckCompletedAt
          ? formatDate(user.backgroundCheckCompletedAt, { includeTime: true })
          : null,
      description: 'Standard verification process for all swabbies'
    },
    {
      id: 'FINAL_DECISION',
      title: 'Final Decision',
      status: user?.isFinalDecisionMade ? 'completed' : 'pending',
      estimatedDate: formatDateRange(3, 5),
      completedDate:
        user?.isFinalDecisionMade && user?.finalDecisionAt
          ? formatDate(user.finalDecisionAt, { includeTime: true })
          : null,
      description: 'Final review and acceptance notification'
    }
  ]

  const statusOrder = ['PENDING', 'INITIAL_REVIEW', 'BACKGROUND_CHECK', 'ACTIVE']

  // Enhanced status mapping with rejection and admin skip handling
  const getMappedSteps = () => {
    const currentStatusIndex = statusOrder.indexOf(user?.membershipStatus)
    const isRejected = user?.rejectedAt && user?.rejectedAt !== ''

    return applicationSteps.map((step, index) => {
      const stepStatusMap: Record<number, string> = {
        0: 'APPLICATION_SUBMITTED',
        1: 'INITIAL_REVIEW',
        2: 'BACKGROUND_CHECK',
        3: 'FINAL_DECISION'
      }

      const stepId = stepStatusMap[index]

      // Application submitted is always completed
      if (index === 0) {
        return { ...step, id: stepId, status: 'completed' }
      }

      // Get completion flags
      const completionFlags: Record<string, boolean> = {
        INITIAL_REVIEW: user?.isInitialReviewCompleted ?? false,
        BACKGROUND_CHECK: user?.isBackgroudCheckCompleted ?? false,
        FINAL_DECISION: user?.isFinalDecisionMade || user?.membershipStatus === 'ACTIVE'
      }

      const isStepCompleted = completionFlags[stepId]

      // Handle rejection cases
      if (isRejected) {
        const rejectedAtStep = user?.rejectedStep

        // If rejected at this step
        if (rejectedAtStep === stepId) {
          return { ...step, id: stepId, status: 'rejected' }
        }

        // If step was completed before rejection
        if (isStepCompleted) {
          return { ...step, id: stepId, status: 'completed' }
        }

        // Otherwise it was skipped due to rejection
        return { ...step, id: stepId, status: 'skipped' }
      }

      // Handle completed steps
      if (isStepCompleted) {
        return { ...step, id: stepId, status: 'completed' }
      }

      // Special logic for Initial Review - it becomes current as soon as app is submitted
      if (stepId === 'INITIAL_REVIEW' && user?.createdAt) {
        // If not completed but app exists, it's in progress
        return { ...step, id: stepId, status: 'current' }
      }

      // For other steps, check if previous step is completed to determine if this is current
      if (stepId === 'BACKGROUND_CHECK' && user?.isInitialReviewCompleted) {
        return { ...step, id: stepId, status: 'current' }
      }

      if (stepId === 'FINAL_DECISION' && user?.isBackgroudCheckCompleted) {
        return { ...step, id: stepId, status: 'current' }
      }

      // Check if this step was admin-skipped
      // (membership status is beyond this step but step wasn't completed)
      if (currentStatusIndex > index && !isStepCompleted) {
        return { ...step, id: stepId, status: 'admin_skipped' }
      }

      // Future step
      return { ...step, id: stepId, status: 'upcoming' }
    })
  }

  const mappedSteps = getMappedSteps()

  // Enhanced step icon component
  const StepIcon = ({ status, stepId }: { status: string; stepId: any }) => {
    const iconMap: Record<string, any> = {
      APPLICATION_SUBMITTED: FileText,
      INITIAL_REVIEW: Eye,
      BACKGROUND_CHECK: Shield,
      FINAL_DECISION: Gavel
    }

    const IconComponent = iconMap[stepId] || Clock

    if (status === 'completed') return <CheckCircle2 className="h-4 w-4 text-white" />
    if (status === 'rejected') return <XCircle className="h-4 w-4 text-white" />
    if (status === 'current') return <IconComponent className="h-4 w-4 text-white" />
    if (status === 'admin_skipped') return <AlertTriangle className="h-4 w-4 text-amber-400" />

    return <IconComponent className="h-3 w-3 text-slate-400" />
  }

  // Status styling
  const getStatusStyles = (status: any) => {
    const styles: any = {
      completed: {
        circle: 'bg-emerald-500 border-emerald-400',
        line: 'bg-emerald-400',
        badge: 'bg-emerald-500 text-white',
        text: 'text-white'
      },
      rejected: {
        circle: 'bg-red-500 border-red-400',
        line: 'bg-slate-600/30',
        badge: 'bg-red-500 text-white',
        text: 'text-red-200'
      },
      current: {
        circle: 'bg-blue-500 border-blue-400 ring-2 ring-blue-500/30',
        line: 'bg-slate-600/30',
        badge: 'bg-blue-500 text-white',
        text: 'text-white'
      },
      admin_skipped: {
        circle: 'bg-amber-600/70 border-amber-500/50',
        line: 'bg-slate-600/30',
        badge: 'bg-amber-600 text-white',
        text: 'text-amber-200'
      },
      upcoming: {
        circle: 'bg-slate-700 border-slate-600',
        line: 'bg-slate-700/30',
        badge: 'bg-slate-700 text-slate-400',
        text: 'text-slate-300'
      },
      skipped: {
        circle: 'bg-slate-700/50 border-slate-600/50',
        line: 'bg-slate-700/20',
        badge: 'bg-slate-700/50 text-slate-500',
        text: 'text-slate-400'
      }
    }

    return styles[status] || styles.upcoming
  }

  // Status labels
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: 'Complete',
      rejected: 'Rejected',
      current: 'Active',
      admin_skipped: 'Skipped',
      upcoming: 'Pending',
      skipped: 'Skipped'
    }
    return labels[status] || 'Pending'
  }

  return (
    <div className="rounded-lg border border-slate-700/50 p-4">
      {/* Header */}
      <div className="mb-6">
        {user?.rejectedAt && user?.rejectedAt !== '' && (
          <div className="mt-3 p-3 bg-red-900/20 border border-red-700/50 rounded-md">
            <div className="flex items-center space-x-2 mb-1">
              <XCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-300 font-medium text-sm">Application Rejected</span>
            </div>
            {user.rejectionReason && user.rejectionReason !== '' && (
              <p className="text-red-200 text-xs">{user.rejectionReason}</p>
            )}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-5">
        {mappedSteps.map((step, index) => {
          const styles = getStatusStyles(step.status)

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-2"
            >
              {/* Timeline indicator */}
              <div className="relative flex flex-col items-center shrink-0">
                <div
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${styles.circle}`}
                >
                  <StepIcon status={step.status} stepId={step.id} />
                </div>

                {index < mappedSteps.length - 1 && (
                  <div className={`w-0.5 h-4 mt-1 transition-colors duration-300 ${styles.line}`} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* Mobile: Stack vertically, Desktop: Horizontal with badge on right */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:mb-1">
                  <h4 className={`font-medium text-xs leading-tight mb-1 lg:mb-0 ${styles.text}`}>{step.title}</h4>

                  {/* Badge - right side on desktop */}
                  <div className="mb-1 lg:mb-0 lg:ml-4 lg:shrink-0">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${styles.badge}`}>
                      {getStatusLabel(step.status)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-1 leading-tight wrap-break-word overflow-wrap-anywhere">
                  {step.description}
                </p>

                {/* Date section - Mobile: stacked, Desktop: inline */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-3 space-y-1 lg:space-y-0">
                  {/* Estimated date (with strikethrough if completed) */}
                  {step.estimatedDate && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-2.5 w-2.5 text-slate-500 shrink-0" />
                      <span
                        className={`text-xs text-slate-500 truncate ${
                          step.completedDate ? 'line-through opacity-60' : ''
                        }`}
                      >
                        Est: {step.estimatedDate}
                      </span>
                    </div>
                  )}

                  {/* Actual completion date - inline on desktop */}
                  {step.completedDate && (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
                      <span className="text-xs text-green-400 truncate font-medium">{step.completedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default ApplicationTimeline
