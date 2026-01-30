import { Hackathon, HackathonInput, HackathonStatus, ApiResponse, SourceType } from "../types";
import { INITIAL_HACKATHONS_SEED } from "../constants";

// Keys for LocalStorage
const STORAGE_KEY = 'hackpulse_data';
const AUTH_KEY = 'hackpulse_auth_token';

// Helper to initialize data
const getDB = (): Hackathon[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HACKATHONS_SEED));
    return INITIAL_HACKATHONS_SEED as Hackathon[];
  }
  return JSON.parse(stored);
};

const saveDB = (data: Hackathon[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// --- Mock API Methods ---

export const ApiService = {
  // GET /api/hackathons
  getHackathons: async (
    filter?: { mode?: string; tag?: string; status?: string }
  ): Promise<ApiResponse<Hackathon[]>> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let data = getDB();
    
    // Auto-expiry logic: Check active hackathons and expire them if deadline passed
    const now = new Date();
    let hasUpdates = false;
    
    data = data.map(h => {
      if (h.status === HackathonStatus.PUBLISHED && new Date(h.registrationDeadline) < now) {
        hasUpdates = true;
        return { ...h, status: HackathonStatus.EXPIRED }; 
      }
      return h;
    });

    // Persist updates if any statuses changed
    if (hasUpdates) {
      saveDB(data);
    }

    if (filter?.status) {
      data = data.filter(h => h.status === filter.status);
    } else {
      // If no specific status requested (e.g. Admin Dashboard might request all), 
      // we generally return all, but public view usually requests status=published via the component.
    }

    if (filter?.mode) {
      data = data.filter(h => h.mode === filter.mode);
    }

    if (filter?.tag) {
      data = data.filter(h => h.tags.includes(filter.tag));
    }

    // Sort: Closing soonest first for active ones
    data.sort((a, b) => {
        const dateA = new Date(a.registrationDeadline).getTime();
        const dateB = new Date(b.registrationDeadline).getTime();
        return dateA - dateB;
    });

    return { success: true, data };
  },

  // GET /api/hackathons/:id
  getHackathonById: async (id: string): Promise<ApiResponse<Hackathon>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const data = getDB();
    const hackathon = data.find(h => h._id === id);
    
    if (hackathon) {
      return { success: true, data: hackathon };
    }
    return { success: false, error: "Hackathon not found" };
  },

  // POST /api/hackathons
  createHackathon: async (input: HackathonInput): Promise<ApiResponse<Hackathon>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const data = getDB();
    
    // Duplicate check simulation
    const duplicate = data.find(h => h.sourceUrl === input.sourceUrl || h.title === input.title);
    if (duplicate) {
        return { success: false, error: "A hackathon with this Source URL or Title already exists." };
    }

    const newHackathon: Hackathon = {
      ...input,
      _id: `hack_${Date.now()}`,
      slug: input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Default to manual if not specified (though TS enforces it)
      sourceType: input.sourceType || SourceType.MANUAL, 
    };

    data.push(newHackathon);
    saveDB(data);
    return { success: true, data: newHackathon };
  },

  // PUT /api/hackathons/:id
  updateHackathon: async (id: string, input: Partial<HackathonInput>): Promise<ApiResponse<Hackathon>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const data = getDB();
    const index = data.findIndex(h => h._id === id);

    if (index === -1) {
      return { success: false, error: "Hackathon not found" };
    }

    const updatedHackathon = {
      ...data[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    data[index] = updatedHackathon;
    saveDB(data);
    return { success: true, data: updatedHackathon };
  },

  // DELETE /api/hackathons/:id
  deleteHackathon: async (id: string): Promise<ApiResponse<null>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    let data = getDB();
    data = data.filter(h => h._id !== id);
    saveDB(data);
    return { success: true };
  },

  // AUTH Helpers
  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_KEY);
  },
  
  login: async (username: string, password: string): Promise<boolean> => {
     await new Promise(resolve => setTimeout(resolve, 500));
     // Hardcoded for demo
     if (username === 'admin' && password === 'password123') {
         localStorage.setItem(AUTH_KEY, 'mock_jwt_token_xyz');
         return true;
     }
     return false;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  }
};