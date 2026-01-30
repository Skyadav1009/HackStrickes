import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../services/mockApi';
import { Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await ApiService.login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid credentials (try admin/password123)');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-zinc-900 rounded-xl shadow-2xl shadow-black border border-zinc-800 p-8">
        <div className="text-center mb-8">
          <div className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700">
             <Lock className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-zinc-500 text-sm mt-2">Secure access for HackPulse admins</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-950/30 text-red-400 text-sm p-3 rounded-lg border border-red-900/50 text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-zinc-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder-zinc-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-amber-900/20"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-zinc-600">
           Demo Credentials: admin / password123
        </div>
      </div>
    </div>
  );
};