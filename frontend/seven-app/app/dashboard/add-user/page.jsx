'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '../../services/api';
import { FiArrowLeft, FiCheck, FiClock } from 'react-icons/fi';
import { MdOutlineWarning } from 'react-icons/md';
import { HiOutlineUserCircle } from 'react-icons/hi';

export default function AddUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    category: 'user',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await userApi.create(formData);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Add User
          </h1>
          <a href="/dashboard" className="text-green-600 hover:text-green-800 font-medium flex items-center gap-2">
            <FiArrowLeft /> Back to Dashboard
          </a>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MdOutlineWarning className="text-xl" />
              {error}
            </div>
          </div>
        )}

        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl"><HiOutlineUserCircle className="text-green-600" /></span>
            <div>
              <h2 className="text-xl font-semibold text-green-800">New User</h2>
              <p className="text-gray-500 text-sm">Fill in the user details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name </label>
              <input
                type="text"
                name="first_name"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={handleChange}
                required
                maxLength={150}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name </label>
              <input
                type="text"
                name="last_name"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={handleChange}
                required
                maxLength={150}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <a href="/dashboard">
                <button type="button" className="btn-outline cursor-pointer">
                  Cancel
                </button>
              </a>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <><FiClock className="animate-spin" /> Creating...</> : <><FiCheck /> Create User</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
