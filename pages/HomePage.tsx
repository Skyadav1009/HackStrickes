import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, Clock } from 'lucide-react';
import { ApiService } from '../services/mockApi';
import { Hackathon, HackathonStatus, HackathonMode } from '../types';
import { Badge } from '../components/Badge';
import { DEFAULT_TAGS } from '../constants';

export const HomePage: React.FC = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchHackathons();
  }, [selectedMode, selectedTag]);

  const fetchHackathons = async () => {
    setLoading(true);
    const filter: any = { status: HackathonStatus.PUBLISHED };
    if (selectedMode !== 'all') filter.mode = selectedMode;
    if (selectedTag) filter.tag = selectedTag;

    const response = await ApiService.getHackathons(filter);
    if (response.success && response.data) {
      setHackathons(response.data);
    }
    setLoading(false);
  };

  const isClosingSoon = (dateStr: string) => {
    const days = (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return days > 0 && days <= 3;
  };

  const isExpired = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
          Discover Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">Golden Opportunity</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          The best active hackathons, curated for developers, designers, and innovators. 
          Updated daily by community & AI.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-16 bg-black/90 backdrop-blur-md z-40 py-4 border-b border-zinc-800">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          <button 
            onClick={() => setSelectedMode('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${selectedMode === 'all' ? 'bg-amber-500 border-amber-500 text-black' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-amber-500/30 hover:text-amber-400'}`}
          >
            All Modes
          </button>
          {Object.values(HackathonMode).map(mode => (
             <button 
             key={mode}
             onClick={() => setSelectedMode(mode)}
             className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${selectedMode === mode ? 'bg-amber-500 border-amber-500 text-black' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-amber-500/30 hover:text-amber-400'}`}
           >
             {mode}
           </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar max-w-lg">
           {selectedTag && (
             <Badge variant="warning" className="px-3 py-1.5" onClick={() => setSelectedTag(null)}>
               {selectedTag} &times;
             </Badge>
           )}
           {!selectedTag && DEFAULT_TAGS.slice(0, 5).map(tag => (
             <Badge 
              key={tag} 
              variant="outline" 
              className="px-3 py-1.5 cursor-pointer bg-zinc-900 hover:bg-zinc-800"
              onClick={() => setSelectedTag(tag)}
            >
               {tag}
             </Badge>
           ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-zinc-900 rounded-xl border border-zinc-800 h-80 animate-pulse">
               <div className="h-40 bg-zinc-800 rounded-t-xl"></div>
               <div className="p-6 space-y-3">
                 <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
                 <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
               </div>
            </div>
          ))}
        </div>
      ) : hackathons.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800 border-dashed">
          <div className="text-zinc-600 mb-4">
             <Calendar className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-300">No active hackathons found</h3>
          <p className="text-zinc-500">Try adjusting your filters or check back later.</p>
          {selectedTag || selectedMode !== 'all' ? (
              <button 
                onClick={() => {setSelectedMode('all'); setSelectedTag(null);}} 
                className="mt-4 text-amber-500 font-medium hover:underline"
              >
                Clear all filters
              </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map(hackathon => (
            <Link 
              to={`/hackathon/${hackathon._id}`} 
              key={hackathon._id}
              className="group bg-zinc-900 rounded-xl border border-zinc-800 shadow-sm hover:shadow-amber-500/10 hover:border-amber-500/30 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
            >
              <div className="relative h-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 opacity-70 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={hackathon.mode === 'Online' ? 'success' : 'warning'}>{hackathon.mode}</Badge>
                  {isClosingSoon(hackathon.registrationDeadline) && !isExpired(hackathon.registrationDeadline) && (
                    <Badge variant="filledError" className="animate-pulse">Closing Soon</Badge>
                  )}
                  {isExpired(hackathon.registrationDeadline) && (
                     <Badge variant="default">Expired</Badge>
                  )}
                </div>

                <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-amber-400 transition-colors line-clamp-1">
                  {hackathon.title}
                </h3>
                
                <p className="text-sm text-zinc-500 mb-4 font-medium flex items-center">
                   By {hackathon.organizer}
                </p>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center text-sm text-zinc-400">
                    <Award className="w-4 h-4 mr-2 text-amber-500" />
                    <span>{hackathon.prize}</span>
                  </div>
                  <div className="flex items-center text-sm text-zinc-400">
                    <Clock className="w-4 h-4 mr-2 text-zinc-600" />
                    <span>Reg. closes {new Date(hackathon.registrationDeadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-wrap gap-2">
                  {hackathon.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs text-zinc-400 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded">#{tag}</span>
                  ))}
                  {hackathon.tags.length > 3 && (
                    <span className="text-xs text-zinc-600 py-1">+ {hackathon.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};