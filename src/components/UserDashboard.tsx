import React from 'react';
import { 
  FilePlus, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ArrowRight,
  Wrench,
  Info
} from 'lucide-react';
import { Complaint, UserAccount } from '../types';
import { StatusBadge } from './StatusBadge';

interface UserDashboardProps {
  currentUser: UserAccount;
  complaints: Complaint[];
  setActivePage: (page: string) => void;
}

// UserDashboard component: Home page for the Public / Student / User section
export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  complaints,
  setActivePage,
}) => {
  // Calculate summary counts from the shared complaints array
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Pending').length;
  const assignedCount = complaints.filter(
    (c) => c.status === 'Assigned' || c.status === 'In Progress'
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  // Count how many complaints were submitted by the currently logged-in user
  const myComplaintsCount = complaints.filter(
    (c) => c.userId === currentUser.id || c.userEmail === currentUser.email
  ).length;

  // 4-step workflow items: Report -> Assign -> Track -> Resolve
  const workflowSteps = [
    {
      step: '1. Report',
      title: 'Submit Complaint',
      description: 'Student or staff member submits an online complaint with category, room location, and optional photo.',
    },
    {
      step: '2. Assign',
      title: 'Admin Assigns Staff',
      description: 'Campus Administrator reviews the pending issue and assigns a maintenance technician.',
    },
    {
      step: '3. Track',
      title: 'Track Live Progress',
      description: 'User tracks real-time status transitions from Pending to Assigned and In Progress.',
    },
    {
      step: '4. Resolve',
      title: 'Issue Resolved',
      description: 'Maintenance staff completes the repair work and records the final resolution note.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner with FixMyCampus Logo & Introduction */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-700/60 border border-blue-500/40 text-xs font-semibold text-blue-100">
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span>FixMyCampus • Student & User Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            FixMyCampus
          </h1>

          {/* One-line description of the system */}
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
            A centralized digital platform for reporting campus infrastructure issues, assigning maintenance staff, and tracking repairs from submission to resolution.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActivePage('submit')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>Submit New Complaint</span>
            </button>

            <button
              onClick={() => setActivePage('my-complaints')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold text-sm rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Track My Complaints ({myComplaintsCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards: Total, Pending, Assigned, Resolved */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3">
          FixMyCampus Complaint Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Complaints</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1 tabular-nums">{totalCount}</p>
              <p className="text-xs text-slate-500 mt-1">All campus records</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-amber-200 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800 uppercase">Pending Complaints</p>
              <p className="text-3xl font-extrabold text-amber-700 mt-1 tabular-nums">{pendingCount}</p>
              <p className="text-xs text-slate-500 mt-1">Awaiting staff assignment</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-blue-200 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-800 uppercase">Assigned / Active</p>
              <p className="text-3xl font-extrabold text-blue-700 mt-1 tabular-nums">{assignedCount}</p>
              <p className="text-xs text-slate-500 mt-1">Assigned or In Progress</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white border border-emerald-200 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-800 uppercase">Resolved Complaints</p>
              <p className="text-3xl font-extrabold text-emerald-700 mt-1 tabular-nums">{resolvedCount}</p>
              <p className="text-xs text-slate-500 mt-1">Completed & verified</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* System Workflow Section: Report -> Assign -> Track -> Resolve */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="mb-4">
          <h2 className="text-base font-bold text-slate-900">
            How FixMyCampus Works (System Workflow)
          </h2>
          <p className="text-xs text-slate-500">
            Four-step transparent process from reporting a campus problem to final repair
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
            >
              <span className="text-xs font-bold text-blue-700 uppercase">
                {item.step}
              </span>
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Campus Complaints Preview & Short About Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Campus Complaints</h2>
              <p className="text-xs text-slate-500">Latest maintenance requests reported on FixMyCampus</p>
            </div>
            <button
              onClick={() => setActivePage('my-complaints')}
              className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View My Complaints</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 bg-slate-50">
                  <th className="py-2.5 px-3 font-semibold">ID</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Location</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.slice(0, 5).map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">
                      {complaint.id}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {complaint.category}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{complaint.location}</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={complaint.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Short About the Project Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-base">
              <Info className="w-5 h-5 text-blue-600" />
              <span>About FixMyCampus</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              In many colleges, facility complaints regarding electrical faults, water leaks, cleanliness, and internet issues are reported verbally or in paper registers, leading to delays and zero status visibility.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>FixMyCampus</strong> solves this problem by connecting Students, Administrators, and Maintenance Staff in one structured web portal.
            </p>
          </div>

          <button
            onClick={() => setActivePage('about')}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Read Full Project & Team Details
          </button>
        </div>
      </div>
    </div>
  );
};
