import React, { useState, createContext, useContext, useEffect } from 'react';
import { User, Target, TrendingUp, Users, BookOpen, Briefcase, Award, Calendar, CheckCircle, XCircle, Clock, ArrowRight, LogOut, Menu, X, Upload, Sparkles, Plus, Search, Bell, ChevronRight, Activity, Zap, BookMarked, MessageSquare, ThumbsUp, TrendingDown, BarChart3, FileText, Brain, Rocket, Star } from 'lucide-react';

import { auth, signInWithGoogle, signUpWithEmail, signInWithEmail } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { generateCareerRoadmap, analyzeResume, getAIRecommendations } from './aiService';
import { extractTextFromPDF } from './pdfParser';
import { extractTextWithOCR } from './ocr';
import Mentors from './Mentors';
import LearningPath from './LearningPath';
import Applications from './Applications';



// ==========================================
// CONTEXT & STATE MANAGEMENT
// ==========================================

const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ==========================================
// AUTH COMPONENT
// ==========================================

const AuthPage = ({ onAuthSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

// auth | onboarding | dashboard


const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  // Basic validation
  if (!email || !password) {
    setError('Please fill all required fields.');
    return;
  }

  if (isSignup) {
    if (!name) {
      setError('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  }

  setLoading(true);

  try {
    let userCredential;

    if (isSignup) {
      userCredential = await signUpWithEmail(email, password);
    } else {
      userCredential = await signInWithEmail(email, password);
    }

    const user = userCredential.user;

    // ✅ Pass user data to parent
    onAuthSuccess({
      uid: user.uid,
      name: user.displayName || name || email.split('@')[0],
      email: user.email,
      photo: user.photoURL || null,
    });
  } catch (error) {
    console.error('Auth error:', error);
    setError(mapFirebaseError(error.code));
  } finally {
    setLoading(false);
  }
};

  function mapFirebaseError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    default:
      return 'Authentication failed. Please try again.';
  }
}



  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      onAuthSuccess({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      });
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Career Copilot
          </h1>
          <p className="text-gray-600 mt-2">Your AI-powered career companion</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Ex:- Charuhas"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : (isSignup ? 'Create Account' : 'Sign In')}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

// ==========================================
// ONBOARDING COMPONENT
// ==========================================

const Onboarding = ({ userName, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    degree: '',
    year: '',
    college: '',
    careerRole: '',
    skills: [],
    interests: [],
    experienceLevel: '',
    hasProjects: null,
    hasInternships: null,
    certifications: '',
    careerGoal: ''
  });

  const degrees = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'MBA', 'B.Sc', 'M.Sc', 'BE', 'ME'];
  const years = ['1st Year', '2nd Year', '3rd Year', 'Final Year', 'Recent Graduate', 'Working Professional'];
  const roles = [
    'Software Engineer', 'Data Scientist', 'ML Engineer', 'Cloud Engineer', 
    'DevOps Engineer', 'Full Stack Developer', 'Frontend Developer', 
    'Backend Developer', 'Product Manager', 'Research Analyst'
  ];
  const skillOptions = [
    'Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js', 
    'AI/ML', 'Cloud (AWS/Azure)', 'Docker', 'Kubernetes', 
    'SQL', 'MongoDB', 'System Design', 'Data Structures'
  ];
  const interestOptions = [
    'Web Development', 'Mobile Apps', 'Machine Learning', 'Data Science',
    'Cloud Computing', 'Cybersecurity', 'Blockchain', 'IoT',
    'Game Development', 'AR/VR', 'Competitive Programming', 'Open Source'
  ];
  const experienceLevels = [
    { id: 'beginner', label: 'Beginner', desc: 'Just starting out' },
    { id: 'intermediate', label: 'Intermediate', desc: '1-2 years experience' },
    { id: 'advanced', label: 'Advanced', desc: '3+ years experience' }
  ];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const canProceed = () => {
    if (step === 1) return formData.degree && formData.year && formData.college;
    if (step === 2) return formData.careerRole && formData.careerGoal;
    if (step === 3) return formData.skills.length > 0 && formData.interests.length > 0;
    if (step === 4) return formData.experienceLevel && formData.hasProjects !== null && formData.hasInternships !== null;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Welcome, {userName}! 👋</h2>
              <p className="text-gray-600 mt-1">Let's build your career profile</p>
            </div>
            <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
              Step {step} of 4
            </span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i <= step ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Education Background
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Degree *</label>
              <select
                value={formData.degree}
                onChange={(e) => updateField('degree', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="">Select your degree</option>
                {degrees.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Year / Status *</label>
              <select
                value={formData.year}
                onChange={(e) => updateField('year', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                <option value="">Select your year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">College / University *</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => updateField('college', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="e.g., IIT Delhi, NIT Trichy..."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-600" />
              Career Goals
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Target Role *</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => updateField('careerRole', role)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.careerRole === role
                        ? 'border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{role}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Career Goal *</label>
              <textarea
                value={formData.careerGoal}
                onChange={(e) => updateField('careerGoal', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                rows="4"
                placeholder="e.g., I want to become a senior software engineer at a top tech company within 3 years..."
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Zap className="w-6 h-6 text-indigo-600" />
              Skills & Interests
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Your Skills * (Select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleItem('skills', skill)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.skills.includes(skill)
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Your Interests * (Select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleItem('interests', interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.interests.includes(interest)
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Experience Level
            </h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Your Experience Level *</label>
              <div className="grid gap-3">
                {experienceLevels.map(level => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => updateField('experienceLevel', level.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.experienceLevel === level.id
                        ? 'border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{level.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Have you done projects? *</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateField('hasProjects', true)}
                    className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all ${
                      formData.hasProjects === true ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('hasProjects', false)}
                    className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all ${
                      formData.hasProjects === false ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Any internships? *</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateField('hasInternships', true)}
                    className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all ${
                      formData.hasInternships === true ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('hasInternships', false)}
                    className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all ${
                      formData.hasInternships === false ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Certifications (Optional)</label>
              <textarea
                value={formData.certifications}
                onChange={(e) => updateField('certifications', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                rows="3"
                placeholder="e.g., AWS Certified, Google Cloud Professional, Coursera ML Specialization..."
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (step < 4) setStep(step + 1);
              else onComplete(formData);
            }}
            disabled={!canProceed()}
            className={`px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2 ${
              step === 1 ? 'ml-auto' : ''
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {step === 4 ? (
              <>
                Complete Setup
                <CheckCircle className="w-5 h-5" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// DASHBOARD COMPONENTS
// ==========================================

const StatCard = ({ icon: Icon, label, value, change, color, bgColor }) => (
  <div className={`${bgColor} rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {change && (
        <span className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
          {change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </span>
      )}
    </div>
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ icon: Icon, title, description, time, color }) => (
  <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1">
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <p className="text-xs text-gray-500 mt-2">{time}</p>
    </div>
  </div>
);

  const formatResumeAnalysis = (text) => {
    const sections = text.split(/(?=📊|💪|⚠️|🎯|🤖|✍️|🎓|📝)/);
    
    return sections.map((section, idx) => {
      if (!section.trim()) return null;
      
      const lines = section.trim().split('\n');
      const title = lines[0];
      const content = lines.slice(1).join('\n').trim();
      
      // Color schemes for different sections
      const colorSchemes = {
        '📊': { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700' },
        '💪': { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700' },
        '⚠️': { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700' },
        '🎯': { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700' },
        '🤖': { bg: 'bg-indigo-50', border: 'border-indigo-500', text: 'text-indigo-700' },
        '✍️': { bg: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-700' },
        '🎓': { bg: 'bg-cyan-50', border: 'border-cyan-500', text: 'text-cyan-700' },
        '📝': { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-700' },
      };
      
      const emoji = title.match(/📊|💪|⚠️|🎯|🤖|✍️|🎓|📝/)?.[0] || '📊';
      const colors = colorSchemes[emoji] || colorSchemes['📊'];
      
      return (
        <div key={idx} className={`mb-6 rounded-xl border-l-4 ${colors.border} ${colors.bg} p-6 shadow-sm hover:shadow-md transition`}>
          <div className={`text-xl font-bold ${colors.text} mb-4 flex items-center gap-2`}>
            <span className="text-2xl">{emoji}</span>
            <span>{title.replace(emoji, '').trim()}</span>
          </div>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
            {content}
          </div>
        </div>
      );
    });
  };

const Dashboard = () => {
  const { user, profileData, view, setView, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const handleGenerateRoadmap = async () => {
    setRoadmapLoading(true);
    try {
      const roadmap = await generateCareerRoadmap(profileData);
      setRoadmapData(roadmap);
    } catch (error) {
      alert('Error generating roadmap. Please try again.');
      console.error(error);
    } finally {
      setRoadmapLoading(false);
    }
};

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setResumeLoading(true);

    try {
      let text = '';

      if (file.type === 'application/pdf') {
        // 1️⃣ Try normal PDF extraction
        text = await extractTextFromPDF(file);

        // 2️⃣ If text is too small → OCR fallback
        if (!text || text.length < 200) {
          console.warn('PDF text too small, running OCR...');
          text = await extractTextWithOCR(file);
        }

      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        text = await file.text();
      } else {
        throw new Error('Unsupported file type. Upload PDF or TXT.');
      }

      text = text.replace(/\s+/g, ' ').trim();

      if (text.length < 200) {
        throw new Error('Could not extract enough resume text.');
      }

      const analysis = await analyzeResume(text, profileData);
      setResumeAnalysis(analysis);

    } catch (error) {
      alert(error.message || 'Error analyzing resume.');
      setResumeFile(null);
    } finally {
      setResumeLoading(false);
    }
  };


  const navItems = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'roadmap', label: 'Career Roadmap', icon: TrendingUp },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'mentors', label: 'Mentors', icon: Users },
    { id: 'learning', label: 'Learning Path', icon: BookMarked },
    { id: 'resume', label: 'Resume AI', icon: FileText },
  ];

  const recentActivities = [
    { icon: CheckCircle, title: 'Application Submitted', description: 'Applied to Google - Software Engineer Intern', time: '2 hours ago', color: 'bg-green-500' },
    { icon: Users, title: 'New Mentor Match', description: 'Connected with Priya Sharma from Microsoft', time: '5 hours ago', color: 'bg-purple-500' },
    { icon: Brain, title: 'Skill Updated', description: 'Completed React Advanced course', time: '1 day ago', color: 'bg-blue-500' },
    { icon: MessageSquare, title: 'Mentor Feedback', description: 'Received advice on system design preparation', time: '2 days ago', color: 'bg-indigo-500' },
  ];

  const [upcomingTasks, setUpcomingTasks] = useState([
    { id: 1, task: 'Complete LeetCode DSA module', deadline: 'Today', priority: 'high', completed: false },
    { id: 2, task: 'Apply to Amazon internship', deadline: 'Tomorrow', priority: 'high', completed: false },
    { id: 3, task: 'Schedule mock interview', deadline: 'Jan 5', priority: 'medium', completed: false },
    { id: 4, task: 'Update portfolio website', deadline: 'Jan 8', priority: 'medium', completed: false },
  ]);

  const toggleTaskCompletion = (id) => {
  setUpcomingTasks(prev =>
    prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    )
  );
};

    const [showAddTask, setShowAddTask] = useState(false);
        const [newTask, setNewTask] = useState({
          task: '',
          deadline: '',
          priority: 'medium',
  });



  const recommendations = [
    { icon: Briefcase, title: 'New Job Opening', description: 'Microsoft is hiring SDE Interns - 95% match', action: 'Apply Now' },
    { icon: Users, title: 'Mentor Suggestion', description: 'Rahul Mehta can help with ML preparation', action: 'Connect' },
    { icon: BookOpen, title: 'Learning Path', description: 'Complete System Design fundamentals', action: 'Start' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Career Copilot
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {user.name.charAt(0)}
                </div>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out mt-16 lg:mt-0 shadow-xl lg:shadow-none`}>
          <nav className="p-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  view === item.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {view === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Welcome back, {user.name.split(' ')[0]}! 👋
                    </h2>
                    <p className="text-gray-600 mt-1">Here's what's happening with your career journey</p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Insights
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard 
                    icon={Briefcase} 
                    label="Applications" 
                    value="12" 
                    change={8}
                    color="bg-blue-500" 
                    bgColor="bg-blue-50"
                  />
                  <StatCard 
                    icon={CheckCircle} 
                    label="Interviews" 
                    value="3" 
                    change={50}
                    color="bg-green-500" 
                    bgColor="bg-green-50"
                  />
                  <StatCard 
                    icon={Users} 
                    label="Mentors" 
                    value="2" 
                    change={0}
                    color="bg-purple-500" 
                    bgColor="bg-purple-50"
                  />
                  <StatCard 
                    icon={TrendingUp} 
                    label="Profile Score" 
                    value="85%" 
                    change={5}
                    color="bg-indigo-500" 
                    bgColor="bg-indigo-50"
                  />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <Activity className="w-5 h-5 text-indigo-600" />
                          Recent Activity
                        </h3>
                        <button className="text-sm text-indigo-600 font-semibold hover:underline">
                          View All
                        </button>
                      </div>
                      <div className="space-y-2">
                        {recentActivities.map((activity, idx) => (
                          <ActivityItem key={idx} {...activity} />
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            AI Recommendations
                          </h3>
                          <p className="text-indigo-100">Personalized suggestions for you</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {recommendations.map((rec, idx) => (
                          <div key={idx} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 hover:bg-opacity-30 transition">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                <rec.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold">{rec.title}</p>
                                <p className="text-sm text-indigo-100 mt-1">{rec.description}</p>
                              </div>
                              <button className="px-3 py-1 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:shadow-md transition">
                                {rec.action}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-600" />
                        Upcoming Tasks
                      </h3>
                      <div className="space-y-3">
                        {upcomingTasks.map(task => (
                          <div
                            key={task.id}
                            className={`flex items-start gap-3 p-3 rounded-xl transition ${
                              task.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <button
                              onClick={() => toggleTaskCompletion(task.id)}
                              className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                                task.completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300'
                              }`}
                            >
                              {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                            </button>

                            <div className="flex-1">
                              <p
                                className={`text-sm font-semibold ${
                                  task.completed
                                    ? 'text-green-700 line-through'
                                    : 'text-gray-900'
                                }`}
                              >
                                {task.task}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">{task.deadline}</span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    task.priority === 'high'
                                      ? 'bg-red-100 text-red-700'
                                      : task.priority === 'medium'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-green-100 text-green-700'
                                  }`}
                                >
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}

                      </div>
                        <button
                          onClick={() => setShowAddTask(true)}
                          className="w-full mt-4 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition"
                        >
                          + Add Task
                        </button>

                                            {showAddTask && (
                      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                          <h3 className="text-xl font-bold mb-4">Add New Task</h3>

                          <input
                            type="text"
                            placeholder="Task description"
                            value={newTask.task}
                            onChange={e => setNewTask({ ...newTask, task: e.target.value })}
                            className="w-full mb-3 px-4 py-2 border rounded-lg"
                          />

                          <input
                            type="text"
                            placeholder="Deadline (e.g., Jan 10)"
                            value={newTask.deadline}
                            onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                            className="w-full mb-3 px-4 py-2 border rounded-lg"
                          />

                          <select
                            value={newTask.priority}
                            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                            className="w-full mb-4 px-4 py-2 border rounded-lg"
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>

                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => setShowAddTask(false)}
                              className="px-4 py-2 border rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                setUpcomingTasks(prev => [
                                  ...prev,
                                  {
                                    id: Date.now(),
                                    ...newTask,
                                    completed: false,
                                  },
                                ]);
                                setNewTask({ task: '', deadline: '', priority: 'medium' });
                                setShowAddTask(false);
                              }}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    )}


                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Your Profile</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Education</p>
                          <p className="text-sm font-semibold text-gray-900">{profileData.degree}, {profileData.year}</p>
                          <p className="text-xs text-gray-600">{profileData.college}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Target Role</p>
                          <p className="text-sm font-semibold text-gray-900">{profileData.careerRole}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Top Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {profileData.skills.slice(0, 4).map(skill => (
                              <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                            {profileData.skills.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                +{profileData.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="w-full mt-4 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'roadmap' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Career Roadmap</h2>
                    <p className="text-gray-600 mt-1">Your personalized path to {profileData.careerRole}</p>
                  </div>
                  <button 
                    onClick={handleGenerateRoadmap}
                    disabled={roadmapLoading}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-5 h-5" />
                    {roadmapLoading ? 'Generating...' : roadmapData ? 'Regenerate Roadmap' : 'Generate AI Roadmap'}
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white bg-opacity-20 rounded-2xl">
                      <Brain className="w-12 h-12" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">AI-Powered Career Roadmap</h3>
                      <p className="text-purple-100 mt-1">Personalized 6-month plan based on your profile</p>
                    </div>
                  </div>
                  
                  {roadmapData && (
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-3xl font-bold">{profileData.skills.length}</div>
                        <div className="text-purple-100 text-sm mt-1">Current Skills</div>
                      </div>
                      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-3xl font-bold">6</div>
                        <div className="text-purple-100 text-sm mt-1">Months Plan</div>
                      </div>
                      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-3xl font-bold">{profileData.careerRole}</div>
                        <div className="text-purple-100 text-sm mt-1 truncate">Target Role</div>
                      </div>
                    </div>
                  )}
                </div>

                {roadmapLoading && (
                  <div className="bg-white rounded-2xl shadow-sm p-16 border border-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200"></div>
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
                      </div>
                      <p className="text-gray-600 mt-6 text-lg font-medium">AI is crafting your personalized roadmap...</p>
                      <p className="text-gray-500 text-sm mt-2">This may take 10-20 seconds</p>
                    </div>
                  </div>
                )}

                {!roadmapLoading && !roadmapData && (
                  <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-100">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl mb-4">
                        <Rocket className="w-10 h-10 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Start Your Journey?</h3>
                      <p className="text-gray-600 mb-6">Click "Generate AI Roadmap" to get your personalized 6-month career plan</p>
                      <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>Personalized Learning Path</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>Project Recommendations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>Company Targets</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                  {roadmapData &&
                    roadmapData.phases &&
                    roadmapData.nextActions &&
                    !roadmapLoading && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      {/* HEADER */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">Your Personalized Roadmap</h3>
                            <p className="text-gray-600 mt-1">
                              Generated for {user.name} • {profileData.careerRole}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            <span className="text-sm font-semibold text-gray-700">AI Generated</span>
                          </div>
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-8">
                        <div className="space-y-12">

                          {/* PHASES */}
                          {Array.isArray(roadmapData.phases) && roadmapData.phases.map((phase, phaseIdx) => (
                            <div key={phaseIdx} className="relative pl-10">
                              {/* Timeline dot */}
                              <div className="absolute left-0 top-2 w-4 h-4 bg-indigo-600 rounded-full"></div>

                              <h4 className="text-xl font-bold text-indigo-600">
                                {phase.title}
                                <span className="ml-3 text-sm font-medium text-gray-500">
                                  ({phase.duration})
                                </span>
                              </h4>

                              <ul className="mt-4 space-y-3">
                                {phase.tasks.map((task, taskIdx) => (
                                  <li
                                    key={taskIdx}
                                    className="flex items-start gap-3 bg-indigo-50 rounded-lg p-4 text-gray-800"
                                  >
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}

                          {/* NEXT ACTIONS */}
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                              <Rocket className="w-5 h-5" />
                              Next Actions
                            </h4>

                            <ul className="space-y-3">
                              {Array.isArray(roadmapData.nextActions) && roadmapData.nextActions.map((action, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <ArrowRight className="w-5 h-5 mt-1 flex-shrink-0" />
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* FOOTER */}
                      <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          💡 <strong>Tip:</strong> Bookmark this roadmap and track your progress weekly
                        </div>
                        <div className="flex gap-3">
                          <button className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">
                            Download PDF
                          </button>
                          <button
                            onClick={handleGenerateRoadmap}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
                          >
                            <Sparkles className="w-4 h-4" />
                            Regenerate
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

              </div>
            )}

            {view === 'applications' && <Applications />

            }

            {view === 'mentors' && <Mentors />

            }

            {view === 'learning' && <LearningPath />
            
            }

            {view === 'resume' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Resume AI Analyzer</h2>
                    <p className="text-gray-600 mt-1">Get expert feedback on your resume</p>
                  </div>
                </div>
                
                {!resumeFile && !resumeLoading && (
                  <div className="bg-white rounded-2xl shadow-sm p-12 border-2 border-dashed border-gray-300 hover:border-indigo-400 transition">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl mb-4">
                        <Upload className="w-10 h-10 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Your Resume</h3>
                      <p className="text-gray-600 mb-6">Get AI-powered insights and improvement suggestions</p>
                      <label className="cursor-pointer">
                        <input 
                          type="file" 
                          accept=".txt,.pdf"
                          onChange={handleResumeUpload}
                          className="hidden"
                        />
                        <span className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
                          Choose File
                        </span>
                      </label>
                      <p className="text-sm text-gray-500 mt-4">Supported: PDF, TXT • Max 5MB</p>
                    </div>
                  </div>
                )}

                {resumeLoading && (
                  <div className="bg-white rounded-2xl shadow-sm p-16 border border-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200"></div>
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
                      </div>
                      <p className="text-gray-600 mt-6 text-lg font-medium">AI is analyzing your resume...</p>
                      <p className="text-gray-500 text-sm mt-2">Reading content, checking ATS compatibility, comparing with your profile...</p>
                    </div>
                  </div>
                )}

                {resumeAnalysis && !resumeLoading && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                            <FileText className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">Analysis Complete!</h3>
                            <p className="text-green-100 mt-1">📄 {resumeFile?.name}</p>
                          </div>
                        </div>
                        <label className="cursor-pointer">
                          <input 
                            type="file" 
                            accept=".txt,.pdf"
                            onChange={handleResumeUpload}
                            className="hidden"
                          />
                          <span className="inline-block px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:shadow-md transition flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Analyze New
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900">Detailed Resume Analysis</h3>
                        <p className="text-gray-600 mt-1">Expert feedback from AI Career Coach</p>
                      </div>
                      
                      <div className="p-8">
                        <style>{`
                          .resume-analysis h1, .resume-analysis h2, .resume-analysis h3 {
                            color: #1f2937;
                            font-weight: 700;
                            margin-top: 2rem;
                            margin-bottom: 1rem;
                          }
                          .resume-analysis h2 {
                            font-size: 1.5rem;
                            color: #4f46e5;
                            border-left: 4px solid #6366f1;
                            padding-left: 1rem;
                            margin-top: 2.5rem;
                          }
                          .resume-analysis h3 {
                            font-size: 1.25rem;
                            color: #6366f1;
                          }
                          .resume-analysis p {
                            color: #4b5563;
                            line-height: 1.8;
                            margin: 1rem 0;
                            font-size: 1.05rem;
                          }
                          .resume-analysis ul, .resume-analysis ol {
                            margin: 1rem 0;
                            padding-left: 2rem;
                            color: #374151;
                          }
                          .resume-analysis li {
                            margin: 0.75rem 0;
                            line-height: 1.8;
                          }
                          .resume-analysis strong {
                            color: #1f2937;
                            font-weight: 600;
                          }
                          .resume-analysis code {
                            background: #f3f4f6;
                            padding: 0.2rem 0.5rem;
                            border-radius: 0.25rem;
                            color: #6366f1;
                            font-size: 0.9rem;
                          }
                        `}</style>
                        <div className="resume-analysis whitespace-pre-wrap leading-relaxed">
                          {formatResumeAnalysis(resumeAnalysis)}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          💡 <strong>Tip:</strong> Implement the high-priority suggestions first
                        </div>
                        <button 
                          onClick={() => {
                            setResumeAnalysis(null);
                            setResumeFile(null);
                          }}
                          className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                        >
                          Analyze Another
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// ==========================================
// MAIN APP
// ==========================================

export default function App() {
  const [appState, setAppState] = useState('auth');
  const [view, setView] = useState('overview');
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [aiRecs, setAiRecs] = useState(null);
  const [aiRecsLoading, setAiRecsLoading] = useState(false);


  const contextValue = {
    user,
    profileData,
    view,
    setView,
    logout: async () => {
      try {
        await auth.signOut();
        localStorage.removeItem('profileData'); // ✅ Clear saved data
        setAppState('auth');
        setUser(null);
        setProfileData(null);
        setView('overview');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

    useEffect(() => {
    localStorage.clear(); // Clear all saved data
    auth.signOut(); // Force sign out
  }, []);



useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      // ✅ User is logged in - restore their session
      setUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        photo: firebaseUser.photoURL || null,
      });
      
      // ✅ Try to restore profile data from localStorage
      const savedProfile = localStorage.getItem('profileData');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
        setAppState('dashboard');
      } else {
        setAppState('onboarding');
      }
    } else {
      // ✅ User is logged out
      setUser(null);
      setProfileData(null);
      localStorage.removeItem('profileData'); // Clear on logout
      setAppState('auth');
      setView('overview');
    }
  });

  return () => unsubscribe();
}, []); // ✅ Empty dependency array - runs once on mount

    // Add this as a separate useEffect
    useEffect(() => {
      if (profileData) {
        localStorage.setItem('profileData', JSON.stringify(profileData));
      }
    }, [profileData]);


  return (
    <AppContext.Provider value={contextValue}>
      {appState === 'auth' && (
        <AuthPage onAuthSuccess={(userData) => {
          setUser(userData);
          setAppState('onboarding');
        }} />
      )}
      {appState === 'onboarding' && (
        <Onboarding 
          userName={user.name} 
          onComplete={(data) => {
            setProfileData(data);
            setAppState('dashboard');
          }} 
        />
      )}
      {appState === 'dashboard' && <Dashboard />}
    </AppContext.Provider>
  );
}