import React, { useState, useEffect } from 'react';
import { MapView } from './components/MapView';
import { ChatPanel } from './components/ChatPanel';
import { UsersList } from './components/UsersList';
import { useGeolocation } from './hooks/useGeolocation';
import { useSocket } from './hooks/useSocket';
import { User, Message, USER_COLORS } from '../../shared/types';
import { Loader, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const { location, error: geoError, isLoading: geoLoading } = useGeolocation();
  const { socket, isConnected } = useSocket('http://localhost:3001');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [proximityRange] = useState(100); // 100 meters

  // Initialize user
  useEffect(() => {
    if (location && !currentUser) {
      const userId = `user-${Date.now()}`;
      const userName = `User ${Math.floor(Math.random() * 1000)}`;
      const userColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];

      const user: User = {
        id: userId,
        name: userName,
        color: userColor,
        latitude: location.latitude,
        longitude: location.longitude,
        isOnline: true,
        lastSeen: new Date(),
      };

      setCurrentUser(user);

      if (socket) {
        socket.emit('user:join', user);
      }
    }
  }, [location, currentUser, socket]);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    socket.on('proximity:update', (users: User[]) => {
      setNearbyUsers(users);
    });

    socket.on('message:send', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('message:voice', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('proximity:update');
      socket.off('message:send');
      socket.off('message:voice');
    };
  }, [socket]);

  const handleMapMove = (lat: number, lng: number) => {
    if (currentUser && socket) {
      const updatedUser = { ...currentUser, latitude: lat, longitude: lng };
      setCurrentUser(updatedUser);
      socket.emit('user:move', updatedUser);
    }
  };

  const handleSendMessage = (text: string) => {
    if (currentUser && socket) {
      const message: Message = {
        id: `msg-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userColor: currentUser.color,
        text,
        timestamp: new Date(),
        type: 'text',
        latitude: currentUser.latitude,
        longitude: currentUser.longitude,
      };
      socket.emit('message:send', message);
    }
  };

  const handleSendVoice = (audioBlob: Blob) => {
    if (currentUser && socket) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const message: Message = {
          id: `msg-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userColor: currentUser.color,
          text: '🎙️ Voice message',
          timestamp: new Date(),
          type: 'voice',
          audioUrl: reader.result as string,
          latitude: currentUser.latitude,
          longitude: currentUser.longitude,
        };
        socket.emit('message:voice', message);
      };
      reader.readAsDataURL(audioBlob);
    }
  };

  if (geoLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-400" size={40} />
          <p className="text-white">Loading location...</p>
        </div>
      </div>
    );
  }

  if (geoError || !location) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={40} />
          <p className="text-white">Error: {geoError || 'Location not available'}</p>
          <p className="text-gray-400 text-sm mt-2">Please enable location services</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-400" size={40} />
          <p className="text-white">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🗺️ MapChat</h1>
            <p className="text-sm text-gray-400">Proximity-based chat application</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="text-xs text-gray-400">
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </p>
            </div>
            <div
              className="w-8 h-8 rounded-full border-2 border-white"
              style={{ backgroundColor: currentUser.color }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto h-[calc(100vh-80px)] p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          {/* Map */}
          <div className="lg:col-span-3">
            <MapView
              currentUser={currentUser}
              nearbyUsers={nearbyUsers}
              onMapMove={handleMapMove}
            />
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Users List */}
            <UsersList
              currentUser={currentUser}
              nearbyUsers={nearbyUsers}
              proximityRange={proximityRange}
            />

            {/* Chat Panel */}
            <ChatPanel
              messages={messages}
              currentUserId={currentUser.id}
              onSendMessage={handleSendMessage}
              onSendVoice={handleSendVoice}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
