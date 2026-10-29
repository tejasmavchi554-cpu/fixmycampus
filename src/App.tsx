import { useState } from 'react';
import { Wrench, Menu, X, MoreVertical, UserCheck, ShieldCheck, GraduationCap, LogIn } from 'lucide-react';
import { Complaint, ComplaintStatus, RoleType, UserAccount } from './types';
import { sampleComplaints, staffMembers, demoUsers } from './data/sampleComplaints';
import { Login } from './components/Login';
import { UserDashboard } from './components/UserDashboard';
import { SubmitComplaint } from './components/SubmitComplaint';
import { MyComplaints } from './components/MyComplaints';
import { AdminDashboard } from './components/AdminDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { About } from './components/About';

export default function App() {
  // 1. Single shared state variable to store all campus complaints
  const [complaints, setComplaints] = useState<Complaint[]>(sampleComplaints);

  // 2. State for maintenance staff members (allows adding newly registered staff)
  const [staffList, setStaffList] = useState(staffMembers);

  // 3. State for current logged-in role ('user' | 'admin' | 'staff' | null)
  const [currentRole, setCurrentRole] = useState<RoleType>('user');

  // 4. State for currently logged-in user details
  const [currentUser, setCurrentUser] = useState<UserAccount>(demoUsers[0]);

  // 5. State for active page inside the current role's navigation
  const [activePage, setActivePage] = useState<string>('home');

  // 6. State for Left Hamburger Menu (Mobile Navigation Tabs) and Right 3-Dots Menu (Quick Switch)
  const [isLeftNavOpen, setIsLeftNavOpen] = useState<boolean>(false);
  const [isRightQuickSwitchOpen, setIsRightQuickSwitchOpen] = useState<boolean>(false);

  // Helper to navigate to a page and close open mobile menus
  const handleNavigate = (page: string) => {
    setActivePage(page);
    setIsLeftNavOpen(false);
    setIsRightQuickSwitchOpen(false);
  };

  // Function to log in or register a user and open the dashboard for their role
  const loginUser = (user: UserAccount, newStaffMember?: typeof staffMembers[0]) => {
    if (newStaffMember) {
      setStaffList((prev) => [...prev, newStaffMember]);
    }
    setCurrentUser(user);
    setCurrentRole(user.role);
    setIsLeftNavOpen(false);
    setIsRightQuickSwitchOpen(false);

    if (user.role === 'user') {
      setActivePage('home');
    } else if (user.role === 'admin') {
      setActivePage('admin-dashboard');
    } else if (user.role === 'staff') {
      setActivePage('staff-dashboard');
    }
  };

  // Function to open the Login / Register page
  const logoutUser = () => {
    setCurrentRole(null);
    setActivePage('login');
    setIsLeftNavOpen(false);
    setIsRightQuickSwitchOpen(false);
  };

  // Function to add a newly submitted complaint to the shared complaints state
  const submitComplaint = (newComplaint: Complaint) => {
    setComplaints([newComplaint, ...complaints]);
  };

  // Function for Admin to assign a maintenance staff member to a complaint
  const assignStaff = (complaintId: string, staffId: string) => {
    const selectedStaff = staffList.find((s) => s.id === staffId);
    if (!selectedStaff) return;

    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedList = complaints.map((item) => {
      if (item.id === complaintId) {
        return {
          ...item,
          status: 'Assigned' as ComplaintStatus,
          assignedStaff: selectedStaff.name,
          assignedStaffId: selectedStaff.id,
          statusHistory: [
            ...item.statusHistory,
            {
              status: 'Assigned' as ComplaintStatus,
              date: `${today} ${currentTime}`,
              note: `Assigned to ${selectedStaff.name} (${selectedStaff.department} Staff).`,
              updatedBy: 'Campus Estate Admin',
            },
          ],
        };
      }
      return item;
    });

    setComplaints(updatedList);
  };

  // Function for Maintenance Staff to update complaint status (Assigned -> In Progress -> Resolved)
  const updateStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    resolutionNote: string,
    staffName: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedList = complaints.map((item) => {
      if (item.id === complaintId) {
        const historyNote =
          resolutionNote || `Status updated to ${newStatus} by maintenance staff.`;

        return {
          ...item,
          status: newStatus,
          resolutionNote:
            newStatus === 'Resolved' ? resolutionNote : item.resolutionNote,
          statusHistory: [
            ...item.statusHistory,
            {
              status: newStatus,
              date: `${today} ${currentTime}`,
              note: historyNote,
              updatedBy: staffName,
            },
          ],
        };
      }
      return item;
    });

    setComplaints(updatedList);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-15 flex items-center justify-between gap-3 relative">
          {/* Left Zone: Mobile 3-Lines Hamburger Button (for Page Tabs) + Brand Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              aria-label="Open Navigation Menu"
              onClick={() => {
                setIsLeftNavOpen(!isLeftNavOpen);
                setIsRightQuickSwitchOpen(false);
              }}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shrink-0"
            >
              {isLeftNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (currentRole === 'user') handleNavigate('home');
                else if (currentRole === 'admin') handleNavigate('admin-dashboard');
                else if (currentRole === 'staff') handleNavigate('staff-dashboard');
                else handleNavigate('login');
              }}
              className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-blue-900 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Wrench className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>FixMyCampus</span>
            </button>
          </div>

          {/* Center Zone: Desktop Navigation Tabs (Hidden on mobile, moved to Left Hamburger Menu) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {currentRole === 'user' && (
              <>
                <button
                  onClick={() => handleNavigate('home')}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    activePage === 'home'
                      ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigate('submit')}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    activePage === 'submit'
                      ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Submit Complaint
                </button>
                <button
                  onClick={() => handleNavigate('my-complaints')}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    activePage === 'my-complaints'
                      ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  My Complaints
                </button>
                <button
                  onClick={() => handleNavigate('about')}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    activePage === 'about'
                      ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  About Project
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => handleNavigate('admin-dashboard')}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    activePage === 'admin-dashboard'
                      ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={() => handleNavigate('about')}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    activePage === 'about'
                      ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  About Project
                </button>
              </>
            )}

            {currentRole === 'staff' && (
              <>
                <button
                  onClick={() => handleNavigate('staff-dashboard')}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    activePage === 'staff-dashboard'
                      ? 'text-emerald-700 font-bold border-b-2 border-emerald-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Staff Dashboard
                </button>
                <button
                  onClick={() => handleNavigate('about')}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    activePage === 'about'
                      ? 'text-emerald-700 font-bold border-b-2 border-emerald-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  About Project
                </button>
              </>
            )}

            {currentRole === null && (
              <>
                <button
                  onClick={() => handleNavigate('login')}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    activePage === 'login'
                      ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  Login / Register
                </button>
                <button
                  onClick={() => handleNavigate('about')}
                  className={`py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    activePage === 'about'
                      ? 'text-blue-700 font-bold border-b-2 border-blue-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  About Project
                </button>
              </>
            )}
          </nav>

          {/* Right Zone: 3-Vertical-Dots Menu Button for Evaluator Quick Switch */}
          <div className="flex items-center gap-2 shrink-0 relative">
            <span className="hidden sm:inline-block text-xs text-slate-500 truncate max-w-[180px]">
              {currentRole === 'user' && `User: ${currentUser.name}`}
              {currentRole === 'admin' && 'Role: Admin'}
              {currentRole === 'staff' && `Staff: ${currentUser.name}`}
              {currentRole === null && 'Guest'}
            </span>

            <button
              type="button"
              aria-label="Evaluator Quick Switch Menu"
              onClick={() => {
                setIsRightQuickSwitchOpen(!isRightQuickSwitchOpen);
                setIsLeftNavOpen(false);
              }}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer flex items-center justify-center"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Right 3-Dots Dropdown: Evaluator Quick Switch Menu */}
            {isRightQuickSwitchOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 space-y-2">
                <div className="pb-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Evaluator Quick Switch
                  </span>
                  <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                    {currentRole === 'user' && `Student: ${currentUser.name}`}
                    {currentRole === 'admin' && 'Campus Estate Admin'}
                    {currentRole === 'staff' && `Staff: ${currentUser.name}`}
                    {currentRole === null && 'Not Logged In'}
                  </p>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => loginUser(demoUsers[0])}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 text-left transition-colors cursor-pointer ${
                      currentRole === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span>1. Student View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => loginUser(demoUsers[2])}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 text-left transition-colors cursor-pointer ${
                      currentRole === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>2. Admin View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => loginUser(demoUsers[3])}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 text-left transition-colors cursor-pointer ${
                      currentRole === 'staff'
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 shrink-0" />
                    <span>3. Staff View</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={logoutUser}
                    className={`w-full px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 text-left transition-colors cursor-pointer ${
                      currentRole === null
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <LogIn className="w-4 h-4 shrink-0" />
                    <span>Login / Register Page</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Left Hamburger Dropdown Drawer (Mobile Navigation Tabs Only) */}
        {isLeftNavOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shadow-md">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1">
              Navigation Tabs
            </div>

            {currentRole === 'user' && (
              <>
                <button
                  onClick={() => handleNavigate('home')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    activePage === 'home'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigate('submit')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    activePage === 'submit'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Submit Complaint
                </button>
                <button
                  onClick={() => handleNavigate('my-complaints')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    activePage === 'my-complaints'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  My Complaints
                </button>
                <button
                  onClick={() => handleNavigate('about')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    activePage === 'about'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  About Project
                </button>
              </>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => handleNavigate('admin-dashboard')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    activePage === 'admin-dashboard'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Admin Dashboard
                </button>
                <button
                  onClick={() => handleNavigate('about')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    activePage === 'about'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  About Project
                </button>
              </>
            )}

            {currentRole === 'staff' && (
              <>
                <button
                  onClick={() => handleNavigate('staff-dashboard')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    activePage === 'staff-dashboard'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Staff Dashboard
                </button>
                <button
                  onClick={() => handleNavigate('about')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    activePage === 'about'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  About Project
                </button>
              </>
            )}

            {currentRole === null && (
              <>
                <button
                  onClick={() => handleNavigate('login')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    activePage === 'login'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Login / Register
                </button>
                <button
                  onClick={() => handleNavigate('about')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    activePage === 'about'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  About Project
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area: Displays ONLY the active role's pages */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-8">
        {/* Login Page */}
        {(currentRole === null || activePage === 'login') && activePage !== 'about' && (
          <Login loginUser={loginUser} />
        )}

        {/* About Project Page (Accessible from any role) */}
        {activePage === 'about' && <About />}

        {/* A. PUBLIC / USER SECTION (Protected to 'user' role) */}
        {currentRole === 'user' && activePage === 'home' && (
          <UserDashboard
            currentUser={currentUser}
            complaints={complaints}
            setActivePage={handleNavigate}
          />
        )}

        {currentRole === 'user' && activePage === 'submit' && (
          <SubmitComplaint
            currentUser={currentUser}
            submitComplaint={submitComplaint}
            totalComplaintsCount={complaints.length}
            setActivePage={handleNavigate}
          />
        )}

        {currentRole === 'user' && activePage === 'my-complaints' && (
          <MyComplaints
            currentUser={currentUser}
            complaints={complaints}
            setActivePage={handleNavigate}
          />
        )}

        {/* B. ADMIN SECTION (Protected to 'admin' role only) */}
        {currentRole === 'admin' && activePage === 'admin-dashboard' && (
          <AdminDashboard
            complaints={complaints}
            staffMembers={staffList}
            assignStaff={assignStaff}
          />
        )}

        {/* C. MAINTENANCE STAFF SECTION (Protected to 'staff' role only) */}
        {currentRole === 'staff' && activePage === 'staff-dashboard' && (
          <StaffDashboard
            currentUser={currentUser}
            complaints={complaints}
            staffMembers={staffList}
            updateStatus={updateStatus}
          />
        )}
      </main>

      {/* Simple Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 px-4 sm:px-6 text-xs text-slate-500 w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            <strong className="text-slate-800">FixMyCampus</strong>
          </div>
          <div>
            Guide: <strong className="text-slate-700">Mr. Suhas Kotavale</strong> • Team: Aman, Aditya, Nitin, Vinay
          </div>
        </div>
      </footer>
    </div>
  );
}
