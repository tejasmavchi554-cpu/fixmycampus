import React, { useState } from 'react';
import { ClipboardList, Eye, X, CheckCircle2, FilePlus, Image as ImageIcon } from 'lucide-react';
import { Complaint, UserAccount } from '../types';
import { StatusBadge } from './StatusBadge';

interface MyComplaintsProps {
  currentUser: UserAccount;
  complaints: Complaint[];
  setActivePage: (page: string) => void;
}

// MyComplaints component: Shows only complaints submitted by the logged-in user
export const MyComplaints: React.FC<MyComplaintsProps> = ({
  currentUser,
  complaints,
  setActivePage,
}) => {
  // State to store which complaint is clicked for viewing details & timeline
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // State to enlarge the attached complaint image when clicked
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  // Filter complaints to show only those submitted by the currently logged-in user
  const userComplaints = complaints.filter(
    (item) => item.userId === currentUser.id || item.userEmail === currentUser.email
  );

  // Keep selectedComplaint in sync with latest complaints state
  const activeComplaintDetails = selectedComplaint
    ? complaints.find((c) => c.id === selectedComplaint.id) || selectedComplaint
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              FixMyCampus — My Complaints
            </h1>
            <p className="text-xs text-slate-500">
              Showing complaints submitted by <strong>{currentUser.name}</strong> ({currentUser.id})
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivePage('submit')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <FilePlus className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* User Complaints Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {userComplaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">
              You have not submitted any complaints yet.
            </p>
            <p className="text-xs text-slate-500">
              Click the button below to report a campus maintenance issue.
            </p>
            <button
              onClick={() => setActivePage('submit')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Submit Your First Complaint
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-3 px-4 font-semibold">Complaint ID</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Assigned Staff</th>
                  <th className="py-3 px-4 font-semibold">Photo</th>
                  <th className="py-3 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userComplaints.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedComplaint(item)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{item.location}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                      {item.assignedStaff}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.image ? (
                        <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Attached</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedComplaint(item);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-blue-100 text-blue-800 rounded-md font-semibold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Timeline</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaint Details & Status Timeline Modal */}
      {activeComplaintDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-blue-900">
                    {activeComplaintDetails.id}
                  </span>
                  <StatusBadge status={activeComplaintDetails.status} />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {activeComplaintDetails.category} Issue — {activeComplaintDetails.location}
                </h2>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">Submitted By:</span>
                <strong className="text-slate-900">
                  {activeComplaintDetails.userName} ({activeComplaintDetails.userId})
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Submission Date:</span>
                <strong className="text-slate-900 font-mono">
                  {activeComplaintDetails.date}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Staff Member:</span>
                <strong className="text-slate-900">
                  {activeComplaintDetails.assignedStaff}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Priority Note:</span>
                <strong className="text-slate-900">
                  {activeComplaintDetails.priorityNote}
                </strong>
              </div>
              <div className="sm:col-span-2 pt-1 border-t border-slate-200">
                <span className="text-slate-500 block">Problem Description:</span>
                <p className="text-slate-800 mt-0.5 leading-relaxed">
                  {activeComplaintDetails.description}
                </p>
              </div>

              {/* Uploaded Complaint Image Preview */}
              {activeComplaintDetails.image && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-200 space-y-1.5">
                  <span className="text-slate-600 font-bold block">
                    Uploaded Complaint Image ({activeComplaintDetails.imageName || 'Photo'}):
                  </span>
                  <img
                    src={activeComplaintDetails.image}
                    alt="Uploaded complaint evidence"
                    onClick={() => setFullScreenImage(activeComplaintDetails.image || null)}
                    className="max-h-56 rounded-lg border border-slate-300 object-contain bg-white cursor-pointer hover:opacity-90"
                  />
                  <span className="text-[11px] text-blue-700 block">
                    Click the image to view full size
                  </span>
                </div>
              )}

              {activeComplaintDetails.resolutionNote && (
                <div className="sm:col-span-2 pt-2 border-t border-emerald-200 bg-emerald-50 p-3 rounded-lg">
                  <span className="text-emerald-800 font-bold block">
                    Final Resolution Note:
                  </span>
                  <p className="text-emerald-900 mt-0.5">
                    {activeComplaintDetails.resolutionNote}
                  </p>
                </div>
              )}
            </div>

            {/* Visual Step Progression Bar: Pending -> Assigned -> In Progress -> Resolved */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase mb-2.5">
                Progress Stages (Pending → Resolved)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                {(['Pending', 'Assigned', 'In Progress', 'Resolved'] as const).map(
                  (stage, index) => {
                    const order = ['Pending', 'Assigned', 'In Progress', 'Resolved'];
                    const currentIndex = order.indexOf(activeComplaintDetails.status);
                    const isCompleted = index <= currentIndex;

                    return (
                      <div
                        key={stage}
                        className={`p-2 rounded-lg border font-semibold ${
                          isCompleted
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          <span className="truncate">{stage}</span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Complete Status History Log */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase mb-2.5">
                Complete Status History Timeline
              </h3>
              <div className="space-y-2.5">
                {activeComplaintDetails.statusHistory.map((history, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={history.status} />
                        <span className="font-semibold text-slate-800">
                          Updated by {history.updatedBy}
                        </span>
                      </div>
                      <p className="text-slate-600">{history.note}</p>
                    </div>
                    <span className="font-mono text-slate-500 whitespace-nowrap">
                      {history.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Close Details
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
