export enum HackathonMode {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
  HYBRID = 'Hybrid'
}

export enum HackathonStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  EXPIRED = 'expired'
}

export enum SourceType {
  MANUAL = 'manual',
  AI = 'ai'
}

export interface Hackathon {
  _id: string; // Simulating MongoDB ObjectId
  title: string;
  slug: string;
  organizer: string;
  description: string;
  mode: HackathonMode;
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  registrationDeadline: string; // ISO Date string
  prize: string;
  tags: string[];
  registrationLink: string;
  sourceUrl: string;
  sourceType: SourceType;
  aiConfidence?: number; // Nullable, 0-1
  status: HackathonStatus;
  createdAt: string;
  updatedAt: string;
}

export type HackathonInput = Omit<Hackathon, '_id' | 'createdAt' | 'updatedAt' | 'slug'>;

export interface User {
  id: string;
  username: string;
  role: 'admin';
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}