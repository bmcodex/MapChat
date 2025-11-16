import React from 'react';
import { User } from '../../../shared/types';
import { Users, MapPin } from 'lucide-react';

interface UsersListProps {
  currentUser: User;
  nearbyUsers: User[];
  proximityRange: number;
}

export const UsersList: React.FC<UsersListProps> = ({
  currentUser,
  nearbyUsers,
  proximityRange,
}) => {
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortedUsers = nearbyUsers
    .map(user => ({
      user,
      distance: calculateDistance(
        currentUser.latitude,
        currentUser.longitude,
        user.latitude,
        user.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users size={20} className="text-blue-400" />
        <h2 className="text-lg font-semibold text-white">
          Nearby Users ({nearbyUsers.length})
        </h2>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedUsers.length === 0 ? (
          <p className="text-gray-400 text-sm">No users nearby</p>
        ) : (
          sortedUsers.map(({ user, distance }) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: user.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.name}</p>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <MapPin size={12} />
                  <span>{Math.round(distance)}m away</span>
                </div>
              </div>
              {distance <= proximityRange * 0.5 && (
                <div className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                  Close
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          Chat range: <span className="text-blue-400">{proximityRange}m</span>
        </p>
      </div>
    </div>
  );
};
