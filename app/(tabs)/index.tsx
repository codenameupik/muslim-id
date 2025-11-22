import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../../context/SettingsContext';
import { usePrayerTimes } from '../../hooks/usePrayerTimes';

export default function Home() {
  const { themeColor } = useSettings();
  const { prayerTimes, loading, errorMsg, city, refreshing, refresh } = usePrayerTimes();
  const [nearestPrayer, setNearestPrayer] = useState<{ name: string; time: string; diff: number } | null>(null);

  useEffect(() => {
    if (prayerTimes) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const prayers = [
        { name: 'Fajr', time: prayerTimes.Fajr },
        { name: 'Sunrise', time: prayerTimes.Sunrise },
        { name: 'Dhuhr', time: prayerTimes.Dhuhr },
        { name: 'Asr', time: prayerTimes.Asr },
        { name: 'Maghrib', time: prayerTimes.Maghrib },
        { name: 'Isha', time: prayerTimes.Isha },
      ];

      let nextPrayer = null;
      let minDiff = Infinity;

      // Convert prayer time string (HH:MM) to minutes
      const getMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };

      // Find the next prayer
      for (const prayer of prayers) {
        const prayerMinutes = getMinutes(prayer.time);
        let diff = prayerMinutes - currentTime;
        
        if (diff < 0) {
          // Prayer has passed for today, consider it for tomorrow (add 24 hours)
          diff += 24 * 60;
        }

        if (diff < minDiff) {
          minDiff = diff;
          nextPrayer = { ...prayer, diff };
        }
      }

      setNearestPrayer(nextPrayer);
    }
  }, [prayerTimes]);

  const formatTimeDiff = (diff: number) => {
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[themeColor]} />
      }
    >
      <Stack.Screen options={{ title: 'Muslim ID' }} />
      
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <Text style={styles.greeting}>Assalamu&apos;alaikum</Text>
        <Text style={styles.location}><Ionicons name="location" size={16} color="#fff" /> {city}</Text>
      </View>

      <View style={styles.cardContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={themeColor} />
        ) : errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : nearestPrayer ? (
          <View style={styles.prayerCard}>
            <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
            <Text style={[styles.prayerName, { color: themeColor }]}>{nearestPrayer.name}</Text>
            <Text style={styles.prayerTime}>{nearestPrayer.time}</Text>
            <View style={[styles.countdownBadge, { backgroundColor: themeColor }]}>
              <Text style={styles.countdownText}>in {formatTimeDiff(nearestPrayer.diff)}</Text>
            </View>
          </View>
        ) : (
          <Text>No prayer times available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 30,
    paddingTop: 20,
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  cardContainer: {
    padding: 20,
    marginTop: -40,
  },
  prayerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextPrayerLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  prayerName: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  prayerTime: {
    fontSize: 48,
    fontWeight: '300',
    color: '#333',
    marginBottom: 20,
  },
  countdownBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  countdownText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
