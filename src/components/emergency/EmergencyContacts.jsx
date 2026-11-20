import React, { useState, useEffect } from 'react';
import { Phone, Plus, Trash2 } from 'lucide-react';

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Animal Helpline India', phone: '1962', type: 'national' },
    { id: '2', name: 'SPCA Emergency', phone: '011-23381162', type: 'rescue' }
  ]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', type: 'vet' });

  useEffect(() => {
    const saved = localStorage.getItem('paltoo_emergency_contacts');
    if (saved) {
      try {
        setContacts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved contacts");
      }
    }
  }, []);

  const saveContacts = (updated) => {
    setContacts(updated);
    localStorage.setItem('paltoo_emergency_contacts', JSON.stringify(updated));
  };

  const addContact = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    
    const updated = [...contacts, { ...newContact, id: Date.now().toString() }];
    saveContacts(updated);
    setNewContact({ name: '', phone: '', type: 'vet' });
    setIsAdding(false);
  };

  const removeContact = (id) => {
    saveContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-[var(--color-text)]">📞 Contacts</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={addContact} className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-3 border border-gray-200 dark:border-gray-700">
          <input 
            type="text" 
            placeholder="Name (e.g. Dr. Smith)" 
            className="input-field text-sm p-2"
            value={newContact.name}
            onChange={e => setNewContact({...newContact, name: e.target.value})}
            required
          />
          <div className="flex gap-2">
            <input 
              type="tel" 
              placeholder="Phone Number" 
              className="input-field text-sm p-2 flex-1"
              value={newContact.phone}
              onChange={e => setNewContact({...newContact, phone: e.target.value})}
              required
            />
            <select 
              className="input-field text-sm p-2 w-28"
              value={newContact.type}
              onChange={e => setNewContact({...newContact, type: e.target.value})}
            >
              <option value="vet">Vet</option>
              <option value="rescue">Rescue</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={() => setIsAdding(false)} className="text-xs px-3 py-1.5 text-gray-500">Cancel</button>
            <button type="submit" className="text-xs px-3 py-1.5 bg-brand-500 text-white rounded-lg font-medium">Save</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {contacts.map(contact => (
          <div key={contact.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="font-semibold text-[var(--color-text)] flex items-center gap-2">
                {contact.name}
                <span className="text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400">
                  {contact.type}
                </span>
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">{contact.phone}</div>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href={`tel:${contact.phone}`}
                className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              {!['1', '2'].includes(contact.id) && (
                <button 
                  onClick={() => removeContact(contact.id)}
                  className="w-8 h-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
