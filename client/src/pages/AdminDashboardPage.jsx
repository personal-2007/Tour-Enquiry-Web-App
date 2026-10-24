import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enquiryApi } from '../api/client';
import {
  Shield,
  LogOut,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Users,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  PhoneForwarded,
  XCircle,
  Download,
  Plus,
  Loader2,
  X,
  ExternalLink,
  Mail,
  Phone,
  AlertTriangle
} from 'lucide-react';

const STATUS_BADGES = {
  Pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: Clock,
  },
  Contacted: {
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    icon: PhoneForwarded,
  },
  Confirmed: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: CheckCircle,
  },
  Cancelled: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    icon: XCircle,
  },
};

const AdminDashboardPage = () => {
  const { admin, logout } = useAuth();

  // Dashboard Data State
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, contacted: 0, confirmed: 0, cancelled: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  
  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals State
  const [viewModalData, setViewModalData] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await enquiryApi.getStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Fetch Enquiries
  const fetchEnquiries = useCallback(async (page = 1, showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const params = {
        page,
        limit: pagination.limit,
        status: statusFilter || undefined,
        search: searchQuery.trim() || undefined,
      };

      const res = await enquiryApi.getEnquiries(params);
      if (res.data?.success) {
        setEnquiries(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [pagination.limit, statusFilter, searchQuery]);

  // Initial Load & triggers
  useEffect(() => {
    fetchStats();
    fetchEnquiries(1);
  }, [fetchEnquiries]);

  // Flash message handler
  const showFlash = (type, text) => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage({ type: '', text: '' });
    }, 4000);
  };

  // Quick Status Change from Table
  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      await enquiryApi.updateStatus(id, newStatus);
      showFlash('success', `Enquiry #${id} marked as ${newStatus}.`);
      fetchEnquiries(pagination.page, true);
      fetchStats();
      if (viewModalData && viewModalData.id === id) {
        setViewModalData((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      showFlash('error', err.response?.data?.message || 'Failed to update status.');
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await enquiryApi.updateEnquiry(editModalData.id, editModalData);
      showFlash('success', `Enquiry #${editModalData.id} updated successfully.`);
      setEditModalData(null);
      fetchEnquiries(pagination.page, true);
      fetchStats();
    } catch (err) {
      showFlash('error', err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setModalLoading(false);
    }
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deleteModalId) return;
    setModalLoading(true);
    try {
      await enquiryApi.deleteEnquiry(deleteModalId);
      showFlash('success', `Enquiry #${deleteModalId} has been deleted.`);
      setDeleteModalId(null);
      fetchEnquiries(pagination.page, true);
      fetchStats();
    } catch (err) {
      showFlash('error', err.response?.data?.message || 'Failed to delete record.');
    } finally {
      setModalLoading(false);
    }
  };

  // Handle Manual Add Enquiry Submit
  const handleNewSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      data.travellers = parseInt(data.travellers, 10);
      await enquiryApi.submitEnquiry(data);
      showFlash('success', 'New offline enquiry recorded successfully.');
      setIsNewModalOpen(false);
      fetchEnquiries(1, true);
      fetchStats();
    } catch (err) {
      showFlash('error', err.response?.data?.message || 'Failed to create enquiry.');
    } finally {
      setModalLoading(false);
    }
  };

  // CSV Export
  const exportToCSV = () => {
    if (!enquiries.length) {
      showFlash('error', 'No enquiries available to export.');
      return;
    }
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Destination', 'Travel Date', 'Travellers', 'Budget', 'Status', 'Created At'];
    const rows = enquiries.map((item) => [
      item.id,
      `"${item.full_name.replace(/"/g, '""')}"`,
      `"${item.email}"`,
      `"${item.phone}"`,
      `"${item.destination.replace(/"/g, '""')}"`,
      item.travel_date ? item.travel_date.split('T')[0] : '',
      item.travellers,
      `"${item.budget}"`,
      item.status,
      item.created_at,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `enquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFlash('success', 'Exported enquiries to CSV.');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white shadow">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">WanderFlow</span>
              <span className="text-xs text-brand-400 font-semibold ml-2 px-2 py-0.5 rounded bg-brand-950/70 border border-brand-800">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors hidden sm:flex"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-3 text-right">
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white">{admin?.name || 'Administrator'}</div>
                <div className="text-[11px] text-slate-400">{admin?.email}</div>
              </div>

              <button
                onClick={logout}
                title="Sign out of Admin session"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-300 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Flash Message Banner */}
        {actionMessage.text && (
          <div
            className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn ${
              actionMessage.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage({ type: '', text: '' })} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Header / KPI Stats Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Tour Enquiries Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time management of travel inquiries, customer details, and booking lifecycle.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchEnquiries(pagination.page, true)}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              <button
                onClick={exportToCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => setIsNewModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-700 hover:to-accent-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record Enquiry</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Total */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Enquiries</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">{stats.total}</div>
              <div className="text-[11px] text-slate-400 mt-1">All time received</div>
            </div>

            {/* Pending */}
            <div className="bg-white p-5 rounded-2xl border border-amber-200/70 shadow-sm bg-gradient-to-br from-white to-amber-50/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Pending</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <div className="text-3xl font-extrabold text-amber-900 mt-2">{stats.pending}</div>
              <div className="text-[11px] text-amber-600/80 mt-1">Awaiting specialist contact</div>
            </div>

            {/* Contacted */}
            <div className="bg-white p-5 rounded-2xl border border-blue-200/70 shadow-sm bg-gradient-to-br from-white to-blue-50/30">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">Contacted</span>
              <div className="text-3xl font-extrabold text-blue-900 mt-2">{stats.contacted}</div>
              <div className="text-[11px] text-blue-600/80 mt-1">Proposal / itinerary sent</div>
            </div>

            {/* Confirmed */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200/70 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Confirmed</span>
              <div className="text-3xl font-extrabold text-emerald-900 mt-2">{stats.confirmed}</div>
              <div className="text-[11px] text-emerald-600/80 mt-1">Booked & finalized</div>
            </div>

            {/* Cancelled */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm col-span-2 lg:col-span-1">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">Cancelled</span>
              <div className="text-3xl font-extrabold text-slate-800 mt-2">{stats.cancelled}</div>
              <div className="text-[11px] text-slate-400 mt-1">Closed or withdrawn</div>
            </div>

          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by customer, email, destination, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['', 'Pending', 'Contacted', 'Confirmed', 'Cancelled'].map((st) => (
              <button
                key={st || 'All'}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st || 'All Enquiries'}
              </button>
            ))}
          </div>

        </div>

        {/* Enquiries Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-4 px-6">ID &amp; Date</th>
                  <th className="py-4 px-6">Customer Details</th>
                  <th className="py-4 px-6">Destination &amp; Schedule</th>
                  <th className="py-4 px-6">Party &amp; Budget</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-500">
                      <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-2" />
                      <span className="font-semibold text-xs">Loading enquiry records from database...</span>
                    </td>
                  </tr>
                ) : enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-500">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Filter className="w-6 h-6" />
                      </div>
                      <div className="font-bold text-sm text-slate-800">No enquiries found</div>
                      <div className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        No enquiry records matched your search query or filter. Try clearing filters or submit a new enquiry.
                      </div>
                    </td>
                  </tr>
                ) : (
                  enquiries.map((item) => {
                    const badge = STATUS_BADGES[item.status] || STATUS_BADGES.Pending;
                    const dateFormatted = item.travel_date ? item.travel_date.split('T')[0] : 'N/A';
                    const createdFormatted = new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* ID & Submitted */}
                        <td className="py-4 px-6 align-top">
                          <span className="font-black text-slate-900 block">#{item.id}</span>
                          <span className="text-[11px] text-slate-400">{createdFormatted}</span>
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-6 align-top">
                          <div className="font-bold text-slate-900 text-sm">{item.full_name}</div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <a href={`mailto:${item.email}`} className="hover:underline">{item.email}</a>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <a href={`tel:${item.phone}`} className="hover:underline">{item.phone}</a>
                          </div>
                        </td>

                        {/* Destination */}
                        <td className="py-4 px-6 align-top">
                          <div className="font-bold text-brand-800">{item.destination}</div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Travel: {dateFormatted}</span>
                          </div>
                        </td>

                        {/* Travellers & Budget */}
                        <td className="py-4 px-6 align-top">
                          <div className="flex items-center gap-1 text-slate-700 font-semibold">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.travellers} {item.travellers === 1 ? 'Guest' : 'Guests'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-600 text-[11px] mt-1">
                            <DollarSign className="w-3 h-3 text-slate-400" />
                            <span>{item.budget}</span>
                          </div>
                        </td>

                        {/* Status + Quick Changer */}
                        <td className="py-4 px-6 align-top">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border mb-2 shadow-2xs">
                            <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                            <span className={badge.bg}>{item.status}</span>
                          </div>

                          {/* Quick Status Select */}
                          <div>
                            <select
                              value={item.status}
                              onChange={(e) => handleQuickStatusChange(item.id, e.target.value)}
                              className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md px-2 py-0.5 focus:outline-none cursor-pointer"
                            >
                              <option value="Pending">Set Pending</option>
                              <option value="Contacted">Set Contacted</option>
                              <option value="Confirmed">Set Confirmed</option>
                              <option value="Cancelled">Set Cancelled</option>
                            </select>
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-6 align-top text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* View Modal Trigger */}
                            <button
                              onClick={() => setViewModalData(item)}
                              title="View Details"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit Modal Trigger */}
                            <button
                              onClick={() => setEditModalData(item)}
                              title="Edit Enquiry"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-accent-600 hover:bg-accent-50 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete Modal Trigger */}
                            <button
                              onClick={() => setDeleteModalId(item.id)}
                              title="Delete Record"
                              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600">
            <div>
              Showing <span className="text-slate-900 font-bold">{enquiries.length}</span> of{' '}
              <span className="text-slate-900 font-bold">{pagination.total}</span> enquiries
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1 || isLoading}
                onClick={() => fetchEnquiries(pagination.page - 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <span className="px-3 py-1 font-bold text-slate-900 bg-white border border-slate-200 rounded-lg">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                disabled={pagination.page >= pagination.totalPages || isLoading}
                onClick={() => fetchEnquiries(pagination.page + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 1. VIEW ENQUIRY DETAILS MODAL */}
      {/* ========================================================================= */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
                  Enquiry Details &bull; #{viewModalData.id}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  {viewModalData.full_name}
                </h3>
              </div>
              <button
                onClick={() => setViewModalData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-xs text-slate-600">
              
              {/* Quick Status Bar */}
              <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Current Status</span>
                  <span className="text-sm font-bold text-slate-900">{viewModalData.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickStatusChange(viewModalData.id, 'Contacted')}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleQuickStatusChange(viewModalData.id, 'Confirmed')}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Mark Confirmed
                  </button>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block uppercase font-bold">Email Address</span>
                  <a href={`mailto:${viewModalData.email}`} className="text-xs font-bold text-brand-700 hover:underline">
                    {viewModalData.email}
                  </a>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block uppercase font-bold">Contact Phone</span>
                  <a href={`tel:${viewModalData.phone}`} className="text-xs font-bold text-slate-900 hover:underline">
                    {viewModalData.phone}
                  </a>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block uppercase font-bold">Destination</span>
                  <span className="text-xs font-bold text-slate-900">{viewModalData.destination}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block uppercase font-bold">Target Travel Date</span>
                  <span className="text-xs font-bold text-slate-900">
                    {viewModalData.travel_date ? viewModalData.travel_date.split('T')[0] : 'N/A'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block uppercase font-bold">Number of Guests</span>
                  <span className="text-xs font-bold text-slate-900">{viewModalData.travellers} Travellers</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-400 block uppercase font-bold">Budget Tier</span>
                  <span className="text-xs font-bold text-slate-900">{viewModalData.budget}</span>
                </div>
              </div>

              {/* Message Box */}
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-bold mb-1.5">
                  Traveller Special Requirements &amp; Notes
                </span>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed italic">
                  {viewModalData.message ? `"${viewModalData.message}"` : 'No additional notes provided by customer.'}
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-3">
                <span>Created: {new Date(viewModalData.created_at).toLocaleString()}</span>
                <span>Last Updated: {viewModalData.updated_at ? new Date(viewModalData.updated_at).toLocaleString() : 'N/A'}</span>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditModalData(viewModalData);
                  setViewModalData(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Edit Enquiry
              </button>
              <button
                onClick={() => setViewModalData(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EDIT ENQUIRY MODAL */}
      {/* ========================================================================= */}
      {editModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn">
            
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-accent-400 uppercase tracking-wider">
                  Update Record &bull; #{editModalData.id}
                </span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">Edit Tour Enquiry</h3>
              </div>
              <button
                onClick={() => setEditModalData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editModalData.full_name}
                    onChange={(e) => setEditModalData({ ...editModalData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editModalData.email}
                    onChange={(e) => setEditModalData({ ...editModalData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={editModalData.phone}
                    onChange={(e) => setEditModalData({ ...editModalData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={editModalData.destination}
                    onChange={(e) => setEditModalData({ ...editModalData, destination: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Travel Date</label>
                  <input
                    type="date"
                    required
                    value={editModalData.travel_date ? editModalData.travel_date.split('T')[0] : ''}
                    onChange={(e) => setEditModalData({ ...editModalData, travel_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Travellers</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={editModalData.travellers}
                    onChange={(e) => setEditModalData({ ...editModalData, travellers: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Budget</label>
                  <input
                    type="text"
                    required
                    value={editModalData.budget}
                    onChange={(e) => setEditModalData({ ...editModalData, budget: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={editModalData.status}
                    onChange={(e) => setEditModalData({ ...editModalData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Special Requirements</label>
                <textarea
                  rows={3}
                  value={editModalData.message || ''}
                  onChange={(e) => setEditModalData({ ...editModalData, message: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalData(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
                >
                  {modalLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Permanently Delete Enquiry?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to delete enquiry record <span className="font-bold text-slate-800">#{deleteModalId}</span>? 
                This database deletion is permanent and cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalId(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={modalLoading}
                onClick={handleDeleteConfirm}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {modalLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. RECORD MANUAL / OFFLINE ENQUIRY MODAL */}
      {/* ========================================================================= */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn">
            
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Manual Entry</span>
                <h3 className="text-xl font-extrabold text-white mt-0.5">Record Walk-in / Phone Enquiry</h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNewSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                  <input name="full_name" type="text" required placeholder="Guest Name" className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Email *</label>
                  <input name="email" type="email" required placeholder="guest@example.com" className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Phone *</label>
                  <input name="phone" type="text" required placeholder="+1 555-0192" className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Destination *</label>
                  <input name="destination" type="text" required placeholder="e.g. Swiss Alps" className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Travel Date *</label>
                  <input name="travel_date" type="date" required className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Travellers *</label>
                  <input name="travellers" type="number" min="1" defaultValue="2" required className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Budget *</label>
                  <select name="budget" defaultValue="$1,500 - $3,000" className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none">
                    <option value="Economy (Under $1,500)">Economy (Under $1,500)</option>
                    <option value="$1,500 - $3,000">$1,500 - $3,000</option>
                    <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                    <option value="Luxury ($5,000+)">Luxury ($5,000+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Notes / Message</label>
                <textarea name="message" rows={3} placeholder="Notes recorded during customer call..." className="w-full px-3 py-2 border rounded-xl border-slate-200 focus:outline-none resize-none" />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm disabled:opacity-60 cursor-pointer flex items-center gap-1.5"
                >
                  {modalLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Record</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
