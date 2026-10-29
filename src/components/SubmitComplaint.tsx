import React, { useState, useRef } from 'react';
import { FilePlus, CheckCircle2, AlertCircle, ArrowRight, ImagePlus, Trash2 } from 'lucide-react';
import { Complaint, ComplaintCategory, UserAccount } from '../types';

interface SubmitComplaintProps {
  currentUser: UserAccount;
  submitComplaint: (newComplaint: Complaint) => void;
  totalComplaintsCount: number;
  setActivePage: (page: string) => void;
}

// SubmitComplaint component: Form for students/users to report a new campus issue with optional image upload
export const SubmitComplaint: React.FC<SubmitComplaintProps> = ({
  currentUser,
  submitComplaint,
  totalComplaintsCount,
  setActivePage,
}) => {
  const [category, setCategory] = useState<ComplaintCategory>('Electrical');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [priorityNote, setPriorityNote] = useState('');

  // States for optional image upload & preview
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageName, setImageName] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Reference to reset the HTML file input element
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Function to validate and preview the selected image file
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate allowed image types (JPG, JPEG, PNG, WEBP)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Invalid file format. Please upload a JPG, JPEG, PNG, or WEBP image.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // 2. Validate maximum file size (5 MB = 5 * 1024 * 1024 bytes)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setErrorMessage('Image file is too large. Maximum allowed size is 5 MB.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Clear any previous error and read the image as a Base64 Data URL for preview & state storage
    setErrorMessage('');
    setImageName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Function to remove the selected image and reset the file input
  const handleRemoveImage = () => {
    setImagePreview('');
    setImageName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to validate and submit a new complaint
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple form validation for required fields
    if (!location.trim() || !description.trim()) {
      setErrorMessage('Please enter both the campus location and complaint description.');
      return;
    }

    setErrorMessage('');

    // Generate a unique complaint ID (for example: CMP-109)
    const nextNumber = 101 + totalComplaintsCount;
    const newId = `CMP-${nextNumber}`;

    // Format today's date
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Create the new complaint object with initial status 'Pending' and optional image
    const newComplaintObject: Complaint = {
      id: newId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      category: category,
      location: location.trim(),
      description: description.trim(),
      priorityNote: priorityNote.trim() || 'Normal - Standard campus maintenance request',
      date: today,
      status: 'Pending',
      assignedStaff: 'Not Assigned',
      assignedStaffId: '',
      resolutionNote: '',
      image: imagePreview || undefined,
      imageName: imageName || undefined,
      statusHistory: [
        {
          status: 'Pending',
          date: `${today} ${currentTime}`,
          note: 'Complaint submitted online by user.',
          updatedBy: currentUser.name,
        },
      ],
    };

    // Save to shared React state in App.tsx
    submitComplaint(newComplaintObject);

    // Clear form fields, reset image preview & file input, and show confirmation message
    setSubmittedId(newId);
    setLocation('');
    setDescription('');
    setPriorityNote('');
    handleRemoveImage();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Heading */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <FilePlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">FixMyCampus — Submit a Complaint</h1>
            <p className="text-xs text-slate-500">
              Reporting as: <strong>{currentUser.name}</strong> ({currentUser.id})
            </p>
          </div>
        </div>
      </div>

      {/* Success Message shown after submitting a complaint */}
      {submittedId && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Complaint Submitted Successfully!</span>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Your complaint has been generated with ID{' '}
            <strong className="font-mono underline">{submittedId}</strong> and its initial status is set to{' '}
            <strong>Pending</strong>.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={() => setActivePage('my-complaints')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <span>Track in My Complaints</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setSubmittedId(null)}
              className="px-4 py-2 bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-lg hover:bg-emerald-100 cursor-pointer"
            >
              Submit Another Issue
            </button>
          </div>
        </div>
      )}

      {/* Validation Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Complaint Form */}
      <form
        onSubmit={handleFormSubmit}
        className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
      >
        {/* 1. Category Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Complaint Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="Electrical">Electrical (Fans, Lights, Switches, Sockets)</option>
            <option value="Water">Water (Coolers, Purifiers, Pipe Leaks, Washrooms)</option>
            <option value="Cleanliness">Cleanliness (Classrooms, Corridors, Dustbins)</option>
            <option value="Internet">Internet (Campus Wi-Fi, LAN Ports, Lab Network)</option>
            <option value="Other">Other (Furniture, Doors, Windows, Carpentry)</option>
          </select>
        </div>

        {/* 2. Building / Room / Campus Location */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Building / Room / Campus Location *
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Main Building, 2nd Floor, Room 204 (Computer Lab)"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* 3. Complaint Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Complaint Description *
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the exact issue clearly so maintenance staff can bring the right tools..."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* 4. Optional Priority Note */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Priority Note (Optional)
          </label>
          <input
            type="text"
            value={priorityNote}
            onChange={(e) => setPriorityNote(e.target.value)}
            placeholder="e.g. High - Practical exam scheduled in this lab tomorrow"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* 5. Upload Image (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Upload Image (Optional)
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Accepted formats: JPG, JPEG, PNG, WEBP (Max size: 5 MB)
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-300 rounded-lg p-1.5 cursor-pointer"
          />

          {/* Show Image Preview & Remove/Change Controls when an image is selected */}
          {imagePreview && (
            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700 truncate max-w-full">
                  Selected: {imageName}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer"
                  >
                    <ImagePlus className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <img
                src={imagePreview}
                alt="Complaint preview"
                className="max-h-48 max-w-full rounded-lg border border-slate-200 object-contain bg-white"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Initial Status will be set to <strong>Pending</strong>
          </span>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            Submit Complaint
          </button>
        </div>
      </form>
    </div>
  );
};
