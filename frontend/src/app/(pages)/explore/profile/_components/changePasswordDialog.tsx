// ./_components/changePasswordDialog.tsx
'use client'

import React, { useState } from "react"; // Import React
import { Bounce, toast } from "react-toastify";
import { Loader2 } from 'lucide-react';

// BARU: Definisikan type untuk props
interface ChangePasswordDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSave: (passwordData: { currentPassword: string; newPassword: string }) => Promise<void>; // Handler async
}

// BARU: Gunakan React.FC dan type props
const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ isOpen, setIsOpen, onSave }) => {
  // BARU: Type annotations untuk state
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsLoading(false);
    setIsOpen(false);
  }

  // BARU: Type annotation untuk event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required.', { transition: Bounce });
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.', { transition: Bounce });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.', { transition: Bounce });
      return;
    }

    setIsLoading(true);
    try {
      await onSave({ currentPassword, newPassword });
      // handleClose() akan dipanggil dari ProfilePage jika sukses
    } catch (error) {
      console.error(error);
      // Error toast sudah ada di ProfilePage
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    // Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-lg w-11/12 md:w-1/3 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        {/* Form Ganti Password */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)} // Type event otomatis dikenali
                disabled={isLoading}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
            >
              {isLoading && <Loader2 className="animate-spin mr-2" size={20} />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// BARU: Export default untuk komponen
export default ChangePasswordDialog;