import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Square,
  CheckSquare,
} from 'lucide-react';

const initialTracks = [
  {
    id: 1,
    title: 'Data Structures & Algorithms',
    level: 'Core',
    description: 'Problem-solving and coding interview fundamentals',
    levels: {
      beginner: [
        { name: 'Arrays', done: false },
        { name: 'Strings', done: false },
        { name: 'Recursion', done: false },
      ],
      intermediate: [
        { name: 'Linked Lists', done: false },
        { name: 'Trees', done: false },
        { name: 'Graphs', done: false },
      ],
      advanced: [
        { name: 'Dynamic Programming', done: false },
        { name: 'Greedy Patterns', done: false },
      ],
    },
    resources: ['Striver DSA Sheet', 'LeetCode', 'GeeksForGeeks'],
  },
  {
    id: 2,
    title: 'Web Development',
    level: 'Specialization',
    description: 'Frontend and backend web technologies',
    levels: {
      beginner: [
        { name: 'HTML', done: false },
        { name: 'CSS', done: false },
        { name: 'JavaScript Basics', done: false },
      ],
      intermediate: [
        { name: 'React', done: false },
        { name: 'REST APIs', done: false },
      ],
      advanced: [
        { name: 'Performance Optimization', done: false },
        { name: 'Security', done: false },
      ],
    },
    resources: ['MDN Docs', 'Frontend Masters', 'freeCodeCamp'],
  },

  {
  id: 3,
  title: 'Databases & SQL',
  level: 'Core',
  description: 'Data storage, queries, and optimization techniques',
  levels: {
    beginner: [
      { name: 'DBMS Basics', done: false },
      { name: 'CRUD Operations', done: false },
      { name: 'Primary & Foreign Keys', done: false },
    ],
    intermediate: [
      { name: 'Joins & Subqueries', done: false },
      { name: 'Indexes', done: false },
      { name: 'Normalization', done: false },
    ],
    advanced: [
      { name: 'Query Optimization', done: false },
      { name: 'Transactions & ACID', done: false },
    ],
  },
  resources: ['SQLZoo', 'PostgreSQL Docs', 'MongoDB University'],
 },

    {
  id: 4,
  title: 'System Design',
  level: 'Advanced',
  description: 'Design scalable, reliable, real-world systems',
  levels: {
    beginner: [
      { name: 'Client-Server Architecture', done: false },
      { name: 'Basic Networking', done: false },
    ],
    intermediate: [
      { name: 'Load Balancing', done: false },
      { name: 'Caching Strategies', done: false },
      { name: 'Database Design', done: false },
    ],
    advanced: [
      { name: 'Scalability Patterns', done: false },
      { name: 'Microservices', done: false },
      { name: 'High Availability', done: false },
    ],
  },
  resources: ['System Design Primer', 'Gaurav Sen (YouTube)'],
},

    {
  id: 5,
  title: 'Cloud & DevOps',
  level: 'Specialization',
  description: 'Deploy, scale, and manage modern applications',
  levels: {
    beginner: [
      { name: 'Cloud Basics (AWS/Azure)', done: false },
      { name: 'Linux Basics', done: false },
    ],
    intermediate: [
      { name: 'Docker', done: false },
      { name: 'CI/CD Pipelines', done: false },
    ],
    advanced: [
      { name: 'Kubernetes', done: false },
      { name: 'Monitoring & Logging', done: false },
    ],
  },
  resources: ['AWS Skill Builder', 'Docker Docs', 'Kubernetes Docs'],
},

    {
  id: 6,
  title: 'Artificial Intelligence & Machine Learning',
  level: 'Specialization',
  description: 'Foundations and practical skills for AI/ML roles',
  levels: {
    beginner: [
      { name: 'Python for ML', done: false },
      { name: 'Linear Algebra Basics', done: false },
      { name: 'Probability & Statistics', done: false },
    ],
    intermediate: [
      { name: 'Supervised Learning', done: false },
      { name: 'Unsupervised Learning', done: false },
      { name: 'Model Evaluation & Metrics', done: false },
    ],
    advanced: [
      { name: 'Neural Networks', done: false },
      { name: 'Deep Learning', done: false },
      { name: 'Model Deployment Basics', done: false },
    ],
  },
  resources: [
    'Andrew Ng – Machine Learning',
    'Kaggle',
    'Scikit-Learn Docs',
    'DeepLearning.AI',
  ],
}

];

export default function LearningPath() {
  const [tracks, setTracks] = useState(initialTracks);
  const [openTrack, setOpenTrack] = useState(null);

  const toggleTopic = (trackId, levelKey, topicIndex) => {
    setTracks(prev =>
      prev.map(track =>
        track.id !== trackId
          ? track
          : {
              ...track,
              levels: {
                ...track.levels,
                [levelKey]: track.levels[levelKey].map((topic, idx) =>
                  idx === topicIndex
                    ? { ...topic, done: !topic.done }
                    : topic
                ),
              },
            }
      )
    );
  };

  const calculateProgress = (track) => {
    const allTopics = Object.values(track.levels).flat();
    const completed = allTopics.filter(t => t.done).length;
    return Math.round((completed / allTopics.length) * 100);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Learning Path</h2>
        <p className="text-gray-600 mt-1">
          Check off topics as you learn — progress updates automatically
        </p>
      </div>

      {tracks.map(track => {
        const progress = calculateProgress(track);

        return (
          <div
            key={track.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {track.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {track.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Level: {track.level}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setOpenTrack(openTrack === track.id ? null : track.id)
                }
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {openTrack === track.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* PROGRESS */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* EXPANDED CONTENT */}
            {openTrack === track.id && (
              <div className="mt-6 space-y-5">
                {Object.entries(track.levels).map(([levelKey, topics]) => (
                  <div key={levelKey}>
                    <h4 className="font-semibold text-gray-800 capitalize mb-2">
                      {levelKey} Level
                    </h4>
                    <div className="space-y-2">
                      {topics.map((topic, idx) => (
                        <button
                          key={topic.name}
                          onClick={() =>
                            toggleTopic(track.id, levelKey, idx)
                          }
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition ${
                            topic.done
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          {topic.done ? (
                            <CheckSquare className="w-5 h-5 text-green-600" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                          <span
                            className={
                              topic.done ? 'line-through font-medium' : ''
                            }
                          >
                            {topic.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <h4 className="font-semibold text-gray-800 mt-4 mb-2">
                    Recommended Resources
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {track.resources.map(res => (
                      <span
                        key={res}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
