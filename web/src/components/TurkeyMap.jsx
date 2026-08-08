import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { soundManager } from '../utils/audio';

// Custom Map Pins
const guessIcon = new L.DivIcon({
  className: 'custom-guess-icon',
  html: `<div style="
    width: 24px;
    height: 24px;
    background: #ef4444;
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
    transform: translate(-50%, -50%);
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const targetIcon = new L.DivIcon({
  className: 'custom-target-icon',
  html: `<div style="
    width: 28px;
    height: 28px;
    background: #10b981;
    border: 3px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.9);
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 14px;
  ">★</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

function MapClickHandler({ onMapClick, disabled }) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      soundManager.playClick();
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

function MapController({ selectedGuess, targetLocation, isRevealed }) {
  const map = useMapEvents({});

  useEffect(() => {
    if (isRevealed && selectedGuess && targetLocation) {
      const bounds = L.latLngBounds(
        [selectedGuess.lat, selectedGuess.lng],
        [targetLocation.lat, targetLocation.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10, animate: true });
    }
  }, [isRevealed, selectedGuess, targetLocation, map]);

  return null;
}

export function TurkeyMap({ selectedGuess, setSelectedGuess, targetLocation, isRevealed, distanceKm }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '20px', overflow: 'hidden' }}>
      <MapContainer
        center={[39.0, 35.5]}
        zoom={6}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '420px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapClickHandler onMapClick={setSelectedGuess} disabled={isRevealed} />
        <MapController selectedGuess={selectedGuess} targetLocation={targetLocation} isRevealed={isRevealed} />

        {/* User Guess Marker */}
        {selectedGuess && (
          <Marker position={[selectedGuess.lat, selectedGuess.lng]} icon={guessIcon}>
            <Popup>
              <strong>Tahmininiz</strong>
            </Popup>
          </Marker>
        )}

        {/* Target Location Marker when revealed */}
        {isRevealed && targetLocation && (
          <Marker position={[targetLocation.lat, targetLocation.lng]} icon={targetIcon}>
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong style={{ fontSize: '1rem', color: '#10b981' }}>{targetLocation.district}</strong>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{targetLocation.city}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Connecting Line when revealed */}
        {isRevealed && selectedGuess && targetLocation && (
          <Polyline
            positions={[
              [selectedGuess.lat, selectedGuess.lng],
              [targetLocation.lat, targetLocation.lng]
            ]}
            pathOptions={{
              color: '#3b82f6',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.9
            }}
          />
        )}
      </MapContainer>

      {/* Helper instructions overlay */}
      {!selectedGuess && !isRevealed && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(9, 13, 22, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '10px 20px',
          borderRadius: '30px',
          color: '#f8fafc',
          fontSize: '0.88rem',
          fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          pointerEvents: 'none'
        }}>
          🎯 Harita üzerinde tahmin etmek istediğin konuma tıkla
        </div>
      )}
    </div>
  );
}
