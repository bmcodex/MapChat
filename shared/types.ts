// User types
export interface User {
  id: string;
  name: string;
  color: string;
  latitude: number;
  longitude: number;
  isOnline: boolean;
  lastSeen: Date;
}

// Message types
export interface Message {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'voice';
  audioUrl?: string;
  latitude: number;
  longitude: number;
}

// Proximity types
export interface ProximityUser {
  user: User;
  distance: number; // in meters
  canChat: boolean; // within chat range
}

// Socket events
export interface SocketEvents {
  'user:join': (user: User) => void;
  'user:leave': (userId: string) => void;
  'user:move': (user: User) => void;
  'message:send': (message: Message) => void;
  'message:voice': (message: Message) => void;
  'proximity:update': (users: ProximityUser[]) => void;
}

// Chat settings
export interface ChatSettings {
  proximityRange: number; // meters
  updateInterval: number; // milliseconds
  maxMessagesInView: number;
  voiceEnabled: boolean;
}

// Color palette for users
export const USER_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B88B', // Peach
  '#A8E6CF', // Light Green
];
