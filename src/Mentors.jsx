import React, { useState } from 'react';
import { MapPin, Briefcase, CheckCircle, UserPlus } from 'lucide-react';

const initialConnectedMentors = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Senior Software Engineer',
    organization: 'Microsoft',
    location: 'Bengaluru',
  },
  {
    id: 2,
    name: 'Ananya Iyer',
    role: 'Professor of Computer Science',
    organization: 'IIT Madras',
    location: 'Chennai',
  },
];

const discoverMentorsData = [
  {
    id: 3,
    name: 'Suresh Reddy',
    role: 'Data Scientist',
    organization: 'Amazon',
    location: 'Hyderabad',
  },
  {
    id: 4,
    name: 'Pooja Mehta',
    role: 'Full Stack Developer',
    organization: 'Infosys',
    location: 'Pune',
  },
  {
    id: 5,
    name: 'Arjun Verma',
    role: 'Cloud Engineer',
    organization: 'TCS',
    location: 'Bengaluru',
  },
  {
    id: 6,
    name: 'Neha Kapoor',
    role: 'Product Manager',
    organization: 'Flipkart',
    location: 'Bengaluru',
  },
];

const MentorCard = ({ mentor, connected, onRequest, requestSent }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
          {mentor.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Briefcase className="w-4 h-4" />
            {mentor.role} • {mentor.organization}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4" />
            {mentor.location}
          </p>
        </div>
      </div>

      {connected ? (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Connected
        </span>
      ) : (
        <button
          onClick={onRequest}
          disabled={requestSent}
          className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            requestSent
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          {requestSent ? 'Request Sent' : 'Send Request'}
        </button>
      )}
    </div>
  </div>
);

export default function Mentors() {
  const [showDiscover, setShowDiscover] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);

  const handleSendRequest = (id) => {
    setSentRequests((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-8">
      {/* Connected Mentors */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Your Mentors</h2>
        <p className="text-gray-600 mb-6">Professionals you’re already connected with</p>

        <div className="grid md:grid-cols-2 gap-6">
          {initialConnectedMentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} connected />
          ))}
        </div>
      </div>

      {/* Find Mentors */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Discover New Mentors</h3>
          <p className="text-gray-600 mt-1">Expand your professional network</p>
        </div>
        <button
          onClick={() => setShowDiscover(true)}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
        >
          Find Mentors
        </button>
      </div>

      {showDiscover && (
        <div className="grid md:grid-cols-2 gap-6">
          {discoverMentorsData.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              connected={false}
              requestSent={sentRequests.includes(mentor.id)}
              onRequest={() => handleSendRequest(mentor.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
