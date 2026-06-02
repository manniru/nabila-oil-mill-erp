"use client"

import React, { useState, useEffect, useCallback } from 'react'
import {
  LayoutDashboard,
  Truck,
  AlertTriangle,
  CreditCard,
  Coins,
  Users,
  Menu,
  X,
  Plus,
  Search,
  Check,
  CheckCircle2,
  Trash2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  MapPin,
  Calendar,
  Save,
  Phone,
  UserCheck,
  Sun,
  Moon
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMounted, setIsMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [darkMode, setDarkMode] = useState(true)

  // Effect to sync and persist theme
  useEffect(() => {
    const theme = localStorage.getItem('erp-theme')
    if (theme === 'light') {
      setDarkMode(false)
      document.body.classList.add('light')
    }
  }, [])

  const toggleTheme = () => {
    if (darkMode) {
      document.body.classList.add('light')
      localStorage.setItem('erp-theme', 'light')
      setDarkMode(false)
    } else {
      document.body.classList.remove('light')
      localStorage.setItem('erp-theme', 'dark')
      setDarkMode(true)
    }
  }

  // Loading States
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState<any>({
    stats: {
      totalTrips: 0,
      totalRevenue: 0,
      totalShortageAmount: 0,
      totalWeight: 0,
      outstandingShortagesCount: 0,
      totalOutstandingShortageQty: 0,
      totalExpensesAmount: 0
    },
    recentExpenses: [],
    recentTrips: [],
    charts: {
      monthlyRevenue: [],
      shortagesByTruck: [],
      expensesByCategory: []
    }
  })

  // Entity Lists
  const [trips, setTrips] = useState<any[]>([])
  const [shortages, setShortages] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [salaries, setSalaries] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  // Modal States
  const [showTripModal, setShowTripModal] = useState(false)
  const [showShortageModal, setShowShortageModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOption, setFilterOption] = useState('ALL')

  // Form States
  const [tripForm, setTripForm] = useState({
    loadDate: new Date().toISOString().slice(0, 10),
    transporter: 'NABILA OIL MILL',
    truckNumber: '',
    product: 'JET A-1',
    driverName: '',
    driverPhone: '',
    origin: 'DANGOTE REFINERY LAGOS',
    destination: '',
    waybillNumber: '',
    weightQuantity: '',
    price: '',
    shortageQty: '0',
    shortageAmount: '0'
  })

  const [shortageForm, setShortageForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    truckNumber: '',
    ullageN1: '0',
    ullageN2: '0',
    ullageN3: '0',
    qtyDepots: '',
    shortageQty: '',
    resolved: false
  })

  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    particulars: '',
    description: '',
    amount: '',
    modeOfPayment: 'TRANSFER',
    cashReceived: '0',
    dateReceived: '',
    receivedFrom: ''
  })

  const [employeeForm, setEmployeeForm] = useState({
    nin: '',
    name: '',
    phone: '',
    address: '',
    dob: '',
    lga: '',
    state: '',
    guarantor: '',
    designation: '',
    dofa: new Date().toISOString().slice(0, 10)
  })

  // Mount check
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fetch Dashboard and Entity data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      if (activeTab === 'dashboard') {
        const res = await fetch('/api/nabila/dashboard')
        const data = await res.json()
        if (data.success) {
          setDashboardData(data)
        }
      } else if (activeTab === 'trips') {
        const res = await fetch('/api/nabila/trips')
        const data = await res.json()
        if (data.success) setTrips(data.trips)
      } else if (activeTab === 'shortages') {
        const res = await fetch('/api/nabila/shortages')
        const data = await res.json()
        if (data.success) setShortages(data.shortages)
      } else if (activeTab === 'expenses') {
        const res = await fetch('/api/nabila/expenses')
        const data = await res.json()
        if (data.success) setExpenses(data.expenses)
      } else if (activeTab === 'salaries') {
        const res = await fetch('/api/nabila/salaries')
        const data = await res.json()
        if (data.success) setSalaries(data.salaries)
      } else if (activeTab === 'employees') {
        const res = await fetch('/api/nabila/employees')
        const data = await res.json()
        if (data.success) setEmployees(data.employees)
      }
    } catch (err) {
      console.error('Error fetching ERP data:', err)
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    fetchData()
  }, [fetchData, refreshKey])

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0
    }).format(val)
  }

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat().format(val)
  }

  // Handle Shortage Toggle
  const toggleShortageResolved = async (id: string, currentStatus: boolean) => {
    setSavingId(id)
    try {
      const res = await fetch('/api/nabila/shortages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, resolved: !currentStatus })
      })
      const data = await res.json()
      if (data.success) {
        setShortages(prev =>
          prev.map(s => (s.id === id ? { ...s, resolved: !currentStatus } : s))
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSavingId(null)
    }
  }

  // Handle Salary Inline Editing
  const handleSalaryUpdate = async (id: string, field: string, value: string) => {
    setSavingId(`${id}-${field}`)
    const numericVal = parseFloat(value) || 0
    try {
      const res = await fetch('/api/nabila/salaries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          [field]: field === 'comment' ? value : numericVal
        })
      })
      const data = await res.json()
      if (data.success) {
        setSalaries(prev =>
          prev.map(s => (s.id === id ? { ...s, [field]: field === 'comment' ? value : numericVal } : s))
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(() => setSavingId(null), 400) // Delay to show confirmation checkmark
    }
  }

  // Delete Entity
  const deleteEntity = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    try {
      const res = await fetch(`/api/nabila/${type}?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        setRefreshKey(p => p + 1)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Submit Handlers
  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/nabila/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripForm)
      })
      const data = await res.json()
      if (data.success) {
        setShowTripModal(false)
        setRefreshKey(p => p + 1)
        setTripForm({
          loadDate: new Date().toISOString().slice(0, 10),
          transporter: 'NABILA OIL MILL',
          truckNumber: '',
          product: 'JET A-1',
          driverName: '',
          driverPhone: '',
          origin: 'DANGOTE REFINERY LAGOS',
          destination: '',
          waybillNumber: '',
          weightQuantity: '',
          price: '',
          shortageQty: '0',
          shortageAmount: '0'
        })
      } else {
        alert(data.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddShortage = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/nabila/shortages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shortageForm)
      })
      const data = await res.json()
      if (data.success) {
        setShowShortageModal(false)
        setRefreshKey(p => p + 1)
        setShortageForm({
          date: new Date().toISOString().slice(0, 10),
          truckNumber: '',
          ullageN1: '0',
          ullageN2: '0',
          ullageN3: '0',
          qtyDepots: '',
          shortageQty: '',
          resolved: false
        })
      } else {
        alert(data.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/nabila/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseForm)
      })
      const data = await res.json()
      if (data.success) {
        setShowExpenseModal(false)
        setRefreshKey(p => p + 1)
        setExpenseForm({
          date: new Date().toISOString().slice(0, 10),
          particulars: '',
          description: '',
          amount: '',
          modeOfPayment: 'TRANSFER',
          cashReceived: '0',
          dateReceived: '',
          receivedFrom: ''
        })
      } else {
        alert(data.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/nabila/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeForm)
      })
      const data = await res.json()
      if (data.success) {
        setShowEmployeeModal(false)
        setRefreshKey(p => p + 1)
        setEmployeeForm({
          nin: '',
          name: '',
          phone: '',
          address: '',
          dob: '',
          lga: '',
          state: '',
          guarantor: '',
          designation: '',
          dofa: new Date().toISOString().slice(0, 10)
        })
      } else {
        alert(data.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Render Skeleton Loaders
  const renderSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 bg-slate-800/80 rounded-xl w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 bg-slate-800/60 rounded-2xl border border-slate-700/30"></div>
        ))}
      </div>
      <div className="h-80 bg-slate-800/40 rounded-2xl border border-slate-700/20"></div>
    </div>
  )

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6']

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-[#0b0f19] text-slate-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-800/80 py-6 px-4 shrink-0">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/30">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">NABILA OIL MILL</h1>
            <span className="text-xs text-indigo-400 font-medium">Enterprise ERP Suite</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'trips', label: 'Haulage Trips', icon: Truck },
            { id: 'shortages', label: 'Shortages Tracker', icon: AlertTriangle },
            { id: 'expenses', label: 'Daily Expenses', icon: CreditCard },
            { id: 'salaries', label: 'Salaries Ledger', icon: Coins },
            { id: 'employees', label: 'Employees DB', icon: Users }
          ].map(item => {
            const Icon = item.icon
            const active = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSearchQuery('')
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/10 border-l-4 border-indigo-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800/50 px-2 text-center">
          <p className="text-xs text-slate-500">System Live • Version 2.0</p>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-sm">
          <div className="w-64 glass-panel h-full p-6 flex flex-col animate-slide-in">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500 text-white">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">NABILA ERP</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'trips', label: 'Haulage Trips', icon: Truck },
                { id: 'shortages', label: 'Shortages Tracker', icon: AlertTriangle },
                { id: 'expenses', label: 'Daily Expenses', icon: CreditCard },
                { id: 'salaries', label: 'Salaries Ledger', icon: Coins },
                { id: 'employees', label: 'Employees DB', icon: Users }
              ].map(item => {
                const Icon = item.icon
                const active = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSearchQuery('')
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 p-4 md:p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3 md:gap-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white md:hidden hover:bg-slate-800/50"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white capitalize">
                {activeTab === 'dashboard' ? 'Operational Intelligence' : `${activeTab} Management`}
              </h2>
              <p className="text-xs md:text-sm text-slate-400 hidden sm:block">
                Real-time logistic metrics and financial controls for Nabila Oil Mill.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-400 hover:text-amber-300 border border-slate-700/50 transition-all shadow-md active:scale-95 flex items-center gap-2"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              <span className="text-xs font-semibold hidden sm:inline">
                {darkMode ? "Light Mode" : "Dark Mode"}
              </span>
            </button>

            <button
              onClick={() => setRefreshKey(p => p + 1)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-indigo-400 hover:text-indigo-300 border border-slate-700/50 transition-all shadow-md active:scale-95 flex items-center gap-2"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs font-semibold hidden sm:inline">Reload Database</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        {loading ? (
          renderSkeleton()
        ) : (
          <div className="flex-1">
            {/* 1. DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
                    <div className="absolute top-0 right-0 p-6 opacity-10 text-emerald-400">
                      <TrendingUp className="w-16 h-16" />
                    </div>
                    <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Haulage Revenue</span>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {formatCurrency(dashboardData.stats.totalRevenue)}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-xs text-emerald-400 font-medium">
                      <span>Total historical sales logged</span>
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
                    <div className="absolute top-0 right-0 p-6 opacity-10 text-rose-500">
                      <AlertTriangle className="w-16 h-16" />
                    </div>
                    <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Outstanding Shortages</span>
                    <h3 className="text-2xl font-bold text-rose-400 mt-1">
                      {formatNumber(dashboardData.stats.totalOutstandingShortageQty)} L
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-xs text-rose-500 font-medium">
                      <span>Across {dashboardData.stats.outstandingShortagesCount} active transit shortages</span>
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
                    <div className="absolute top-0 right-0 p-6 opacity-10 text-amber-500">
                      <Coins className="w-16 h-16" />
                    </div>
                    <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Operating Expenses</span>
                    <h3 className="text-2xl font-bold text-amber-400 mt-1">
                      {formatCurrency(dashboardData.stats.totalExpensesAmount)}
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-xs text-amber-500 font-medium">
                      <span>Daily operational disbursements</span>
                    </div>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]">
                    <div className="absolute top-0 right-0 p-6 opacity-10 text-indigo-400">
                      <Truck className="w-16 h-16" />
                    </div>
                    <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Fuel Litres Dispatched</span>
                    <h3 className="text-2xl font-bold text-indigo-400 mt-1">
                      {formatNumber(dashboardData.stats.totalWeight)} L
                    </h3>
                    <div className="flex items-center gap-1 mt-2 text-xs text-indigo-400 font-medium">
                      <span>Across {dashboardData.stats.totalTrips} heavy hauls</span>
                    </div>
                  </div>
                </div>

                {/* Recharts Graphs */}
                {isMounted && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Revenue Area Chart */}
                    <div className="glass-panel p-6 rounded-2xl">
                      <h4 className="text-base font-bold text-white mb-4">Monthly Haulage Performance</h4>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dashboardData.charts.monthlyRevenue}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                              formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                            />
                            <Area type="monotone" dataKey="Revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Shortages by Truck Bar Chart */}
                    <div className="glass-panel p-6 rounded-2xl">
                      <h4 className="text-base font-bold text-white mb-4">Transit Shortages by Fleet (Litres)</h4>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={dashboardData.charts.shortagesByTruck}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="truck" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                              formatter={(value: any) => [`${formatNumber(value)} L`, 'Shortage']}
                            />
                            <Bar dataKey="Quantity" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={24} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dashboard Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Trips */}
                  <div className="glass-panel p-6 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-bold text-white">Recent Haulage Log</h4>
                      <button onClick={() => setActiveTab('trips')} className="text-xs text-indigo-400 font-semibold hover:text-indigo-300">
                        View All
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800/80 text-slate-400 font-medium">
                            <th className="py-2.5">Date</th>
                            <th className="py-2.5">Truck</th>
                            <th className="py-2.5">Route</th>
                            <th className="py-2.5 text-right">Revenue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {dashboardData.recentTrips.map((t: any) => (
                            <tr key={t.id} className="text-slate-300 hover:bg-slate-800/30">
                              <td className="py-3 font-medium">{new Date(t.loadDate).toLocaleDateString()}</td>
                              <td className="py-3 font-semibold text-slate-100">{t.truckNumber}</td>
                              <td className="py-3 text-xs truncate max-w-[120px]" title={`${t.origin} ➔ ${t.destination}`}>
                                {t.destination}
                              </td>
                              <td className="py-3 text-right font-bold text-emerald-400">
                                {formatCurrency(t.haulageAmount)}
                              </td>
                            </tr>
                          ))}
                          {dashboardData.recentTrips.length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-6 text-center text-slate-500">No trips logged yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Expenses */}
                  <div className="glass-panel p-6 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-bold text-white">Recent Disbursements</h4>
                      <button onClick={() => setActiveTab('expenses')} className="text-xs text-indigo-400 font-semibold hover:text-indigo-300">
                        View All
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800/80 text-slate-400 font-medium">
                            <th className="py-2.5">Date</th>
                            <th className="py-2.5">Item</th>
                            <th className="py-2.5">Particulars</th>
                            <th className="py-2.5 text-right">Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {dashboardData.recentExpenses.map((e: any) => (
                            <tr key={e.id} className="text-slate-300 hover:bg-slate-800/30">
                              <td className="py-3 font-medium">{new Date(e.date).toLocaleDateString()}</td>
                              <td className="py-3 text-xs max-w-[140px] truncate" title={e.description}>{e.description}</td>
                              <td className="py-3 text-xs font-semibold text-indigo-400">{e.particulars}</td>
                              <td className="py-3 text-right font-bold text-amber-400">
                                {formatCurrency(e.amount)}
                              </td>
                            </tr>
                          ))}
                          {dashboardData.recentExpenses.length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-6 text-center text-slate-500">No expenses logged yet.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. TRIPS LOGGER VIEW */}
            {activeTab === 'trips' && (
              <div className="space-y-6">
                {/* Filters and Add button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by truck, driver or waybill..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/80 transition text-white placeholder-slate-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowTripModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Log Haulage Trip
                  </button>
                </div>

                {/* Trips Data Table */}
                <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-slate-800/85">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold">
                          <th className="p-4">Date</th>
                          <th className="p-4">Waybill</th>
                          <th className="p-4">Truck Number</th>
                          <th className="p-4">Driver</th>
                          <th className="p-4">Product</th>
                          <th className="p-4">Route</th>
                          <th className="p-4 text-right">Volume</th>
                          <th className="p-4 text-right">Haulage Fee</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {trips
                          .filter(t =>
                            t.truckNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (t.waybillNumber && t.waybillNumber.includes(searchQuery))
                          )
                          .map((trip) => (
                            <tr key={trip.id} className="text-slate-300 hover:bg-slate-800/30 transition duration-150">
                              <td className="p-4 font-medium">{new Date(trip.loadDate).toLocaleDateString()}</td>
                              <td className="p-4 font-mono text-xs">{trip.waybillNumber || 'N/A'}</td>
                              <td className="p-4 font-bold text-white">{trip.truckNumber}</td>
                              <td className="p-4 text-xs font-semibold">{trip.driverName}</td>
                              <td className="p-4">
                                <span className="text-[10px] font-bold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                  {trip.product}
                                </span>
                              </td>
                              <td className="p-4 text-xs max-w-[150px] truncate" title={`${trip.origin} ➔ ${trip.destination}`}>
                                <div className="text-slate-400">{trip.origin}</div>
                                <div className="text-white font-medium">➔ {trip.destination}</div>
                              </td>
                              <td className="p-4 text-right font-mono font-medium">{formatNumber(trip.weightQuantity)} L</td>
                              <td className="p-4 text-right font-bold text-emerald-400">{formatCurrency(trip.haulageAmount)}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => deleteEntity('trips', trip.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 active:scale-95 transition"
                                  title="Delete Trip"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        {trips.length === 0 && (
                          <tr>
                            <td colSpan={9} className="p-12 text-center text-slate-500">
                              No haulage trips logged in the system. Use the button above to add records.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SHORTAGES VIEW */}
            {activeTab === 'shortages' && (
              <div className="space-y-6">
                {/* Actions Panel */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setFilterOption('ALL')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                        filterOption === 'ALL' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All Shortages
                    </button>
                    <button
                      onClick={() => setFilterOption('PENDING')}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                        filterOption === 'PENDING' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Pending Only
                    </button>
                  </div>
                  <button
                    onClick={() => setShowShortageModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Register Shortage/Ullage
                  </button>
                </div>

                {/* Shortages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shortages
                    .filter(s => filterOption === 'ALL' || (filterOption === 'PENDING' && !s.resolved))
                    .map((item) => (
                      <div
                        key={item.id}
                        className={`glass-panel p-6 rounded-2xl border-l-4 transition-all duration-300 relative ${
                          item.resolved
                            ? 'border-l-emerald-500 hover:shadow-emerald-500/5'
                            : 'border-l-rose-500 hover:shadow-rose-500/5'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-white tracking-tight">{item.truckNumber}</h4>
                            <span className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                              item.resolved
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {item.resolved ? 'Reconciled' : 'Unresolved'}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Total Depot Volume:</span>
                            <span className="font-semibold text-slate-200">{formatNumber(item.qtyDepots)} L</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Ullage Measures (N1/N2/N3):</span>
                            <span className="font-semibold text-slate-200">
                              {item.ullageN1} / {item.ullageN2} / {item.ullageN3}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm pt-2 border-t border-slate-800/80">
                            <span className="text-slate-400 font-semibold">Shortage Quantity:</span>
                            <span className="font-bold text-rose-400">{formatNumber(item.shortageQty)} L</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-3">
                          <button
                            onClick={() => toggleShortageResolved(item.id, item.resolved)}
                            disabled={savingId === item.id}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold transition active:scale-98 ${
                              item.resolved
                                ? 'bg-slate-800 hover:bg-slate-700/80 text-slate-300'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/10'
                            }`}
                          >
                            {savingId === item.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : item.resolved ? (
                              'Mark Unresolved'
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Resolve Shortage
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => deleteEntity('shortages', item.id)}
                            className="p-2 bg-slate-800/80 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded-xl border border-slate-700/50 transition"
                            title="Delete Shortage"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  {shortages.length === 0 && (
                    <div className="col-span-full py-16 text-center text-slate-500">
                      No transit shortages logged. Click the button above to register an incident.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. EXPENSES VIEW */}
            {activeTab === 'expenses' && (
              <div className="space-y-6">
                {/* Search & Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by particulars or descriptive text..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/80 transition text-white placeholder-slate-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Log Expense
                  </button>
                </div>

                {/* Expenses Journal */}
                <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/85 shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold">
                          <th className="p-4">Date</th>
                          <th className="p-4">Particulars</th>
                          <th className="p-4">Description</th>
                          <th className="p-4">Method</th>
                          <th className="p-4 text-right">Cash Received</th>
                          <th className="p-4 text-right">Ledger Disbursed</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {expenses
                          .filter(e =>
                            e.particulars.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            e.description.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map((item) => (
                            <tr key={item.id} className="text-slate-300 hover:bg-slate-800/30 transition">
                              <td className="p-4 font-medium">{new Date(item.date).toLocaleDateString()}</td>
                              <td className="p-4">
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  {item.particulars}
                                </span>
                              </td>
                              <td className="p-4 text-xs font-medium max-w-[200px] truncate" title={item.description}>
                                {item.description}
                              </td>
                              <td className="p-4 text-xs font-semibold">{item.modeOfPayment}</td>
                              <td className="p-4 text-right text-emerald-400 font-mono font-medium">
                                {item.cashReceived > 0 ? formatCurrency(item.cashReceived) : '—'}
                              </td>
                              <td className="p-4 text-right font-bold text-amber-400 font-mono">
                                {formatCurrency(item.amount)}
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => deleteEntity('expenses', item.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 active:scale-95 transition"
                                  title="Delete Expense"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        {expenses.length === 0 && (
                          <tr>
                            <td colSpan={7} className="p-12 text-center text-slate-500">
                              No expense records logged in the journal. Add a record using the button above.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. IN-LINE SALARIES VIEW */}
            {activeTab === 'salaries' && (
              <div className="space-y-6">
                <div className="glass-panel p-4 rounded-2xl">
                  <h4 className="text-base font-bold text-white mb-1">Interactive Payroll Grid</h4>
                  <p className="text-xs text-slate-400">
                    Double-click or edit any cell below. Changes are automatically synced to the database.
                  </p>
                </div>

                {/* Salaries Grid */}
                <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/85 shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold">
                          <th className="p-4">Employee Name</th>
                          <th className="p-4">Designation</th>
                          <th className="p-4 text-right">December Amount (₦)</th>
                          <th className="p-4 text-right">January Amount (₦)</th>
                          <th className="p-4">Payroll Comments</th>
                          <th className="p-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {salaries.map((item) => (
                          <tr key={item.id} className="text-slate-300 hover:bg-slate-800/25 transition">
                            <td className="p-4 font-bold text-white">{item.employeeName}</td>
                            <td className="p-4 text-xs font-semibold text-slate-400">{item.designation}</td>
                            <td className="p-3 text-right">
                              <div className="relative flex items-center justify-end">
                                <input
                                  type="number"
                                  defaultValue={item.decemberAmount}
                                  onBlur={(e) => {
                                    if (parseFloat(e.target.value) !== item.decemberAmount) {
                                      handleSalaryUpdate(item.id, 'decemberAmount', e.target.value)
                                    }
                                  }}
                                  className="w-28 text-right bg-slate-800/40 border border-slate-700/40 focus:border-indigo-500 rounded px-2 py-1.5 focus:outline-none text-white font-mono font-semibold"
                                />
                                {savingId === `${item.id}-decemberAmount` && (
                                  <span className="absolute right-2 text-indigo-400">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <div className="relative flex items-center justify-end">
                                <input
                                  type="number"
                                  defaultValue={item.januaryAmount}
                                  onBlur={(e) => {
                                    if (parseFloat(e.target.value) !== item.januaryAmount) {
                                      handleSalaryUpdate(item.id, 'januaryAmount', e.target.value)
                                    }
                                  }}
                                  className="w-28 text-right bg-slate-800/40 border border-slate-700/40 focus:border-indigo-500 rounded px-2 py-1.5 focus:outline-none text-white font-mono font-semibold"
                                />
                                {savingId === `${item.id}-januaryAmount` && (
                                  <span className="absolute right-2 text-indigo-400">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="relative">
                                <input
                                  type="text"
                                  defaultValue={item.comment || ''}
                                  onBlur={(e) => {
                                    if (e.target.value !== (item.comment || '')) {
                                      handleSalaryUpdate(item.id, 'comment', e.target.value)
                                    }
                                  }}
                                  className="w-full bg-slate-800/40 border border-slate-700/40 focus:border-indigo-500 rounded px-3 py-1.5 focus:outline-none text-white text-xs font-medium"
                                  placeholder="Add notes..."
                                />
                                {savingId === `${item.id}-comment` && (
                                  <span className="absolute right-2 top-2 text-indigo-400">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <UserCheck className="w-3 h-3" />
                                Synced
                              </span>
                            </td>
                          </tr>
                        ))}
                        {salaries.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-12 text-center text-slate-500">
                              No employees added to the payroll grid. Setup staff in the Employees Database first.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 6. EMPLOYEES VIEW */}
            {activeTab === 'employees' && (
              <div className="space-y-6">
                {/* Header controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search employees by name, phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/80 transition text-white placeholder-slate-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowEmployeeModal(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-teal-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Employee
                  </button>
                </div>

                {/* Employees Profile Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {employees
                    .filter(emp =>
                      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      emp.phone.includes(searchQuery)
                    )
                    .map((emp) => (
                      <div key={emp.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg transition">
                        <div>
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg shrink-0">
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-base leading-tight tracking-tight">{emp.name}</h4>
                              <span className="text-xs text-slate-400 font-semibold">{emp.designation}</span>
                            </div>
                          </div>

                          <div className="space-y-2.5 border-t border-slate-800/80 pt-4 mb-6">
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                              <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>{emp.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                              <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span className="font-mono text-[10px]">NIN: {emp.nin}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span className="truncate">{emp.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-300">
                              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <span>Appointment: {new Date(emp.dofa).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-800/50 pt-4 mt-auto">
                          <span className="text-[10px] text-slate-400">Origin: {emp.lga}, {emp.state} STATE</span>
                          <button
                            onClick={() => deleteEntity('employees', emp.id)}
                            className="p-1.5 bg-slate-800/50 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded-lg border border-slate-700/30 transition"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  {employees.length === 0 && (
                    <div className="col-span-full py-16 text-center text-slate-500">
                      No employees registered in the system database. Click Add Employee to set up.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ---------------- MODALS ---------------- */}

      {/* 1. ADD TRIP MODAL */}
      {showTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
              <h3 className="text-lg font-bold text-white">Log New Haulage Trip</h3>
              <button onClick={() => setShowTripModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddTrip} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Load Date</label>
                  <input
                    type="date"
                    required
                    value={tripForm.loadDate}
                    onChange={(e) => setTripForm({ ...tripForm, loadDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Transporter</label>
                  <input
                    type="text"
                    required
                    value={tripForm.transporter}
                    onChange={(e) => setTripForm({ ...tripForm, transporter: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Truck Plate Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DKA894YF"
                    value={tripForm.truckNumber}
                    onChange={(e) => setTripForm({ ...tripForm, truckNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Product Type</label>
                  <select
                    value={tripForm.product}
                    onChange={(e) => setTripForm({ ...tripForm, product: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  >
                    <option value="JET A-1">JET A-1</option>
                    <option value="JET-A">JET-A</option>
                    <option value="AGO">AGO</option>
                    <option value="PMS">PMS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Driver Fullname</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LAMINU MUSTAPHA"
                    value={tripForm.driverName}
                    onChange={(e) => setTripForm({ ...tripForm, driverName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Driver Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. 08061241486"
                    value={tripForm.driverPhone}
                    onChange={(e) => setTripForm({ ...tripForm, driverPhone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Origin</label>
                  <input
                    type="text"
                    required
                    value={tripForm.origin}
                    onChange={(e) => setTripForm({ ...tripForm, origin: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Destination</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NIAMEY NIGER"
                    value={tripForm.destination}
                    onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Waybill Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 8200003915"
                    value={tripForm.waybillNumber}
                    onChange={(e) => setTripForm({ ...tripForm, waybillNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Quantity Loaded (Litres)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45000"
                    value={tripForm.weightQuantity}
                    onChange={(e) => setTripForm({ ...tripForm, weightQuantity: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Price Per Litre (₦)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 100"
                    value={tripForm.price}
                    onChange={(e) => setTripForm({ ...tripForm, price: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Haulage Amount (₦)</label>
                  <input
                    type="text"
                    disabled
                    value={
                      (parseFloat(tripForm.weightQuantity) || 0) * (parseFloat(tripForm.price) || 0) > 0
                        ? formatCurrency((parseFloat(tripForm.weightQuantity) || 0) * (parseFloat(tripForm.price) || 0))
                        : '0.00'
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-400 font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTripModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold rounded-xl hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl"
                >
                  Submit & Log Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ADD SHORTAGE MODAL */}
      {showShortageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
              <h3 className="text-lg font-bold text-white">Register Transit Shortage</h3>
              <button onClick={() => setShowShortageModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddShortage} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Incident Date</label>
                <input
                  type="date"
                  required
                  value={shortageForm.date}
                  onChange={(e) => setShortageForm({ ...shortageForm, date: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Truck Plate Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KEF63YW"
                  value={shortageForm.truckNumber}
                  onChange={(e) => setShortageForm({ ...shortageForm, truckNumber: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">Ullage N1</label>
                  <input
                    type="number"
                    step="0.1"
                    value={shortageForm.ullageN1}
                    onChange={(e) => setShortageForm({ ...shortageForm, ullageN1: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">Ullage N2</label>
                  <input
                    type="number"
                    step="0.1"
                    value={shortageForm.ullageN2}
                    onChange={(e) => setShortageForm({ ...shortageForm, ullageN2: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase">Ullage N3</label>
                  <input
                    type="number"
                    step="0.1"
                    value={shortageForm.ullageN3}
                    onChange={(e) => setShortageForm({ ...shortageForm, ullageN3: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Total Qty at Depot (L)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 44418"
                  value={shortageForm.qtyDepots}
                  onChange={(e) => setShortageForm({ ...shortageForm, qtyDepots: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Shortage Quantity (Litres)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 582"
                  value={shortageForm.shortageQty}
                  onChange={(e) => setShortageForm({ ...shortageForm, shortageQty: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowShortageModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold rounded-xl hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-xl"
                >
                  Register Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
              <h3 className="text-lg font-bold text-white">Log Operating Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Expense Date</label>
                <input
                  type="date"
                  required
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Particulars (Plate / Category)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TRN15XX, DOG FEED, SCHOOL FEES"
                  value={expenseForm.particulars}
                  onChange={(e) => setExpenseForm({ ...expenseForm, particulars: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Description Details</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bearings, Grease, Quran school fees"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Cost (₦)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 35000"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Payment Method</label>
                  <select
                    value={expenseForm.modeOfPayment}
                    onChange={(e) => setExpenseForm({ ...expenseForm, modeOfPayment: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  >
                    <option value="TRANSFER">TRANSFER</option>
                    <option value="CASH">CASH</option>
                    <option value="CHQ">CHEQUE</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-2">Optional Capital Inflow Ledger</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-400 mb-1 uppercase">Cash Inflow (₦)</label>
                    <input
                      type="number"
                      value={expenseForm.cashReceived}
                      onChange={(e) => setExpenseForm({ ...expenseForm, cashReceived: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-slate-400 mb-1 uppercase">Inflow Source</label>
                    <input
                      type="text"
                      placeholder="e.g. ALH. SAFIYANU"
                      value={expenseForm.receivedFrom}
                      onChange={(e) => setExpenseForm({ ...expenseForm, receivedFrom: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold rounded-xl hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded-xl"
                >
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADD EMPLOYEE MODAL */}
      {showEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
              <h3 className="text-lg font-bold text-white">Register Staff Profile</h3>
              <button onClick={() => setShowEmployeeModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Fullname</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ADAMU IDRIS"
                    value={employeeForm.name}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Designation / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MKA720ZB Driver, Manager"
                    value={employeeForm.designation}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, designation: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">NIN (11 Digits)</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    placeholder="e.g. 12345678901"
                    value={employeeForm.nin}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, nin: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08032111111"
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={employeeForm.dob}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, dob: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">First Appointment Date (DOFA)</label>
                  <input
                    type="date"
                    required
                    value={employeeForm.dofa}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, dofa: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">LGA of Origin</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kano Municipal"
                    value={employeeForm.lga}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, lga: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">State of Origin</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kano"
                    value={employeeForm.state}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, state: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Home Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. No. 12 Zaria Road, Kano"
                    value={employeeForm.address}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, address: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Guarantor Name & Contact</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alh. Ibrahim Kano (080xxxxxxxx)"
                    value={employeeForm.guarantor}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, guarantor: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmployeeModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-sm font-semibold rounded-xl hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-xl"
                >
                  Create Staff Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
