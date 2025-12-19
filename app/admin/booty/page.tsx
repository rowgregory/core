'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  CreditCard,
  Receipt,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Eye,
  Edit3,
  Search,
  Bell,
  Coins,
  Banknote,
  BarChart3,
  Target,
  Award,
  Zap,
  FileText,
  Compass
} from 'lucide-react'
import InfoBanner from '@/app/components/common/InfoBanner'
import { LockedModuleBanner } from '@/app/components/common/LockedModuleBanner'

interface Invoice {
  id: string
  memberId: string
  memberName: string
  memberEmail: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  amount: number
  status: 'draft' | 'sent' | 'viewed' | 'overdue' | 'paid' | 'cancelled'
  type: 'membership_dues' | 'event_payment' | 'fine' | 'merchandise' | 'other'
  description: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  paymentMethod?: 'credit_card' | 'bank_transfer' | 'cash' | 'check'
  paidDate?: string
  notes?: string
  reminder_sent?: number
  late_fee?: number
}

interface PaymentRecord {
  id: string
  invoiceId: string
  memberId: string
  memberName: string
  amount: number
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'check'
  date: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  reference?: string
  fees?: number
  net_amount?: number
}

const BootyBillingPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'dashboard' | 'invoices' | 'payments' | 'create' | 'reports'>('dashboard')
  const [filterStatus, setFilterStatus] = useState<'all' | 'outstanding' | 'overdue' | 'paid'>('all')
  const [filterType, setFilterType] = useState<'all' | 'membership_dues' | 'event_payment' | 'fine' | 'merchandise'>(
    'all'
  )
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const invoices: Invoice[] = [
    {
      id: '1',
      memberId: 'M001',
      memberName: 'John Smith',
      memberEmail: 'john@techcorp.com',
      invoiceNumber: 'BNI-2025-001',
      issueDate: '2025-01-01',
      dueDate: '2025-01-31',
      amount: 450,
      status: 'paid',
      type: 'membership_dues',
      description: 'Q1 2025 Membership Dues',
      items: [
        { description: 'Quarterly Membership Fee', quantity: 1, unitPrice: 400, total: 400 },
        { description: 'Chapter Activity Fee', quantity: 1, unitPrice: 50, total: 50 }
      ],
      paymentMethod: 'credit_card',
      paidDate: '2025-01-15'
    },
    {
      id: '2',
      memberId: 'M002',
      memberName: 'Sarah Johnson',
      memberEmail: 'sarah@marketpro.com',
      invoiceNumber: 'BNI-2025-002',
      issueDate: '2025-01-05',
      dueDate: '2025-01-20',
      amount: 75,
      status: 'overdue',
      type: 'event_payment',
      description: 'Harbor Happy Hour - January',
      items: [
        { description: 'Event Ticket', quantity: 1, unitPrice: 50, total: 50 },
        { description: 'Plus One Ticket', quantity: 1, unitPrice: 25, total: 25 }
      ],
      reminder_sent: 2,
      late_fee: 10
    },
    {
      id: '3',
      memberId: 'M003',
      memberName: 'Mike Davis',
      memberEmail: 'mike@financefirm.com',
      invoiceNumber: 'BNI-2025-003',
      issueDate: '2025-01-10',
      dueDate: '2025-02-10',
      amount: 25,
      status: 'sent',
      type: 'fine',
      description: 'Late Attendance Fine',
      items: [{ description: 'Missed Meeting Fine (3 absences)', quantity: 3, unitPrice: 25, total: 75 }],
      reminder_sent: 0
    },
    {
      id: '4',
      memberId: 'M004',
      memberName: 'Lisa Chen',
      memberEmail: 'lisa@legalpartners.com',
      invoiceNumber: 'BNI-2025-004',
      issueDate: '2025-01-12',
      dueDate: '2025-01-27',
      amount: 120,
      status: 'viewed',
      type: 'merchandise',
      description: 'Chapter Merchandise Order',
      items: [
        { description: 'BNI Polo Shirt', quantity: 2, unitPrice: 35, total: 70 },
        { description: 'Business Card Holder', quantity: 1, unitPrice: 25, total: 25 },
        { description: 'Chapter Badge', quantity: 1, unitPrice: 15, total: 15 },
        { description: 'Shipping', quantity: 1, unitPrice: 10, total: 10 }
      ]
    }
  ]

  const payments: PaymentRecord[] = [
    {
      id: 'P001',
      invoiceId: '1',
      memberId: 'M001',
      memberName: 'John Smith',
      amount: 450,
      method: 'credit_card',
      date: '2025-01-15',
      status: 'completed',
      reference: 'ch_1234567890',
      fees: 13.5,
      net_amount: 436.5
    },
    {
      id: 'P002',
      invoiceId: '5',
      memberId: 'M005',
      memberName: 'Emma Rodriguez',
      amount: 200,
      method: 'bank_transfer',
      date: '2025-01-10',
      status: 'completed',
      reference: 'TXN-987654321',
      fees: 5.0,
      net_amount: 195.0
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      case 'sent':
      case 'pending':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      case 'viewed':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'overdue':
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'draft':
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
      case 'cancelled':
      case 'refunded':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return CheckCircle
      case 'overdue':
      case 'failed':
        return XCircle
      case 'sent':
      case 'viewed':
      case 'pending':
        return Clock
      case 'draft':
        return FileText
      default:
        return AlertTriangle
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'membership_dues':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      case 'event_payment':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30'
      case 'fine':
        return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'merchandise':
        return 'text-green-400 bg-green-500/10 border-green-500/30'
      case 'other':
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const calculateFinancials = () => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0)
    const totalPaid = payments.reduce((sum, pay) => (pay.status === 'completed' ? sum + pay.amount : sum), 0)
    const totalOutstanding = invoices
      .filter((inv) => ['sent', 'viewed'].includes(inv.status))
      .reduce((sum, inv) => sum + inv.amount, 0)
    const totalOverdue = invoices.filter((inv) => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)
    const avgInvoiceValue = invoices.length > 0 ? totalInvoiced / invoices.length : 0
    const collectionRate = totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0
    const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length

    return {
      totalInvoiced,
      totalPaid,
      totalOutstanding,
      totalOverdue,
      avgInvoiceValue,
      collectionRate: Math.round(collectionRate * 10) / 10,
      overdueCount,
      totalFees: payments.reduce((sum, pay) => sum + (pay.fees || 0), 0)
    }
  }

  const financials = calculateFinancials()

  return (
    <div className="bg-gray-900 min-h-[calc(100vh-68px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 px-3 py-6 sm:p-6 overflow-y-auto space-y-6"
      >
        {/* Booty Info Banner */}
        <InfoBanner
          type="booty"
          description="Booty is the payments and revenue module. Once unlocked, this page will allow your chapter to accept payments, track income, and manage financial activity directly through the platform. For now, this feature is locked and not yet available."
        />
        <LockedModuleBanner />
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          {/* Navigation */}
          <div className="flex flex-col sm:flex-wrap sm:items-center gap-y-4 sm:gap-4 p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Navigation:</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-x-2">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'dashboard'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-700/70'
                }`}
              >
                Treasure Map
              </button>
              <button
                onClick={() => setViewMode('invoices')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'invoices'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-700/70'
                }`}
              >
                Bills & Invoices
              </button>
              <button
                onClick={() => setViewMode('payments')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'payments'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-700/70'
                }`}
              >
                Payments Ledger
              </button>
              <button
                onClick={() => setViewMode('reports')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'reports'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-700/70'
                }`}
              >
                Financial Charts
              </button>
            </div>

            {viewMode === 'invoices' && (
              <>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="all">All Status</option>
                  <option value="outstanding">Outstanding</option>
                  <option value="overdue">Overdue</option>
                  <option value="paid">Paid</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="all">All Types</option>
                  <option value="membership_dues">Membership Dues</option>
                  <option value="event_payment">Event Payment</option>
                  <option value="fine">Fines</option>
                  <option value="merchandise">Merchandise</option>
                </select>
              </>
            )}

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search treasure..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full sm:w-fit"
              />
            </div>
          </div>
        </motion.div>

        {/* Financial Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8"
        >
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Receipt className="w-5 h-5 text-yellow-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-bold text-white">${financials.totalInvoiced.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Invoiced</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-5 h-5 text-emerald-400" />
              <span className="text-xs text-gray-400">Collected</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">${financials.totalPaid.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Paid</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-xs text-gray-400">Pending</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">${financials.totalOutstanding.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Outstanding</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-xs text-gray-400">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-red-400">${financials.totalOverdue.toLocaleString()}</div>
            <div className="text-xs text-gray-400">{financials.overdueCount} bills</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-gray-400">Average</span>
            </div>
            <div className="text-2xl font-bold text-white">${Math.round(financials.avgInvoiceValue)}</div>
            <div className="text-xs text-gray-400">Invoice Value</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-gray-400">Collection</span>
            </div>
            <div className="text-2xl font-bold text-white">{financials.collectionRate}%</div>
            <div className="text-xs text-gray-400">Rate</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-orange-400" />
              <span className="text-xs text-gray-400">Fees</span>
            </div>
            <div className="text-2xl font-bold text-white">${financials.totalFees.toFixed(0)}</div>
            <div className="text-xs text-gray-400">Processing</div>
          </div>

          <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-xs text-gray-400">Net</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              ${(financials.totalPaid - financials.totalFees).toFixed(0)}
            </div>
            <div className="text-xs text-gray-400">Revenue</div>
          </div>
        </motion.div>

        {/* Dashboard View */}
        {viewMode === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Recent Invoices */}
            <div className="lg:col-span-2 bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm">
              <div className="p-6 border-b border-gray-700/50">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Recent Treasure Bills
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {invoices.slice(0, 5).map((invoice, index) => {
                    const StatusIcon = getStatusIcon(invoice.status)
                    return (
                      <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 bg-gray-700/20 rounded-lg hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-x-4">
                          <div className={`p-2 rounded-lg w-fit ${getStatusColor(invoice.status)}`}>
                            <StatusIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{invoice.memberName}</h4>
                            <p className="text-sm text-gray-400">{invoice.description}</p>
                            <p className="text-xs text-gray-500">#{invoice.invoiceNumber}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">${invoice.amount}</div>
                          <div className="text-xs text-gray-400">
                            Due: {new Date(invoice.dueDate).toLocaleDateString()}
                          </div>
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border mt-1 ${getStatusColor(invoice.status)}`}
                          >
                            {invoice.status.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="space-y-6">
              {/* Overdue Items */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Overdue Bills
                </h3>
                <div className="space-y-2">
                  {invoices
                    .filter((inv) => inv.status === 'overdue')
                    .map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300 truncate">{invoice.memberName}</span>
                        <span className="text-red-400 font-semibold">${invoice.amount}</span>
                      </div>
                    ))}
                  {invoices.filter((inv) => inv.status === 'overdue').length === 0 && (
                    <p className="text-gray-400 text-sm">No overdue bills - excellent!</p>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Methods
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Credit Card:</span>
                    <span className="text-emerald-400">
                      {payments.filter((p) => p.method === 'credit_card').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Bank Transfer:</span>
                    <span className="text-blue-400">{payments.filter((p) => p.method === 'bank_transfer').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Cash:</span>
                    <span className="text-yellow-400">{payments.filter((p) => p.method === 'cash').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Check:</span>
                    <span className="text-purple-400">{payments.filter((p) => p.method === 'check').length}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm transition-colors">
                    Send Payment Reminders
                  </button>
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors">
                    Generate Monthly Report
                  </button>
                  <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition-colors">
                    Process Batch Payments
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Invoices List View */}
        {viewMode === 'invoices' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Receipt className="w-6 h-6 mr-2" />
                  Bills & Invoices
                </h2>
                <div className="text-sm text-gray-400">{invoices.length} total bills</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/30">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-300">Invoice</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Member</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Type</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Amount</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Due Date</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {invoices.map((invoice, index) => {
                    const StatusIcon = getStatusIcon(invoice.status)
                    const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid'

                    return (
                      <motion.tr
                        key={invoice.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className={`hover:bg-gray-700/20 transition-colors ${isOverdue ? 'bg-red-500/5' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-white">#{invoice.invoiceNumber}</div>
                            <div className="text-sm text-gray-400 truncate max-w-xs">{invoice.description}</div>
                            <div className="text-xs text-gray-500">
                              Issued: {new Date(invoice.issueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div>
                            <div className="font-semibold text-white">{invoice.memberName}</div>
                            <div className="text-sm text-gray-400">{invoice.memberEmail}</div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getTypeColor(invoice.type)}`}
                          >
                            {invoice.type.replace('_', ' ').toUpperCase()}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="text-lg font-bold text-white">${invoice.amount}</div>
                          {invoice.late_fee && invoice.late_fee > 0 && (
                            <div className="text-xs text-red-400">+${invoice.late_fee} late fee</div>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className={`text-sm font-medium ${isOverdue ? 'text-red-400' : 'text-white'}`}>
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </div>
                          {isOverdue && (
                            <div className="text-xs text-red-400">
                              {Math.ceil((Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))}{' '}
                              days overdue
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(invoice.status)}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              <span>{invoice.status.replace('_', ' ').toUpperCase()}</span>
                            </div>
                            {invoice.reminder_sent && invoice.reminder_sent > 0 && (
                              <div className="text-xs text-yellow-400">
                                {invoice.reminder_sent} reminder{invoice.reminder_sent > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-1">
                            <button className="p-2 text-gray-400 hover:text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-yellow-400 rounded-lg hover:bg-yellow-500/10 transition-colors">
                              <Send className="w-4 h-4" />
                            </button>
                            {invoice.status === 'overdue' && (
                              <button className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
                                <Bell className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Payments View */}
        {viewMode === 'payments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Coins className="w-6 h-6 mr-2" />
                  Payments Ledger
                </h2>
                <div className="text-sm text-gray-400">{payments.length} payments recorded</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/30">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-300">Payment ID</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Member</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Amount</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Method</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-4 py-4 text-sm font-semibold text-gray-300">Net Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {payments.map((payment, index) => {
                    const StatusIcon = getStatusIcon(payment.status)

                    return (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="hover:bg-gray-700/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-white">{payment.id}</div>
                            {payment.reference && <div className="text-xs text-gray-400">Ref: {payment.reference}</div>}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="font-semibold text-white">{payment.memberName}</div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="text-lg font-bold text-emerald-400">${payment.amount}</div>
                          {payment.fees && payment.fees > 0 && (
                            <div className="text-xs text-orange-400">-${payment.fees} fees</div>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            {payment.method === 'credit_card' && <CreditCard className="w-4 h-4 text-blue-400" />}
                            {payment.method === 'bank_transfer' && <Banknote className="w-4 h-4 text-green-400" />}
                            {payment.method === 'cash' && <Coins className="w-4 h-4 text-yellow-400" />}
                            {payment.method === 'check' && <FileText className="w-4 h-4 text-purple-400" />}
                            <span className="text-gray-300 capitalize text-sm">{payment.method.replace('_', ' ')}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="text-sm text-white">{new Date(payment.date).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">{new Date(payment.date).toLocaleTimeString()}</div>
                        </td>

                        <td className="px-4 py-4">
                          <div
                            className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(payment.status)}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            <span>{payment.status.toUpperCase()}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="text-lg font-bold text-white">
                            ${payment.net_amount?.toFixed(2) || (payment.amount - (payment.fees || 0)).toFixed(2)}
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Reports View */}
        {viewMode === 'reports' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Revenue Trends */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Revenue Trends
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-400">This Month</div>
                    <div className="text-2xl font-bold text-emerald-400">${financials.totalPaid.toLocaleString()}</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-emerald-400" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Collection Rate</span>
                    <span className="text-white font-semibold">{financials.collectionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${financials.collectionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Status Distribution */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Invoice Status
              </h3>
              <div className="space-y-3">
                {['paid', 'sent', 'overdue', 'viewed'].map((status) => {
                  const count = invoices.filter((inv) => inv.status === status).length
                  const percentage = (count / invoices.length) * 100
                  const StatusIcon = getStatusIcon(status)
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 capitalize">{status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-white font-semibold text-sm w-8">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Payment Methods Analysis */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Methods
              </h3>
              <div className="space-y-3">
                {['credit_card', 'bank_transfer', 'cash', 'check'].map((method) => {
                  const methodPayments = payments.filter((p) => p.method === method)
                  const total = methodPayments.reduce((sum, p) => sum + p.amount, 0)
                  const fees = methodPayments.reduce((sum, p) => sum + (p.fees || 0), 0)

                  return (
                    <div key={method} className="p-3 bg-gray-700/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300 capitalize text-sm">{method.replace('_', ' ')}</span>
                        <span className="text-white font-semibold">${total}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {methodPayments.length} payments • ${fees.toFixed(2)} in fees
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Outstanding Balances */}
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Outstanding Balances
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-400">Current</div>
                    <div className="text-lg font-bold text-blue-400">${financials.totalOutstanding}</div>
                  </div>
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>

                <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div>
                    <div className="text-sm text-gray-400">Overdue</div>
                    <div className="text-lg font-bold text-red-400">${financials.totalOverdue}</div>
                  </div>
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>

                <div className="text-xs text-gray-400 pt-2">
                  Total outstanding: ${(financials.totalOutstanding + financials.totalOverdue).toLocaleString()}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Items Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Urgent Actions
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Overdue bills:</span>
                <span className="text-red-400 font-semibold">{financials.overdueCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Amount overdue:</span>
                <span className="text-red-400 font-semibold">${financials.totalOverdue}</span>
              </div>
              <button className="w-full mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm transition-colors">
                Send Reminders
              </button>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Pending Items
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Awaiting payment:</span>
                <span className="text-yellow-400 font-semibold">
                  {invoices.filter((inv) => ['sent', 'viewed'].includes(inv.status)).length}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Total pending:</span>
                <span className="text-yellow-400 font-semibold">${financials.totalOutstanding}</span>
              </div>
              <button className="w-full mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm transition-colors">
                Follow Up
              </button>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Success Metrics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Collection rate:</span>
                <span className="text-emerald-400 font-semibold">{financials.collectionRate}%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Revenue this month:</span>
                <span className="text-emerald-400 font-semibold">${financials.totalPaid}</span>
              </div>
              <div className="text-xs text-gray-400 text-center mt-3">Excellent treasure collection rate!</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default BootyBillingPage
