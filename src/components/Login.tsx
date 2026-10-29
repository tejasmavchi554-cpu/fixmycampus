import React, { useState } from 'react';
import { Wrench, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ComplaintCategory, StaffMember, UserAccount } from '../types';
import { staffMembers } from '../data/sampleComplaints';

interface LoginProps {
  loginUser: (user: UserAccount, newStaffMember?: StaffMember) => void;
}

// Single common Login & Register component with a "Who am I?" role selection dropdown
export const Login: React.FC<LoginProps> = ({ loginUser }) => {
  // Toggle between 'login' and 'register' mode inside the single card
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);

  // State for "Who am I?" dropdown ('Student/User' | 'Admin' | 'Maintenance Staff')
  const [selectedRoleOption, setSelectedRoleOption] = useState<string>('Student/User');

  // Common fields for Login & Register
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('rohan.gupta@college.edu');
  const [password, setPassword] = useState<string>('student123');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [staffSpecialty, setStaffSpecialty] = useState<ComplaintCategory>('Electrical');

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Switch between Login and Register tabs
  const switchMode = (registerMode: boolean) => {
    setIsRegisterMode(registerMode);
    setErrorMessage('');
    setSuccessMessage('');

    if (registerMode) {
      // Clear fields for fresh registration
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      // Restore helpful demo credentials for Login mode
      if (selectedRoleOption === 'Student/User') {
        setEmail('rohan.gupta@college.edu');
        setPassword('student123');
      } else if (selectedRoleOption === 'Admin') {
        setEmail('admin@fixmycampus.edu');
        setPassword('admin123');
      } else {
        setEmail('rajesh@fixmycampus.edu');
        setPassword('staff123');
      }
    }
  };

  // Handle "Who am I?" role dropdown change
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setSelectedRoleOption(newRole);
    setErrorMessage('');
    setSuccessMessage('');

    // Pre-fill demo credentials only when in Login mode
    if (!isRegisterMode) {
      if (newRole === 'Student/User') {
        setEmail('rohan.gupta@college.edu');
        setPassword('student123');
      } else if (newRole === 'Admin') {
        setEmail('admin@fixmycampus.edu');
        setPassword('admin123');
      } else if (newRole === 'Maintenance Staff') {
        setEmail('rajesh@fixmycampus.edu');
        setPassword('staff123');
      }
    }
  };

  // Handle single form submission for both Login and Register
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Validation for Register mode
    if (isRegisterMode) {
      if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
        setErrorMessage('Please fill in all fields to register your account.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Password and Confirm Password do not match.');
        return;
      }

      // Register and log in according to the selected "Who am I?" role
      if (selectedRoleOption === 'Student/User') {
        const newStudentId = `STU-${Math.floor(103 + Math.random() * 800)}`;
        loginUser({
          id: newStudentId,
          name: fullName.trim(),
          email: email.trim(),
          role: 'user',
          department: 'Campus Student / User',
        });
      } else if (selectedRoleOption === 'Admin') {
        loginUser({
          id: 'ADM-02',
          name: fullName.trim(),
          email: email.trim(),
          role: 'admin',
          department: 'Campus Administration',
        });
      } else if (selectedRoleOption === 'Maintenance Staff') {
        const newStaffId = `STF-0${staffMembers.length + 1}`;
        const newStaffObj: StaffMember = {
          id: newStaffId,
          name: fullName.trim(),
          department: staffSpecialty,
          phone: '98000 12345',
          email: email.trim(),
        };

        loginUser(
          {
            id: newStaffId,
            name: fullName.trim(),
            email: email.trim(),
            role: 'staff',
            department: `${staffSpecialty} Maintenance Wing`,
          },
          newStaffObj
        );
      }
      return;
    }

    // Validation for Login mode
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both Email and Password to log in.');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Login as Student/User
    if (selectedRoleOption === 'Student/User') {
      const isPriya = trimmedEmail.includes('priya');
      loginUser({
        id: isPriya ? 'STU-102' : 'STU-101',
        name: isPriya ? 'Priya Nair' : 'Rohan Gupta',
        email: email.trim(),
        role: 'user',
        department: 'Campus Student / User',
      });
    }
    // 2. Login as Admin
    else if (selectedRoleOption === 'Admin') {
      loginUser({
        id: 'ADM-01',
        name: 'Campus Estate Admin',
        email: email.trim(),
        role: 'admin',
        department: 'Campus Administration',
      });
    }
    // 3. Login as Maintenance Staff
    else if (selectedRoleOption === 'Maintenance Staff') {
      const matchedStaff =
        staffMembers.find((s) => s.email.toLowerCase() === trimmedEmail) ||
        staffMembers[0];

      loginUser({
        id: matchedStaff.id,
        name: matchedStaff.name,
        email: matchedStaff.email,
        role: 'staff',
        department: `${matchedStaff.department} Maintenance Wing`,
      });
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      {/* Single Clean Blue-and-White Login / Register Container */}
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Top Blue Header */}
        <div className="bg-blue-700 text-white px-6 py-6 text-center space-y-1.5">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mx-auto mb-2">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">FixMyCampus</h1>
          <p className="text-xs text-blue-100">
            {isRegisterMode
              ? 'Create a new campus account'
              : 'Sign in with your campus account to continue'}
          </p>
        </div>

        {/* Login / Register Mode Switch Buttons */}
        <div className="grid grid-cols-2 bg-slate-100 p-1.5 m-6 mb-0 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => switchMode(false)}
            className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              !isRegisterMode
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode(true)}
            className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              isRegisterMode
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Single Unified Form */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* "Who am I?" Role Selection Dropdown */}
          <div>
            <label
              htmlFor="role-select"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Who am I?
            </label>
            <select
              id="role-select"
              value={selectedRoleOption}
              onChange={handleRoleChange}
              className="w-full px-3.5 py-2.5 text-sm font-medium border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              <option value="Student/User">Student/User</option>
              <option value="Admin">Admin</option>
              <option value="Maintenance Staff">Maintenance Staff</option>
            </select>
          </div>

          {/* Full Name Field (Shown in Register Mode) */}
          {isRegisterMode && (
            <div>
              <label
                htmlFor="register-name"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          )}

          {/* Specialty Dropdown (Shown when registering as Maintenance Staff) */}
          {isRegisterMode && selectedRoleOption === 'Maintenance Staff' && (
            <div>
              <label
                htmlFor="staff-specialty"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Maintenance Department
              </label>
              <select
                id="staff-specialty"
                value={staffSpecialty}
                onChange={(e) => setStaffSpecialty(e.target.value as ComplaintCategory)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Electrical">Electrical</option>
                <option value="Water">Water</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Internet">Internet</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          {/* Common Email Field */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your campus email"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Common Password Field */}
          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Confirm Password Field (Shown in Register Mode) */}
          {isRegisterMode && (
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          )}

          {/* Submit Button (Login or Register) */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isRegisterMode ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Toggle Link */}
          <div className="pt-3 border-t border-slate-100 text-center space-y-1">
            {isRegisterMode ? (
              <p className="text-xs text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className="text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  Login here
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                New to FixMyCampus?{' '}
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className="text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  Register an account
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
