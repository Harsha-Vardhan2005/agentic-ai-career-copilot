import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Briefcase } from 'lucide-react';

const initialApplications = [
  {
    id: 1,
    company: 'Google',
    role: 'Software Engineer Intern',
    location: 'Bengaluru',
    appliedDate: 'Jan 2',
    status: 'Applied',
    source: 'Careers Page',
  },
  {
    id: 2,
    company: 'Amazon',
    role: 'SDE Intern',
    location: 'Hyderabad',
    appliedDate: 'Jan 5',
    status: 'Interview',
    source: 'Referral',
  },
  {
    id: 3,
    company: 'Microsoft',
    role: 'Software Engineer',
    location: 'Hyderabad',
    appliedDate: 'Dec 28',
    status: 'Rejected',
    source: 'LinkedIn',
  },
];

const statusColors = {
  Applied: 'bg-blue-100 text-blue-700',
  Interview: 'bg-yellow-100 text-yellow-700',
  Rejected: 'bg-red-100 text-red-700',
  Offer: 'bg-green-100 text-green-700',
};

export default function Applications() {
  const [applications, setApplications] = useState(initialApplications);
  const [showAdd, setShowAdd] = useState(false);
  const [newApp, setNewApp] = useState({
    company: '',
    role: '',
    location: '',
    status: 'Applied',
  });

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Application Tracker
          </h2>
          <p className="text-gray-600 mt-1">
            Track and manage your job applications
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Total" value={stats.total} />
        <Stat label="Applied" value={stats.applied} />
        <Stat label="Interviews" value={stats.interview} />
        <Stat label="Rejected" value={stats.rejected} />
      </div>

      {/* APPLICATION LIST */}
      <div className="space-y-4">
        {applications.map(app => (
          <div
            key={app.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {app.company}
                </h3>
                <p className="text-gray-600 mt-1">{app.role}</p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {app.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {app.appliedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {app.source}
                  </span>
                </div>
              </div>

              <select
                value={app.status}
                onChange={e =>
                  setApplications(prev =>
                    prev.map(a =>
                      a.id === app.id
                        ? { ...a, status: e.target.value }
                        : a
                    )
                  )
                }
                className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[app.status]}`}
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* ADD APPLICATION MODAL */}
      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <h3 className="text-xl font-bold mb-4">Add New Application</h3>

          <input
            placeholder="Company Name"
            className="input"
            onChange={e => setNewApp({ ...newApp, company: e.target.value })}
          />
          <input
            placeholder="Role"
            className="input"
            onChange={e => setNewApp({ ...newApp, role: e.target.value })}
          />
          <input
            placeholder="Location"
            className="input"
            onChange={e => setNewApp({ ...newApp, location: e.target.value })}
          />

          <select
            className="input"
            onChange={e => setNewApp({ ...newApp, status: e.target.value })}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setApplications(prev => [
                  ...prev,
                  {
                    id: Date.now(),
                    ...newApp,
                    appliedDate: 'Today',
                    source: 'Manual',
                  },
                ]);
                setShowAdd(false);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Add
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- SMALL HELPERS ---------- */

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
      {children}
    </div>
  </div>
);
