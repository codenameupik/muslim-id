import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { usePrayerTimes } from '../hooks/usePrayerTimes';

export default function QiblaScreen() {
  const { themeColor } = useSettings();
  const { coordinates, loading: locationLoading, errorMsg: locationError } = usePrayerTimes();
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (coordinates) {
      fetchQiblaDirection(coordinates.lat, coordinates.lng);
    } else if (!locationLoading && locationError) {
        setLoading(false);
        setError(locationError);
    }
  }, [coordinates, locationLoading, locationError]);

  const fetchQiblaDirection = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://api.aladhan.com/v1/qibla/${lat}/${lng}`
      );
      const data = await response.json();
      if (data.code === 200) {
        setQiblaDirection(data.data.direction);
      } else {
        setError('Failed to fetch Qibla direction');
      }
    } catch (err) {
      console.error('Error fetching Qibla direction:', err);
      setError('Error connecting to service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Qibla Direction' }} />
      
      {loading || locationLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={themeColor} />
          <Text style={[styles.statusText, { color: themeColor }]}>Calculating Qibla...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle" size={48} color="red" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.directionContainer}>
            <Text style={[styles.directionValue, { color: themeColor }]}>
              {qiblaDirection ? Math.round(qiblaDirection) : '--'}°
            </Text>
            <Text style={styles.directionLabel}>from North</Text>
          </View>

          <View style={styles.compassContainer}>
             {/* Simple representation of compass */}
             <View style={[styles.compassRing, { borderColor: themeColor }]}>
                <View style={[styles.northMarker, { backgroundColor: themeColor }]} />
                {qiblaDirection !== null && (
                    <View 
                        style={[
                            styles.qiblaPointer, 
                            { 
                                transform: [{ rotate: `${qiblaDirection}deg` }],
                                backgroundColor: themeColor 
                            }
                        ]} 
                    >
                        <Ionicons name="navigate" size={32} color="#fff" style={styles.pointerIcon} />
                    </View>
                )}
             </View>
             <Text style={styles.noteText}>
                Rotate your phone until the arrow points up to face the Qibla.
             </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
  },
  directionContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  directionValue: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  directionLabel: {
    fontSize: 18,
    color: '#666',
  },
  compassContainer: {
    alignItems: 'center',
  },
  compassRing: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  northMarker: {
    width: 4,
    height: 20,
    position: 'absolute',
    top: 0,
  },
  qiblaPointer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    // We want the arrow to point from center to the direction
    // This is a simplified visualization
  },
  pointerIcon: {
    transform: [{ rotate: '-45deg' }] // Adjust icon orientation if needed
  },
  noteText: {
    marginTop: 30,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 40,
  }
});
