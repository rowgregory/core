import { Calendar, DollarSign, Building, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { useAppDispatch, useUserSelector } from '@/app/lib/redux/store'
import { motion } from 'framer-motion'
import { formatDateForInput } from '@/app/lib/utils/date/formatDate'
import { useSession } from 'next-auth/react'
import { setInputs } from '@/app/lib/redux/features/formSlice'
import getAnchorStatusColor from '@/app/lib/utils/anchor/getAnchorStatusColor'

const formatCurrency = (value: string) => {
  if (!value) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(parseFloat(value))
}

const AnchorForm = ({ inputs, errors, handleInput, isLoading, handleSubmit, user, isUpdating, onClose }: any) => {
  const session = useSession()
  const { users } = useUserSelector()
  const dispatch = useAppDispatch()

  return (
    <>
      <form onSubmit={handleSubmit} id="anchorForm" className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Participants Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Role Switch Toggle */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">What is your role in this anchor?</label>

              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(
                      setInputs({
                        formName: 'anchorForm',
                        data: { isReceiving: false, giverId: user?.id, receiverId: '' }
                      })
                    )
                  }}
                  className={`py-4 px-4 rounded-xl border transition-all duration-200 ${
                    !inputs?.isReceiving
                      ? 'border-teal-400 bg-teal-400/10 text-teal-300 shadow-lg shadow-teal-400/20'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">I Referred This Business</div>
                    <div className="text-xs opacity-70 mt-1">I gave the referral that led to this sale</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    dispatch(
                      setInputs({
                        formName: 'anchorForm',
                        data: { isReceiving: true, receiverId: user?.id, giverId: '' }
                      })
                    )
                  }}
                  className={`py-4 px-4 rounded-xl border transition-all duration-200 ${
                    inputs?.isReceiving
                      ? 'border-purple-400 bg-purple-400/10 text-purple-300 shadow-lg shadow-purple-400/20'
                      : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">I Closed This Business</div>
                    <div className="text-xs opacity-70 mt-1">I received and closed this referral</div>
                  </div>
                </button>
              </div>
            </div>

            {!inputs?.isReceiving ? (
              <>
                {/* When user GAVE the referral - Current User (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    You gave the referral that led to this business
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user?.name
                          ?.split(' ')
                          .map((n: any[]) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user?.name}</p>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal-400/20 text-teal-300 border border-teal-400/30">
                          Referral Giver
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Who received and closed the referral */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Who received your referral and closed this business?
                  </label>
                  <select
                    name="receiverId"
                    value={inputs?.receiverId || ''}
                    onChange={(e) => handleInput({ target: { name: 'receiverId', value: e.target.value } })}
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all ${
                      errors?.receiverId ? 'border-red-500' : 'border-gray-600'
                    }`}
                  >
                    <option value="">Select who closed the business...</option>
                    <option value="external">Out of chaper member</option>
                    {users
                      ?.filter((navigator) => navigator.id !== user?.id && navigator?.membershipStatus === 'ACTIVE')
                      .map((navigator) => (
                        <option key={navigator.id} value={navigator.id || ''}>
                          {navigator.name} - {navigator.company}
                        </option>
                      ))}
                  </select>
                  {errors?.receiverId && (
                    <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors?.receiverId}</span>
                    </p>
                  )}
                </div>
                {inputs?.receiverId === 'external' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 mt-4 p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg"
                  >
                    <h4 className="text-sm font-medium text-gray-300 mb-3">External Referral Source Details</h4>

                    {/* External Giver Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="externalReceiverName"
                        value={inputs?.externalReceiverName || ''}
                        onChange={handleInput}
                        placeholder="Enter their full name"
                        className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all focus:outline-none ${
                          errors?.externalReceiverName ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors?.externalReceiverName && (
                        <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors?.externalReceiverName}</span>
                        </p>
                      )}
                    </div>

                    {/* External Giver Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="externalReceiverEmail"
                        value={inputs?.externalReceiverEmail || ''}
                        onChange={handleInput}
                        placeholder="their.email@company.com"
                        className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all focus:outline-none ${
                          errors?.externalReceiverEmail ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors?.externalReceiverEmail && (
                        <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors?.externalReceiverEmail}</span>
                        </p>
                      )}
                    </div>

                    {/* External Giver Company */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Company/Organization</label>
                      <input
                        type="text"
                        name="externalReceiverCompany"
                        value={inputs?.externalReceiverCompany || ''}
                        onChange={handleInput}
                        placeholder="Their company or organization name"
                        className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all focus:outline-none ${
                          errors?.externalReceiverCompany ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors?.externalReceiverCompany && (
                        <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors?.externalReceiverCompany}</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <>
                {/* When user RECEIVED the referral - Current User (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    You received a referral and closed this business
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-linear-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user?.name
                          ?.split(' ')
                          .map((n: any[]) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user?.name}</p>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-400/20 text-purple-300 border border-purple-400/30">
                          Business Closer
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Who gave the referral */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Who gave you the referral that led to this business?
                  </label>
                  <select
                    name="giverId"
                    value={inputs?.giverId || ''}
                    onChange={(e) => handleInput({ target: { name: 'giverId', value: e.target.value } })}
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:outline-none text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all ${
                      errors?.giverId ? 'border-red-500' : 'border-gray-600'
                    }`}
                  >
                    <option value="">Select who gave you the referral...</option>
                    <option value="external">Out of chaper member</option>
                    <option value="fleet-earnings">Fleet earnings</option>
                    {users
                      ?.filter((navigator) => navigator.id !== user?.id && navigator?.membershipStatus === 'ACTIVE')
                      .map((navigator) => (
                        <option key={navigator.id} value={navigator.id || ''}>
                          {navigator.name} - {navigator.company}
                        </option>
                      ))}
                  </select>
                  {errors?.giverId && (
                    <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors?.giverId}</span>
                    </p>
                  )}
                </div>
                {/* Conditional External Giver Inputs */}
                {inputs?.giverId === 'external' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 mt-4 p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg"
                  >
                    <h4 className="text-sm font-medium text-gray-300 mb-3">External Referral Source Details</h4>

                    {/* External Giver Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="externalGiverName"
                        value={inputs?.externalGiverName || ''}
                        onChange={handleInput}
                        placeholder="Enter their full name"
                        className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all focus:outline-none ${
                          errors?.externalGiverName ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors?.externalGiverName && (
                        <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors?.externalGiverName}</span>
                        </p>
                      )}
                    </div>

                    {/* External Giver Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="externalGiverEmail"
                        value={inputs?.externalGiverEmail || ''}
                        onChange={handleInput}
                        placeholder="their.email@company.com"
                        className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all focus:outline-none ${
                          errors?.externalGiverEmail ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors?.externalGiverEmail && (
                        <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors?.externalGiverEmail}</span>
                        </p>
                      )}
                    </div>

                    {/* External Giver Company */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Company/Organization</label>
                      <input
                        type="text"
                        name="externalGiverCompany"
                        value={inputs?.externalGiverCompany || ''}
                        onChange={handleInput}
                        placeholder="Their company or organization name"
                        className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all focus:outline-none ${
                          errors?.externalGiverCompany ? 'border-red-500' : 'border-gray-600'
                        }`}
                      />
                      {errors?.externalGiverCompany && (
                        <p className="text-red-400 text-sm mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors?.externalGiverCompany}</span>
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>

          {/* Business Value */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <DollarSign className="w-4 h-4 inline mr-2" />
              Business Value *
            </label>
            <div className="flex space-x-2">
              <div className="bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                USD
              </div>
              <input
                type="text"
                name="businessValue"
                value={inputs?.businessValue || ''}
                onChange={handleInput}
                placeholder="0.00"
                step="0.01"
                className={`flex-1 bg-gray-800/50 border rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none ${errors?.businessValue ? 'border-red-500' : 'border-gray-600'}`}
              />
            </div>
            {inputs?.businessValue && (
              <p className="mt-1 text-sm text-cyan-300">Display value: {formatCurrency(inputs?.businessValue)}</p>
            )}
            {errors?.businessValue && <p className="mt-1 text-sm text-red-400">{errors?.businessValue}</p>}
          </div>

          {/* Client Name */}
          {inputs?.giverId !== 'external' && inputs?.receiverId !== 'external' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Client Name (Optional)
              </label>
              <input
                type="text"
                name="clientName"
                value={inputs?.clientName || ''}
                onChange={handleInput}
                placeholder="Client or company name"
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none "
              />
            </div>
          )}

          {/* Closed Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              When’d ye drop anchor? *
            </label>
            <input
              type="date"
              name="closedDate"
              value={formatDateForInput(inputs?.closedDate) || ''}
              onChange={handleInput}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full bg-gray-800/50 border rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert ${errors?.closedDate ? 'border-red-500' : 'border-gray-600'}`}
            />
            {errors?.closedDate && <p className="mt-1 text-sm text-red-400">{errors?.closedDate}</p>}
          </div>

          {/* Business Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Business Description *
            </label>
            <textarea
              name="description"
              value={inputs?.description}
              onChange={handleInput}
              placeholder="Describe the business that was closed (services provided, project details, etc.)"
              rows={4}
              className={`w-full bg-gray-800/50 border rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none focus:outline-none  ${errors?.description ? 'border-red-500' : 'border-gray-600'}`}
            />
            {errors?.description && <p className="mt-1 text-sm text-red-400">{errors?.description}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <AlertCircle className="w-4 h-4 inline mr-2" />
              Status
            </label>
            <div className="w-full bg-linear-to-r from-gray-800/50 to-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getAnchorStatusColor(inputs?.status)}`}></div>
                  <span className="text-white font-medium">{inputs?.status || 'No status set'}</span>
                </div>
                <div className="text-xs text-gray-400 bg-gray-600/30 px-2 py-1 rounded">Read Only</div>
              </div>
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full animate-pulse"></div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Additional Notes</label>
            <textarea
              name="notes"
              value={inputs?.notes || ''}
              onChange={handleInput}
              placeholder="Any additional details about this closed business..."
              rows={3}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none focus:outline-none "
            />
          </div>
        </div>
      </form>
      {/* Footer */}
      <motion.div
        className="p-6 border-t border-gray-700/50 bg-gray-900/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:gap-x-3 gap-y-3">
          <motion.button
            onClick={onClose}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="order-2 sm:order-1 flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            form="anchorForm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || session.data?.user?.id !== user?.id}
            className="order-1 sm:order-2 flex-1 px-6 py-3 bg-linear-to-r from-teal-600 via-cyan-600 to-blue-600 text-white rounded-lg hover:from-teal-500 hover:to-blue-500 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Dropping...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{isUpdating ? 'Update' : 'Drop'} Anchor</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}

export default AnchorForm
