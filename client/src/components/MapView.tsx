import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { User } from '../../../shared/types';

interface MapViewProps {
  currentUser: User;
  nearbyUsers: User[];
  onMapMove: (lat: number, lng: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({ currentUser, nearbyUsers, onMapMove }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map with dark theme
      mapRef.current = L.map('map', {
        center: [currentUser.latitude, currentUser.longitude],
        zoom: 16,
        layers: [
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20,
          }),
        ],
      });

      // Add current user marker
      const currentMarker = L.circleMarker(
        [currentUser.latitude, currentUser.longitude],
        {
          radius: 10,
          fillColor: currentUser.color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }
      ).addTo(mapRef.current);

      const popup = L.popup().setContent(`<strong>${currentUser.name}</strong><br>You`);
      currentMarker.bindPopup(popup);
      markersRef.current.set(currentUser.id, currentMarker);

      // Handle map drag
      mapRef.current.on('dragend', () => {
        const center = mapRef.current!.getCenter();
        onMapMove(center.lat, center.lng);
      });
    }

    // Update current user marker
    if (mapRef.current) {
      const currentMarker = markersRef.current.get(currentUser.id);
      if (currentMarker) {
        currentMarker.setLatLng([currentUser.latitude, currentUser.longitude]);
      }
      mapRef.current.setView([currentUser.latitude, currentUser.longitude], 16);
    }
  }, [currentUser, onMapMove]);

  // Update nearby users markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove markers for users no longer nearby
    markersRef.current.forEach((marker, userId) => {
      if (userId !== currentUser.id && !nearbyUsers.find(u => u.id === userId)) {
        mapRef.current!.removeLayer(marker);
        markersRef.current.delete(userId);
      }
    });

    // Add or update nearby users markers
    nearbyUsers.forEach(user => {
      if (user.id === currentUser.id) return;

      let marker = markersRef.current.get(user.id);
      if (!marker) {
        marker = L.circleMarker(
          [user.latitude, user.longitude],
          {
            radius: 8,
            fillColor: user.color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          }
        ).addTo(mapRef.current!);

        const popup = L.popup().setContent(`<strong>${user.name}</strong>`);
        marker.bindPopup(popup);
        markersRef.current.set(user.id, marker);
      } else {
        marker.setLatLng([user.latitude, user.longitude]);
      }
    });
  }, [nearbyUsers, currentUser.id]);

  return (
    <div id="map" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
  );
};
