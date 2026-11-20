import React, { useState } from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';

export default function VetLocator() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const detectLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (err) => {
        setError('Unable to retrieve your location. Please check permissions.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-[var(--color-text)] flex items-center gap-2">
          📍 Find Nearby Vets
        </h3>
        <button 
          onClick={detectLocation}
          disabled={loading}
          className="flex items-center gap-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          Locate Me
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="flex-1 min-h-[300px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative border border-gray-200 dark:border-gray-700">
        {location ? (
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0 }}
            src={`https://maps.google.com/maps?q=emergency+veterinary+clinic&ll=${location.lat},${location.lng}&z=13&output=embed`}
            allowFullScreen
            title="Nearby Vets"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
            <MapPin className="w-12 h-12 mb-3 opacity-50" />
            <p>Click "Locate Me" to see emergency veterinary clinics near your current location.</p>
          </div>
        )}
      </div>
      
      {location && (
        <a 
          href={`https://www.google.com/maps/search/emergency+vet+clinic/@${location.lat},${location.lng},13z`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Open in Google Maps ↗
        </a>
      )}
    </div>
  );
}
