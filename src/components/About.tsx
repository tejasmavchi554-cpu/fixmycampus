import React from 'react';
import { 
  GraduationCap, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Users, 
  BookOpen,
  ShieldAlert
} from 'lucide-react';

// About component: Displays project problem statement, objectives, scope, tech stack, and team credits
export const About: React.FC = () => {
  const teamMembers = [
    { name: 'Aman Shafi Malik', role: 'Project Team Member' },
    { name: 'Aditya Ashok Ghongde', role: 'Project Team Member' },
    { name: 'Nitin Bhat', role: 'Project Team Member' },
    { name: 'Vinay Pandita', role: 'Project Team Member' },
  ];

  const actualTechStack = [
    { name: 'HTML', role: 'Webpage structure and semantic forms' },
    { name: 'CSS', role: 'Responsive layout and institutional styling' },
    { name: 'JavaScript', role: 'Client-side validation and interactivity' },
    { name: 'PHP', role: 'Backend server scripting and business logic' },
    { name: 'MySQL', role: 'Relational database for storing complaints and users' },
    { name: 'XAMPP', role: 'Local Apache and MySQL server environment' },
    { name: 'Git / GitHub', role: 'Source code version control and team collaboration' },
    { name: 'VS Code', role: 'Code editor used for development and debugging' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-blue-900 text-white rounded-xl p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200 mb-2">
          <GraduationCap className="w-4 h-4" />
          <span>Academic College Project Documentation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          About FixMyCampus
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
          A complete overview of the problem statement, objectives, scope, technology stack, and project team members.
        </p>
      </div>

      {/* Problem Statement & Project Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Statement */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-red-700 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <h2>Problem Statement</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            In many educational campuses, maintenance complaints regarding electrical items, water supply, cleanliness, and internet connectivity are reported verbally or written in paper notebooks:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            <li>Manual complaints are easily misplaced or forgotten.</li>
            <li>Students have no way to track whether a technician has been assigned.</li>
            <li>Administrators lack a single dashboard to monitor pending repairs.</li>
            <li>There is no proper record of resolved issues and maintenance history.</li>
          </ul>
        </div>

        {/* Project Objectives */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
            <CheckCircle2 className="w-5 h-5" />
            <h2>Project Objectives</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The main objective of <strong>FixMyCampus</strong> is to provide a simple, transparent, and role-based digital complaint management workflow:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            <li>Allow students and staff to submit facility complaints online with an optional photo.</li>
            <li>Automatically assign a unique Complaint ID with initial <strong>Pending</strong> status.</li>
            <li>Enable the Campus Admin to filter complaints and assign maintenance staff.</li>
            <li>Allow maintenance staff to update progress from <strong>Assigned → In Progress → Resolved</strong>.</li>
          </ul>
        </div>
      </div>

      {/* Project Scope & Limitations */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
          <h2>Project Scope & Temporary State Note</h2>
        </div>
        <p className="text-xs text-amber-900 leading-relaxed">
          <strong>Frontend Prototype Note:</strong> This interactive web application is a React frontend prototype built for college presentation and viva demonstration. Complaints and uploaded images are stored in temporary React state (`useState`) inside browser memory so evaluators can test the complete Student, Admin, and Staff workflow immediately without a backend server. <strong>Refreshing the browser page resets the demo data and temporary uploaded images back to the 8 initial sample complaints.</strong>
        </p>
        <div className="text-xs text-slate-700 bg-white p-4 rounded-lg border border-amber-200 space-y-1">
          <p className="font-bold text-slate-900">Scope Boundaries:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Focuses purely on campus complaint registration, staff assignment, and status tracking.</li>
            <li>Does not use IoT hardware sensors, AI chatbots, GIS maps, or automated physical repairs.</li>
          </ul>
        </div>
      </div>

      {/* Technology Stack Used in the Actual Academic Project */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Layers className="w-5 h-5 text-blue-600" />
          <h2>Technology Stack (Actual Academic Project)</h2>
        </div>
        <p className="text-xs text-slate-500">
          In the full academic curriculum implementation, FixMyCampus is designed around the following core web technologies (including MySQL for relational database storage):
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {actualTechStack.map((tech) => (
            <div
              key={tech.name}
              className="p-3.5 rounded-lg bg-slate-50 border border-slate-200"
            >
              <div className="font-bold text-xs text-blue-900">{tech.name}</div>
              <p className="text-xs text-slate-600 mt-1">{tech.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members & Project Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Team Members */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Users className="w-5 h-5 text-blue-600" />
            <h2>Project Team Members</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-100"
              >
                <p className="font-bold text-sm text-slate-900">{member.name}</p>
                <p className="text-xs text-blue-700 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Guide */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h2>Project Guide</h2>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase">
                Faculty Mentor
              </span>
              <p className="text-base font-extrabold text-slate-900 mt-1">
                Mr. Suhas Kotavale
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Project Guide & Faculty Advisor
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            FixMyCampus
          </p>
        </div>
      </div>
    </div>
  );
};
