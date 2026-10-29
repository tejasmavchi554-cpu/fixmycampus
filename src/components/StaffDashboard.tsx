import React, { useState } from 'react';
import { Wrench, CheckCircle2, Clock, Phone, Image as ImageIcon } from 'lucide-react';
import { Complaint, ComplaintStatus, StaffMember, UserAccount } from '../types';
import { StatusBadge } from './StatusBadge';

interface StaffDashboardProps {
  currentUser: UserAccount;
  complaints: Complaint[];
  staffMembers: StaffMember[];
  updateStatus: (
    complaintId: string,
    newStatus: ComplaintStatus,
    resolutionNote: string,
    staffName: string
  ) => void;
}

// StaffDashboard component: Separate dashboard for Maintenance Staff members
export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentUser,
  complaints,
  staffMembers,
  updateStatus,
}) => {
  // Determine which staff member is logged in (or allow switching for demo purposes)
  const initialStaffId =
    staffMembers.find((s) => s.id === currentUser.id)?.id || staffMembers[0].id;

  const [selectedStaffId, setSelectedStaffId] = useState(initialStaffId);

  // State to track resolution notes entered for each complaint ID
  const [notesByComplaint, setNotesByComplaint] = useState<{ [key: string]: string }>({});

  // Confirmation message state
  const [confirmationMsg, setConfirmationMsg] = useState('');

  // State to view full screen uploaded image
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  // Get full details of the currently selected staff member
  const currentStaff =
    staffMembers.find((s) => s.id === selectedStaffId) || staffMembers[0];

  // Filter complaints to show ONLY those assigned to this maintenance staff member
  const myAssignedComplaints = complaints.filter(
    (item) =>
      item.assignedStaffId === currentStaff.id ||
      item.assignedStaff === currentStaff.name
  );

  // Separate active work (Assigned / In Progress) and completed work (Resolved)
  const activeWorkList = myAssignedComplaints.filter((c) => c.status !== 'Resolved');
  const completedWorkList = myAssignedComplaints.filter((c) => c.status === 'Resolved');

  // Function to handle status update (Assigned -> In Progress -> Resolved)
  const handleStatusUpdate = (complaint: Complaint, newStatus: ComplaintStatus) => {
    const noteText = (notesByComplaint[complaint.id] || '').trim();

    if (newStatus === 'Resolved' && !noteText) {
      updateStatus(
        complaint.id,
        'Resolved',
        'Maintenance repair work completed and tested by technician.',
        currentStaff.name
      );
    } else {
      updateStatus(complaint.id, newStatus, noteText, currentStaff.name);
    }

    setConfirmationMsg(
      `Complaint ${complaint.id} status updated to "${newStatus}" by ${currentStaff.name}.`
    );
    setTimeout(() => {
      setConfirmationMsg('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Staff Portal Header */}
      <div className="bg-emerald-900 text-white rounded-xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200">
            <Wrench className="w-4 h-4 shrink-0" />
            <span>FixMyCampus • Maintenance Staff Portal</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold break-words">
            FixMyCampus — {currentStaff.name} ({currentStaff.department} Wing)
          </h1>
          <p className="text-xs text-emerald-100 flex flex-wrap items-center gap-2 sm:gap-3">
            <span>Staff ID: {currentStaff.id}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> {currentStaff.phone}
            </span>
          </p>
        </div>

        {/* Staff Selector for Demo Evaluation */}
        <div className="bg-emerald-950/70 border border-emerald-700 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-semibold text-emerald-200 whitespace-nowrap">
            Switch Staff Member:
          </label>
          <select
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 text-xs font-bold bg-white text-slate-900 rounded-lg focus:outline-none cursor-pointer"
          >
            {staffMembers.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name} ({staff.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Confirmation Banner */}
      {confirmationMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{confirmationMsg}</span>
        </div>
      )}

      {/* Staff Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Total Assigned to Me
          </span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">
            {myAssignedComplaints.length}
          </p>
        </div>

        <div className="bg-white border border-orange-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-orange-800 uppercase">
            Pending / In Progress Work
          </span>
          <p className="text-2xl font-extrabold text-orange-700 mt-1 tabular-nums">
            {activeWorkList.length}
          </p>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-4">
          <span className="text-xs font-semibold text-emerald-800 uppercase">
            Completed / Resolved Work
          </span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1 tabular-nums">
            {completedWorkList.length}
          </p>
        </div>
      </div>

      {/* SECTION 1: Active & Pending Assigned Work */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span>Active Assigned Complaints ({activeWorkList.length})</span>
          </h2>
          <span className="text-xs text-slate-500">
            Allowed progression: Assigned → In Progress → Resolved
          </span>
        </div>

        {activeWorkList.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-sm font-semibold text-slate-700">
              No active pending work orders for {currentStaff.name}.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              New complaints assigned by the Admin will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeWorkList.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-blue-900">
                      {item.id}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-blue-700 uppercase">
                      {item.category} Issue
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {item.location}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Display Uploaded Complaint Image if available */}
                  {item.image && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>Attached Photo (Click to enlarge):</span>
                      </span>
                      <img
                        src={item.image}
                        alt="Complaint attachment"
                        onClick={() => setFullScreenImage(item.image || null)}
                        className="max-h-40 rounded border border-slate-200 object-contain bg-white cursor-pointer hover:opacity-90"
                      />
                    </div>
                  )}

                  <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <strong>Reported by:</strong> {item.userName} ({item.date})
                    </div>
                    <div>
                      <strong>Priority Note:</strong> {item.priorityNote}
                    </div>
                  </div>
                </div>

                {/* Status Progression Controls & Resolution Note Input */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Resolution / Work Note (Required when marking Resolved):
                    </label>
                    <input
                      type="text"
                      value={notesByComplaint[item.id] || ''}
                      onChange={(e) =>
                        setNotesByComplaint({
                          ...notesByComplaint,
                          [item.id]: e.target.value,
                        })
                      }
                      placeholder="e.g. Replaced faulty switch and tested connections"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-700">
                      Update Status:
                    </label>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusUpdate(item, e.target.value as ComplaintStatus)
                      }
                      className="px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                    >
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Completed / Resolved Work */}
      <div className="space-y-4 pt-2">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Completed Work History ({completedWorkList.length})</span>
        </h2>

        {completedWorkList.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500">
            No resolved complaints recorded for {currentStaff.name} yet.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="py-3 px-4 font-semibold">ID</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Location</th>
                    <th className="py-3 px-4 font-semibold">Resolution Note</th>
                    <th className="py-3 px-4 font-semibold">Photo</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedWorkList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{item.location}</td>
                      <td className="py-3 px-4 text-emerald-800 font-medium">
                        {item.resolutionNote || 'Completed'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {item.image ? (
                          <button
                            type="button"
                            onClick={() => setFullScreenImage(item.image || null)}
                            className="text-blue-700 font-semibold hover:underline cursor-pointer"
                          >
                            View Photo
                          </button>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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
