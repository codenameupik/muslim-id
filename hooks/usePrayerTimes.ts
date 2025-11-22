import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface HijriDate {
  day: string;
  month: {
    en: string;
    ar: string;
  };
  year: string;
  weekday: {
    en: string;
    ar: string;
  };
}

export const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [city, setCity] = useState<string>('Locating...');
  const [refreshing, setRefreshing] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const fetchPrayerTimes = async (lat: number, lng: number) => {
    setCoordinates({ lat, lng }); // Update coordinates
    try {
      const date = new Date();
      const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${lat}&longitude=${lng}&method=2`
      );
      const data = await response.json();
      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
        setHijriDate(data.data.date.hijri);
        setErrorMsg(null);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      setErrorMsg('Failed to fetch prayer times');
    }
  };

  const getLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Showing default location (Jakarta).');
        // Default to Jakarta
        fetchPrayerTimes(-6.2088, 106.8456);
        setCity('Jakarta (Default)');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      
      // Reverse geocode to get city name
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        if (reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          setCity(`${address.city || address.subregion || 'Unknown Location'}`);
        }
      } catch {
        setCity('Unknown Location');
      }

      fetchPrayerTimes(location.coords.latitude, location.coords.longitude);
    } catch {
      setErrorMsg('Error getting location');
      // Default to Jakarta on error
      fetchPrayerTimes(-6.2088, 106.8456);
      setCity('Jakarta (Default)');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const refresh = () => {
    setRefreshing(true);
    getLocation();
  };

  return {
    prayerTimes,
    hijriDate,
    loading,
    errorMsg,
    city,
    refreshing,
    refresh,
    coordinates // Added this
  };
};
