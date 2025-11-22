import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';

import { translations } from '../constants/i18n';

interface CalendarDay {
  gregorian: {
    date: string;
    day: string;
    weekday: {
      en: string;
    };
  };
  hijri: {
    date: string;
    day: string;
    month: {
      en: string;
      ar: string;
    };
    year: string;
  };
}

export default function CalendarScreen() {
  const { themeColor, appLanguage } = useSettings();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const t = translations[appLanguage];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const fetchCalendarData = async (month: number, year: number) => {
    setLoading(true);
    try {
      // API expects month index 1-12
      const response = await fetch(
        `http://api.aladhan.com/v1/gToHCalendar/${month + 1}/${year}`
      );
      const data = await response.json();
      if (data.code === 200) {
        setCalendarData(data.data);
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData(currentDate.getMonth(), currentDate.getFullYear());
  }, [currentDate]);

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const renderDay = ({ item }: { item: CalendarDay }) => {
    // Simple check to align days, API returns sequential days of month
    // We might need to add empty placeholders for start of month if we want a true calendar grid
    // For now, let's just list them or try a simple grid
    return (
      <View style={[styles.dayCell, { borderColor: themeColor + '40' }]}>
        <Text style={[styles.gregorianDay, { color: themeColor }]}>{item.gregorian.day}</Text>
        <Text style={[styles.hijriDay, { color: themeColor }]}>{item.hijri.day}</Text>
        <Text style={styles.hijriMonth}>{item.hijri.month.en}</Text>
      </View>
    );
  };

  // Helper to pad the start of the month
  const getPaddingDays = () => {
    if (calendarData.length === 0) return 0;
    const firstDay = calendarData[0].gregorian.weekday.en;
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days.indexOf(firstDay);
  };

  const paddingDays = getPaddingDays();
  const paddedData = [...Array(paddingDays).fill(null), ...calendarData];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t.calendar.title }} />
      
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <Text key={day} style={[styles.weekDayText, { color: themeColor }]}>{day}</Text>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themeColor} />
        </View>
      ) : (
        <FlatList
          data={paddedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            if (!item) return <View style={[styles.dayCell, { borderColor: themeColor + '40' }]} />;
            return renderDay({ item });
          }}
          numColumns={7}
          contentContainerStyle={styles.grid}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  weekDayText: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    paddingBottom: 20,
  },
  dayCell: {
    width: '14.28%', // 100% / 7
    aspectRatio: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    padding: 2,
  },
  gregorianDay: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hijriDay: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  hijriMonth: {
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
  },
});
