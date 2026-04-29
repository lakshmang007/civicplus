export interface UserProfile {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: any;
  language: 'en' | 'hi' | 'kn' | 'te' | 'ta';
}

export interface Report {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  mediaUrl?: string;
  status: 'open' | 'verified' | 'escalated' | 'resolved';
  category: string;
  supportsCount: number;
  creatorId: string;
  authorityId?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Authority {
  id: string;
  name: string;
  department: string;
  location: string;
  trustScore: number;
  bio: string;
  email: string;
  whatsapp?: string;
}

export interface Support {
  id: string;
  userId: string;
  reportId: string;
  createdAt: any;
}
