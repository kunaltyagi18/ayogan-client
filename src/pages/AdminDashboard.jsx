import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Edit3, ExternalLink, Mail, Plus, Trash2, Users } from 'lucide-react';
import { eventAPI, contactAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [events, setEvents] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const { data } = await eventAPI.getManagedEvents({ limit: 50 });
      setEvents(data.events || []);
      if (user?.role === 'admin') {
        const contactsResponse = await contactAPI.getAll({ limit: 10 });
        setContacts(contactsResponse.data.contacts || []);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete “${event.title}”? This also removes registrations and feedback.`)) return;
    try {
      await eventAPI.deleteEvent(event._id);
      setEvents((current) => current.filter((item) => item._id !== event._id));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete event.');
    }
  };

  const updateContact = async (contact, status) => {
    try {
      const { data } = await contactAPI.updateStatus(contact._id, { status });
      setContacts((current) => current.map((item) => item._id === contact._id ? data.contact : item));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update contact.');
    }
  };

  return (
    <section className={`min-h-screen px-4 py-10 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Management</p><h1 className="mt-2 text-3xl font-bold">Welcome, {user?.firstName}</h1><p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Manage your events and keep campus activity organized.</p></div>
          <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"><Plus size={18} /> Create event</Link>
        </div>

        {message && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{message}</div>}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className={`rounded-2xl p-5 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}><CalendarDays className="mb-3 text-blue-600" /><p className="text-2xl font-bold">{events.length}</p><p className="text-sm opacity-70">Managed events</p></div>
          <div className={`rounded-2xl p-5 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}><Users className="mb-3 text-emerald-600" /><p className="text-2xl font-bold">{events.reduce((total, event) => total + (event.attendees || 0), 0)}</p><p className="text-sm opacity-70">Registered attendees</p></div>
          {user?.role === 'admin' && <div className={`rounded-2xl p-5 shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}><Mail className="mb-3 text-amber-600" /><p className="text-2xl font-bold">{contacts.filter((contact) => contact.status === 'pending').length}</p><p className="text-sm opacity-70">Pending messages</p></div>}
        </div>

        <div className={`overflow-hidden rounded-2xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700"><h2 className="text-xl font-bold">Your events</h2></div>
          {loading ? <p className="p-6 opacity-70">Loading management data…</p> : events.length === 0 ? <p className="p-6 opacity-70">No events yet. Create your first event to get started.</p> : <div className="divide-y divide-gray-200 dark:divide-gray-700">{events.map((event) => <div key={event._id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"><div className="flex min-w-0 items-center gap-4"><img src={event.image} alt="" className="h-16 w-20 rounded-lg object-cover" /><div className="min-w-0"><h3 className="truncate font-semibold">{event.title}</h3><p className="text-sm opacity-70">{event.category} · {new Date(event.date).toLocaleDateString()} · {event.attendees || 0}/{event.maxAttendees} attendees</p></div></div><div className="flex flex-wrap gap-2"><Link aria-label={`Edit ${event.title}`} to={`/register?edit=${encodeURIComponent(event._id)}`} className="inline-flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50"><Edit3 size={15} /> Edit</Link><Link aria-label={`View ${event.title}`} to="/events" className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"><ExternalLink size={15} /> View</Link><button type="button" onClick={() => handleDelete(event)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"><Trash2 size={15} /> Delete</button></div></div>)}</div>}
        </div>

        {user?.role === 'admin' && <div className={`mt-8 overflow-hidden rounded-2xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}><div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700"><h2 className="text-xl font-bold">Recent contact messages</h2></div>{contacts.length === 0 ? <p className="p-6 opacity-70">No messages found.</p> : <div className="divide-y divide-gray-200 dark:divide-gray-700">{contacts.map((contact) => <div key={contact._id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold">{contact.name} <span className="font-normal opacity-60">· {contact.email}</span></p><p className="mt-1 text-sm opacity-70">{contact.subject || 'General enquiry'} · {contact.status}</p></div>{contact.status !== 'replied' && <button type="button" onClick={() => updateContact(contact, 'read')} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold dark:border-gray-600">Mark as read</button>}</div>)}</div>}</div>}
      </div>
    </section>
  );
}
