'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { contactApi, userApi } from '../../../services/api';
import { FiArrowLeft, FiCheck, FiClock, FiEdit2 } from 'react-icons/fi';
import { MdOutlineWarning } from 'react-icons/md';

export default function EditContact({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    added_by: '',
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    try {
      setFetching(true);
      const [contactsData, usersData] = await Promise.all([
        contactApi.getAll(),
        userApi.getAll(),
      ]);
      
      setUsers(usersData.data || []);
      
      const contact = contactsData.find(c => c._id === id);
      if (contact) {
        setFormData({
          full_name: contact.full_name || '',
          phone: contact.phone || '',
          email: contact.email || '',
          added_by: contact.added_by?._id || '',
        });
      } else {
        setError('Contact not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

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
      const submitData = {
        ...formData,
        added_by: formData.added_by || null,
      };
      await contactApi.update(id, submitData);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl text-green-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Edit Contact
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
            <span className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl"><FiEdit2 className="text-green-600" /></span>
            <div>
              <h2 className="text-xl font-semibold text-green-800">Update Contact</h2>
              <p className="text-gray-500 text-sm">Modify the contact details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="full_name"
                placeholder="Enter full name"
                value={formData.full_name}
                onChange={handleChange}
                required
                maxLength={50}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={20}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={50}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Added By</label>
              <select
                name="added_by"
                value={formData.added_by}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                <option value="">Select user (optional)</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
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
                {loading ? <><FiClock className="animate-spin" /> Saving...</> : <><FiCheck /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
