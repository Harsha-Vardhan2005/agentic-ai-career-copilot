import React, { useState } from 'react';
import {
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
} from './firebase';

export default function AuthPage({ onAuthSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    setError('');

    if (!email || !password) {
      setError('Please fill all required fields.');
      return;
    }

    if (isSignup) {
      if (!name) {
        setError('Please enter your name.');
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

    try {
      setLoading(true);

      const result = isSignup
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

      const user = result.user;

      onAuthSuccess({
        uid: user.uid,
        name: name || user.displayName || email.split('@')[0],
        email: user.email,
        photo: user.photoURL || null,
      });
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      onAuthSuccess({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      });
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-2">
          {isSignup ? 'Create an Account' : 'Welcome Back'}
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {isSignup && (
          <input
            className="auth-input"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}

        <input
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {isSignup && (
          <input
            type="password"
            className="auth-input"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        )}

        <button
          onClick={handleEmailAuth}
          disabled={loading}
          className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold"
        >
          {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
        </button>

        <div className="my-4 text-center text-sm text-gray-500">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 border rounded-xl font-semibold"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm mt-6">
          {isSignup ? 'Already have an account?' : 'New here?'}{' '}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="text-indigo-600 font-semibold"
          >
            {isSignup ? 'Login' : 'Create account'}
          </button>
        </p>
      </div>
    </div>
  );
}

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
