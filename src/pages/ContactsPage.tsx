import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Phone, Star, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/ui/Card';
// Assuming these UI components exist based on instructions
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import type { EmergencyContact } from '../types';

// Mock database functions for demonstration since actual lib/database may not be fully implemented
// In a real app, these would import from '../lib/database'
const mockContacts: EmergencyContact[] = [
  { id: '1', user_id: '1', name: 'Mom', phone: '+1234567890', relationship: 'Parent', is_primary: true, isPrimary: true, created_at: new Date().toISOString() },
  { id: '2', user_id: '1', name: 'John Doe', phone: '+0987654321', relationship: 'Friend', is_primary: false, isPrimary: false, created_at: new Date().toISOString() },
];

const RELATIONSHIP_OPTIONS = ['Parent', 'Sibling', 'Spouse', 'Partner', 'Friend', 'Other'];

export const ContactsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [contacts, setContacts] = useState<EmergencyContact[]>(mockContacts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState(RELATIONSHIP_OPTIONS[0]);
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    // In a real implementation:
    // const fetchContacts = async () => {
    //   const data = await getContacts(user?.id);
    //   setContacts(data);
    // }
    // fetchContacts();
  }, [user]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setRelationship(RELATIONSHIP_OPTIONS[0]);
    setIsPrimary(false);
    setEditingContact(null);
  };

  const handleOpenModal = (contact: EmergencyContact | null = null) => {
    if (contact) {
      setEditingContact(contact);
      setName(contact.name);
      setPhone(contact.phone);
      setRelationship(contact.relationship);
      setIsPrimary(contact.isPrimary ?? contact.is_primary ?? false);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSaveContact = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error('Name and phone are required');
      return;
    }

    const newContact: EmergencyContact = {
      id: editingContact ? editingContact.id : Date.now().toString(),
      user_id: user?.id || 'demo-user',
      name,
      phone,
      relationship,
      is_primary: isPrimary,
      isPrimary: isPrimary,
      created_at: editingContact?.created_at || new Date().toISOString(),
    };

    if (editingContact) {
      setContacts(contacts.map(c => c.id === editingContact.id ? newContact : c));
      toast.success('Contact updated');
    } else {
      setContacts([...contacts, newContact]);
      toast.success('Contact added');
    }

    setIsModalOpen(false);
  };

  const confirmDelete = (id: string) => {
    setContactToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteContact = () => {
    if (contactToDelete) {
      setContacts(contacts.filter(c => c.id !== contactToDelete));
      toast.success('Contact deleted');
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Emergency Contacts</h1>
          <p className="text-slate-400">Manage who gets notified in an emergency.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <Plus size={18} />
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
          <AlertCircle className="mx-auto h-12 w-12 text-slate-500 mb-3" />
          <h3 className="text-lg font-medium text-slate-200">No contacts yet</h3>
          <p className="text-slate-400 mt-1">Add your trusted contacts to keep them informed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => {
            const isPrimaryContact = contact.isPrimary ?? contact.is_primary;
            return (
              <Card 
                key={contact.id} 
                className={`bg-slate-800 border-2 ${isPrimaryContact ? 'border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'border-slate-700'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-100">{contact.name}</h3>
                      {isPrimaryContact && (
                        <span className="flex items-center gap-1 text-xs font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                          <Star size={12} fill="currentColor" /> Primary
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{contact.relationship}</p>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone size={16} className="text-blue-400" />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleOpenModal(contact)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-full transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => confirmDelete(contact.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md shadow-2xl"
          >
            <h2 className="text-xl font-bold text-slate-100 mb-4">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. +1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Relationship</label>
                <select 
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  {RELATIONSHIP_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="isPrimary"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-900"
                />
                <label htmlFor="isPrimary" className="text-sm font-medium text-slate-300">
                  Set as Primary Contact
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveContact}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Save Contact
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-sm shadow-2xl"
          >
            <h2 className="text-xl font-bold text-slate-100 mb-2">Delete Contact?</h2>
            <p className="text-slate-400 mb-6">Are you sure you want to remove this emergency contact? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteContact}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ContactsPage;
