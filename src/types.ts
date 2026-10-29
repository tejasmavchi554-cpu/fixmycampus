// Simple TypeScript definitions for FixMyCampus
// Easy to understand and explain during project viva

export type RoleType = 'user' | 'admin' | 'staff' | null;

export type ComplaintCategory = 'Electrical' | 'Water' | 'Cleanliness' | 'Internet' | 'Other';

export type ComplaintStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Resolved';

export interface HistoryItem {
  status: ComplaintStatus;
  date: string;
  note: string;
  updatedBy: string;
}

export interface StaffMember {
  id: string;
  name: string;
  department: ComplaintCategory;
  phone: string;
  email: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'staff';
  department: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: ComplaintCategory;
  location: string;
  description: string;
  priorityNote: string;
  date: string;
  status: ComplaintStatus;
  assignedStaff: string;
  assignedStaffId: string;
  resolutionNote: string;
  image?: string;
  imageName?: string;
  statusHistory: HistoryItem[];
}
