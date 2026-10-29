import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Eye, 
  X, 
  ClipboardList, 
  Clock, 
  UserCheck, 
  Wrench,
  Image as ImageIcon
} from 'lucide-react';
import { Complaint, StaffMember } from '../types';
import { StatusBadge } from './StatusBadge';

interface AdminDashboardProps {
  complaints: Complaint[];
  staffMembers: StaffMember[];
  assignStaff: (complaintId: string, staffId: string) => void;
}

// AdminDashboard component: Role-protected dashboard for Campus Administrator
export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  complaints,
  staffMembers,
  assignStaff,
}) => {
  // Search and Filter states
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  // Confirmation message state after assigning a staff member
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Selected complaint for viewing full details modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  // Calculate summary card statistics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const assignedCount = complaints.filter((c) => c.status === 'Assigned').length;
  const inProgressCount = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  // Filter complaints based on search text, status, category, and submission date
  const filteredComplaints = complaints.filter((item) => {
    const query = searchText.toLowerCase();
    const matchesSearch =
      item.id.toLowerCase().includes(query) ||
      item.userName.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesDate = !dateFilter || item.date === dateFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  // Handle dropdown change when Admin assigns a staff member to a complaint
  const handleStaffSelection = (complaintId: string, staffId: string) => {
    if (!staffId) return;

    assignStaff(complaintId, staffId);

    const chosenStaff = staffMembers.find((s) => s.id === staffId);
    if (chosenStaff) {
      setConfirmationMessage(
        `Complaint ${complaintId} has been assigned to ${chosenStaff.name} (${chosenStaff.department}) and status updated to Assigned.`
      );
      setTimeout(() => {
        setConfirmationMessage('');
      }, 4000);
    }
  };

  // Clear all search and filter inputs
  const clearFilters = () => {
    setSearchText('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setDateFilter('');
  };

  // Get updated selected complaint from state if modal is open
  const activeModalComplaint = selectedComplaint
    ? complaints.find((c) => c.id === selectedComplaint.id) || selectedComplaint
    : null;

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300">
            <ShieldCheck className="w-4 h-4" />
            <span>FixMyCampus • Administrator Portal</span>
          </div>
          <h1 className="text-2xl font-bold">FixMyCampus — Admin Dashboard</h1>
          <p className="text-xs text-slate-300">
            View all campus complaints, filter records, and assign pending issues to maintenance staff.
          </p>
        </div>
      </div>

      {/* Confirmation Message Banner */}
      {confirmationMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{confirmationMessage}</span>
        </div>
      )}

      {/* 5 Summary Cards: Total, Pending, Assigned, In Progress, Resolved */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>TOTAL</span>
            <ClipboardList className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">{totalCount}</p>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span>PENDING</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-700 mt-1 tabular-nums">{pendingCount}</p>
        </div>

        <div className="bg-white border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-800">
            <span>ASSIGNED</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-blue-700 mt-1 tabular-nums">{assignedCount}</p>
        </div>

        <div className="bg-white border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-orange-800">
            <span>IN PROGRESS</span>
            <Wrench className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-extrabold text-orange-700 mt-1 tabular-nums">
            {inProgressCount}
          </p>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-4 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>RESOLVED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">
            {resolvedCount}
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by ID, student name, category, or location..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Categories</option>
              <option value="Electrical">Electrical</option>
              <option value="Water">Water</option>
              <option value="Cleanliness">Cleanliness</option>
              <option value="Internet">Internet</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Submission Date Filter */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {(searchText || statusFilter !== 'All' || categoryFilter !== 'All' || dateFilter) && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg whitespace-nowrap cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* All Complaints Table with Assign Staff Dropdown */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-slate-50">
          <h2 className="text-sm font-bold text-slate-900">
            All Campus Complaints ({filteredComplaints.length})
          </h2>
          <span className="text-xs text-slate-500">
            Use the dropdown in the Assign Staff column to dispatch a technician
          </span>
        </div>

        {filteredComplaints.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-700">
              No complaints match your current filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Show All Complaints
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 bg-slate-50/70">
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Submitted By</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Assigned Staff</th>
                  <th className="py-3 px-4 font-semibold">Assign / Change Staff</th>
                  <th className="py-3 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      <div>{item.id}</div>
                      {item.image && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 font-sans font-semibold">
                          <ImageIcon className="w-3 h-3" /> Photo
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{item.userName}</div>
                      <div className="text-slate-500 font-mono">{item.userId}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs">{item.location}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={
                          item.assignedStaff === 'Not Assigned'
                            ? 'text-amber-700 font-semibold'
                            : 'text-slate-900 font-semibold'
                        }
                      >
                        {item.assignedStaff}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.status === 'Resolved' ? (
                        <span className="text-emerald-700 font-semibold">Completed</span>
                      ) : (
                        <select
                          value={item.assignedStaffId}
                          onChange={(e) => handleStaffSelection(item.id, e.target.value)}
                          className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                        >
                          <option value="">-- Select Staff --</option>
                          {staffMembers.map((staff) => (
                            <option key={staff.id} value={staff.id}>
                              {staff.name} ({staff.department})
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedComplaint(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-blue-100 text-blue-800 rounded-md font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complete Complaint Details Modal */}
      {activeModalComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-blue-900">
                    {activeModalComplaint.id}
                  </span>
                  <StatusBadge status={activeModalComplaint.status} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {activeModalComplaint.category} — {activeModalComplaint.location}
                </h2>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">Student / User Name:</span>
                <strong className="text-slate-900">
                  {activeModalComplaint.userName} ({activeModalComplaint.userId})
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Submission Date:</span>
                <strong className="text-slate-900 font-mono">
                  {activeModalComplaint.date}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Staff:</span>
                <strong className="text-slate-900">
                  {activeModalComplaint.assignedStaff}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Priority Note:</span>
                <strong className="text-slate-900">
                  {activeModalComplaint.priorityNote}
                </strong>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-slate-200">
                <span className="text-slate-500 block">Description:</span>
                <p className="text-slate-800 mt-0.5 leading-relaxed">
                  {activeModalComplaint.description}
                </p>
              </div>

              {/* Uploaded Complaint Image Preview */}
              {activeModalComplaint.image && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-200 space-y-1.5">
                  <span className="text-slate-600 font-bold block">
                    Uploaded Complaint Image ({activeModalComplaint.imageName || 'Photo'}):
                  </span>
                  <img
                    src={activeModalComplaint.image}
                    alt="Uploaded complaint evidence"
                    onClick={() => setFullScreenImage(activeModalComplaint.image || null)}
                    className="max-h-56 rounded-lg border border-slate-300 object-contain bg-white cursor-pointer hover:opacity-90"
                  />
                  <span className="text-[11px] text-blue-700 block">
                    Click the image to view full size
                  </span>
                </div>
              )}

              {activeModalComplaint.resolutionNote && (
                <div className="sm:col-span-2 pt-2 border-t border-emerald-200 bg-emerald-50 p-3 rounded-lg">
                  <span className="text-emerald-800 font-bold block">Resolution Note:</span>
                  <p className="text-emerald-900 mt-0.5">
                    {activeModalComplaint.resolutionNote}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Assign inside Modal */}
            {activeModalComplaint.status !== 'Resolved' && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="font-bold text-blue-950">
                  Assign or Update Maintenance Staff:
                </span>
                <select
                  value={activeModalComplaint.assignedStaffId}
                  onChange={(e) =>
                    handleStaffSelection(activeModalComplaint.id, e.target.value)
                  }
                  className="px-3 py-2 border border-blue-300 rounded-lg bg-white text-slate-900 font-semibold"
                >
                  <option value="">-- Select Staff Member --</option>
                  {staffMembers.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} ({staff.department})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status History */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">
                Status History Log
              </h3>
              <div className="space-y-2">
                {activeModalComplaint.statusHistory.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={item.status} />
                        <span className="font-semibold text-slate-900">
                          {item.updatedBy}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{item.note}</p>
                    </div>
                    <span className="font-mono text-slate-500">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox Modal */}
      {fullScreenImage && (
        <div
          onClick={() => setFullScreenImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setFullScreenImage(null)}
              className="absolute -top-10 right-0 px-3 py-1 bg-white text-slate-900 text-xs font-bold rounded-md cursor-pointer"
            >
              Close Preview
            </button>
            <img
              src={fullScreenImage}
              alt="Full size complaint attachment"
              className="max-h-[85vh] max-w-full rounded-xl border border-white/20 object-contain bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};
