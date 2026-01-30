import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiService } from '../services/mockApi';
import { Hackathon } from '../types';
import { Badge } from '../components/Badge';
import { Plus, Edit2, Trash2, Search, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth
    if (!ApiService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    const res = await ApiService.getHackathons({});
    if (res.success && res.data) {
      setHackathons(res.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this hackathon?")) {
      await ApiService.deleteHackathon(id);
      loadData();
    }
  };

  const filteredHackathons = hackathons.filter(h => 
    h.title.toLowerCase().includes(filter.toLowerCase()) || 
    h.organizer.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
           <p className="text-zinc-500 text-sm">Manage listings and monitor AI agents.</p>
        </div>
        <Link 
          to="/admin/new" 
          className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg font-bold flex items-center transition-colors shadow-lg shadow-amber-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Hackathon
        </Link>
      </div>

      {/* Stats/Toolbar */}
      <div className="bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-800 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search listings..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 placeholder-zinc-600 transition-colors"
          />
        </div>
        <div className="flex gap-2 text-sm text-zinc-400 whitespace-nowrap">
            <span>Total: <strong className="text-white">{hackathons.length}</strong></span>
            <span>•</span>
            <span>Published: <strong className="text-white">{hackathons.filter(h => h.status === 'published').length}</strong></span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-zinc-800 text-xs uppercase text-zinc-500 font-semibold">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">Deadline</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
              ) : filteredHackathons.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No hackathons found.</td></tr>
              ) : (
                filteredHackathons.map(h => (
                  <tr key={h._id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-200">{h.title}</div>
                      <div className="text-xs text-zinc-500">{h.organizer}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={h.status === 'published' ? 'success' : h.status === 'expired' ? 'error' : 'default'}>
                        {h.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{h.mode}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {new Date(h.registrationDeadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                        <Badge variant={h.sourceType === 'ai' ? 'blue' : 'outline'}>
                            {h.sourceType === 'ai' ? 'AI Bot' : 'Manual'}
                        </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                         <Link 
                           to={`/admin/edit/${h._id}`} 
                           className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded transition-colors"
                         >
                            <Edit2 className="w-4 h-4" />
                         </Link>
                         <button 
                           onClick={() => handleDelete(h._id)}
                           className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                         >
                            <Trash2 className="w-4 h-4" />
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
    </div>
  );
};