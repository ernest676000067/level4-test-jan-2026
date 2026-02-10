'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { contactApi, userApi } from '../services/api';
import DeleteModal from '../components/DeleteModal';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { MdOutlineContactPhone, MdOutlineWarning, MdOutlineMailOutline } from 'react-icons/md';

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // 'contact' or 'user'
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [contactsData, usersData] = await Promise.all([
        contactApi.getAll(),
        userApi.getAll(),
      ]);
      setContacts(contactsData);
      setUsers(usersData.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClick = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      if (deleteType === 'contact') {
        await contactApi.delete(itemToDelete._id);
        setContacts(contacts.filter(c => c._id !== itemToDelete._id));
      } else if (deleteType === 'user') {
        await userApi.delete(itemToDelete._id);
        setUsers(users.filter(u => u._id !== itemToDelete._id));
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
      setDeleteType(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
    setDeleteType(null);
  };

  if (loading) {
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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <Link href="/" className="text-green-600 hover:text-green-800 font-medium flex items-center gap-2">
            <FiArrowLeft /> Back to Home
          </Link>
        </div>
      
        <div className="flex gap-4 mb-8">
          <Link href="/dashboard/add-contact">
            <button className="btn-primary cursor-pointer flex items-center gap-2">
              <FiPlus className="text-xl" /> New Contact
            </button>
          </Link>
          <Link href="/dashboard/add-user">
            <button className="btn-outline cursor-pointer flex items-center gap-2">
              <FiPlus className="text-xl" /> New User
            </button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MdOutlineWarning className="text-xl" />
              {error}
            </div>
          </div>
        )}

        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-800 flex items-center gap-3">
            <span className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><MdOutlineContactPhone className="text-xl text-green-600" /></span>
            Contacts List
          </h2>
      
          <div className="overflow-x-auto rounded-xl">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Added by</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <MdOutlineMailOutline className="text-5xl text-gray-400" />
                        <p>No contacts found. Add your first contact!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact, index) => (
                    <tr key={contact._id}>
                      <td className="font-medium text-green-700">{index + 1}</td>
                      <td className="font-semibold">{contact.full_name}</td>
                      <td>{contact.phone || <span className="text-gray-400">-</span>}</td>
                      <td>{contact.email || <span className="text-gray-400">-</span>}</td>
                      <td>
                        {contact.added_by ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                            {contact.added_by.first_name}
                          </span>
                        ) : <span className="text-gray-400">-</span>}
                      </td>
                      <td>
                        <div className="flex gap-3">
                          <Link href={`/dashboard/edit-contact/${contact._id}`}>
                            <button className="text-green-600 hover:text-green-800 font-medium cursor-pointer hover:underline flex items-center gap-1">
                              <FiEdit2 /> Edit
                            </button>
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(contact, 'contact')}
                            className="text-red-500 hover:text-red-700 font-medium cursor-pointer hover:underline flex items-center gap-1"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
}
