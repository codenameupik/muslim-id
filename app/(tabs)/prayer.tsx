import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../../context/SettingsContext';

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface HijriDate {
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

export default function PrayerScreen() {
  const { themeColor } = useSettings();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [city, setCity] = useState<string>('Locating...');

  const fetchPrayerTimes = async (lat: number, lng: number) => {
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

  const onRefresh = () => {
    setRefreshing(true);
    getLocation();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColor} />
        <Text style={[styles.loadingText, { color: themeColor }]}>Getting Prayer Times...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[themeColor]} />
      }
    >
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <Text style={styles.cityText}>{city}</Text>
        {hijriDate && (
          <Text style={styles.dateText}>
            {hijriDate.day} {hijriDate.month.en} {hijriDate.year}
          </Text>
        )}
        <Text style={styles.gregorianText}>{new Date().toDateString()}</Text>
      </View>

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      <View style={styles.timesContainer}>
        {prayerTimes && (
          <>
            <PrayerItem name="Fajr" time={prayerTimes.Fajr} icon="moon-outline" themeColor={themeColor} />
            <PrayerItem name="Sunrise" time={prayerTimes.Sunrise} icon="sunny-outline" themeColor={themeColor} />
            <PrayerItem name="Dhuhr" time={prayerTimes.Dhuhr} icon="sunny" themeColor={themeColor} />
            <PrayerItem name="Asr" time={prayerTimes.Asr} icon="partly-sunny" themeColor={themeColor} />
            <PrayerItem name="Maghrib" time={prayerTimes.Maghrib} icon="cloudy-night" themeColor={themeColor} />
            <PrayerItem name="Isha" time={prayerTimes.Isha} icon="moon" themeColor={themeColor} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const PrayerItem = ({ name, time, icon, themeColor }: { name: string, time: string, icon: any, themeColor: string }) => (
  <View style={styles.prayerItem}>
    <View style={styles.prayerInfo}>
      <Ionicons name={icon} size={24} color={themeColor} style={styles.icon} />
      <Text style={styles.prayerName}>{name}</Text>
    </View>
    <Text style={[styles.prayerTime, { color: themeColor }]}>{time}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cityText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 5,
  },
  gregorianText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#ffebee',
    margin: 15,
    borderRadius: 8,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  timesContainer: {
    padding: 15,
  },
  prayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  prayerTime: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
