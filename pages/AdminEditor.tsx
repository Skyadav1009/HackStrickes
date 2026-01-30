import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiService } from '../services/mockApi';
import { HackathonInput, HackathonStatus, HackathonMode, SourceType } from '../types';
import { DEFAULT_TAGS } from '../constants';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';

const INITIAL_STATE: HackathonInput = {
  title: '',
  organizer: '',
  description: '',
  mode: HackathonMode.ONLINE,
  startDate: '',
  endDate: '',
  registrationDeadline: '',
  prize: '',
  tags: [],
  registrationLink: '',
  sourceUrl: '',
  sourceType: SourceType.MANUAL,
  status: HackathonStatus.DRAFT,
};

export const AdminEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<HackathonInput>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ApiService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (isEdit && id) {
      loadHackathon(id);
    }
  }, [id, isEdit, navigate]);

  const loadHackathon = async (hackathonId: string) => {
    setLoading(true);
    const res = await ApiService.getHackathonById(hackathonId);
    if (res.success && res.data) {
      const { _id, createdAt, updatedAt, slug, ...rest } = res.data;
      setFormData(rest);
    } else {
      setError("Failed to load hackathon data");
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => {
      const currentTags = prev.tags;
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...currentTags, tag] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && id) {
        await ApiService.updateHackathon(id, formData);
      } else {
        const res = await ApiService.createHackathon(formData);
        if (!res.success) throw new Error(res.error);
      }
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/admin')} className="flex items-center text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Cancel
        </button>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Hackathon' : 'New Hackathon'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-8 space-y-8">
        {error && (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-lg flex items-center border border-red-900/50">
             <AlertTriangle className="w-5 h-5 mr-2" />
             {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-200 border-b border-zinc-800 pb-2">Basic Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md focus:ring-2 focus:ring-amber-500 outline-none text-white placeholder-zinc-600" placeholder="e.g. Global AI Hackathon" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Organizer</label>
              <input name="organizer" value={formData.organizer} onChange={handleChange} required className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md focus:ring-2 focus:ring-amber-500 outline-none text-white placeholder-zinc-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Mode</label>
              <select name="mode" value={formData.mode} onChange={handleChange} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md focus:ring-2 focus:ring-amber-500 outline-none text-white">
                {Object.values(HackathonMode).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Dates & Prize */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-200 border-b border-zinc-800 pb-2">Schedule & Prizes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
               <label className="block text-sm font-medium text-zinc-400 mb-1">Start Date</label>
               <input type="datetime-local" name="startDate" value={formData.startDate.substring(0, 16)} onChange={handleChange} required className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md outline-none text-white [color-scheme:dark]" />
             </div>
             <div>
               <label className="block text-sm font-medium text-zinc-400 mb-1">End Date</label>
               <input type="datetime-local" name="endDate" value={formData.endDate.substring(0, 16)} onChange={handleChange} required className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md outline-none text-white [color-scheme:dark]" />
             </div>
             <div>
               <label className="block text-sm font-medium text-zinc-400 mb-1">Reg. Deadline</label>
               <input type="datetime-local" name="registrationDeadline" value={formData.registrationDeadline.substring(0, 16)} onChange={handleChange} required className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md outline-none text-white [color-scheme:dark]" />
             </div>
             <div className="col-span-3">
               <label className="block text-sm font-medium text-zinc-400 mb-1">Prize Pool</label>
               <input name="prize" value={formData.prize} onChange={handleChange} required placeholder="e.g. $50,000 USD + Swag" className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md outline-none text-white placeholder-zinc-600" />
             </div>
          </div>
        </div>

        {/* Links & Content */}
        <div className="space-y-4">
           <h3 className="text-lg font-semibold text-zinc-200 border-b border-zinc-800 pb-2">Details</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Registration Link</label>
                <input type="url" name="registrationLink" value={formData.registrationLink} onChange={handleChange} required className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md outline-none text-white placeholder-zinc-600" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Source URL</label>
                <input type="url" name="sourceUrl" value={formData.sourceUrl} onChange={handleChange} required className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md outline-none text-white placeholder-zinc-600" />
              </div>
              
              <div className="col-span-2">
                 <label className="block text-sm font-medium text-zinc-400 mb-1">Description (Markdown Supported)</label>
                 <textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md font-mono text-sm outline-none text-white placeholder-zinc-600" placeholder="# Hackathon Details..." />
              </div>

              <div className="col-span-2">
                 <label className="block text-sm font-medium text-zinc-400 mb-2">Tags</label>
                 <div className="flex flex-wrap gap-2">
                    {DEFAULT_TAGS.map(tag => (
                      <button 
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${formData.tags.includes(tag) ? 'bg-amber-500 text-black border-amber-500' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-amber-500/50 hover:text-amber-400'}`}
                      >
                        {tag}
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Status Control */}
        <div className="bg-zinc-950 p-4 rounded-lg flex items-center justify-between border border-zinc-800">
           <div className="text-sm text-zinc-400">
             <span className="font-bold block text-zinc-200">Publishing Status</span>
             Current: {formData.status}
           </div>
           <select name="status" value={formData.status} onChange={handleChange} className="px-4 py-2 border border-zinc-800 rounded-md bg-zinc-900 text-white outline-none focus:border-amber-500">
              <option value={HackathonStatus.DRAFT}>Draft</option>
              <option value={HackathonStatus.PUBLISHED}>Published</option>
              <option value={HackathonStatus.EXPIRED}>Expired</option>
           </select>
        </div>

        <div className="flex justify-end pt-4">
           <button 
             type="submit" 
             disabled={loading}
             className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-lg font-bold flex items-center transition-all disabled:opacity-50 shadow-lg shadow-amber-900/20"
           >
             <Save className="w-5 h-5 mr-2" />
             {loading ? 'Saving...' : 'Save Hackathon'}
           </button>
        </div>
      </form>
    </div>
  );
};