import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSettings } from "../../context/SettingsContext";
import { usePrayerTimes } from "../../hooks/usePrayerTimes";

import { translations } from "../../constants/i18n";

export default function Home() {
  const { themeColor, appLanguage, lastRead } = useSettings();
  const router = useRouter();
  const { prayerTimes, loading, errorMsg, city, refreshing, refresh } =
    usePrayerTimes();
  const t = translations[appLanguage];
  const [prayerState, setPrayerState] = useState<{
    current: { name: string; time: string } | null;
    next: { name: string; time: string; diff: number } | null;
  }>({ current: null, next: null });

  useEffect(() => {
    if (prayerTimes) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const prayers = [
        { name: "Fajr", time: prayerTimes.Fajr },
        { name: "Sunrise", time: prayerTimes.Sunrise },
        { name: "Dhuhr", time: prayerTimes.Dhuhr },
        { name: "Asr", time: prayerTimes.Asr },
        { name: "Maghrib", time: prayerTimes.Maghrib },
        { name: "Isha", time: prayerTimes.Isha },
      ];

      const getMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
      };

      let nextIndex = -1;
      let minDiff = Infinity;

      // Find next prayer
      for (let i = 0; i < prayers.length; i++) {
        const prayerMinutes = getMinutes(prayers[i].time);
        const diff = prayerMinutes - currentTime;

        if (diff > 0 && diff < minDiff) {
          minDiff = diff;
          nextIndex = i;
        }
      }

      let current, next;

      if (nextIndex !== -1) {
        // Found a next prayer today
        next = { ...prayers[nextIndex], diff: minDiff };
        // Current is the one before
        const currentIndex = (nextIndex - 1 + prayers.length) % prayers.length;
        current = prayers[currentIndex];
      } else {
        // Next prayer is Fajr tomorrow
        const fajrMinutes = getMinutes(prayers[0].time);
        const diff = 24 * 60 - currentTime + fajrMinutes;
        next = { ...prayers[0], diff };
        // Current is Isha (last one)
        current = prayers[prayers.length - 1];
      }

      setPrayerState({ current, next });
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
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          colors={[themeColor]}
        />
      }
    >
      <Stack.Screen options={{ title: "Muslim ID" }} />

      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push("/search")}
        >
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <Text style={styles.searchText}>{t.home.searchPlaceholder}</Text>
        </TouchableOpacity>

        <Text style={styles.greeting}>{t.home.greeting}</Text>
        <Text style={styles.location}>
          <Ionicons name="location" size={16} color="#fff" /> {city}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={themeColor} />
        ) : errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : prayerState.next && prayerState.current ? (
          <View style={styles.prayerCard}>
            <View style={styles.prayerRow}>
              <View style={styles.prayerColumn}>
                <Text style={styles.prayerLabel}>{t.home.now}</Text>
                <Text style={[styles.prayerName, { color: themeColor }]}>
                  {prayerState.current.name}
                </Text>
                <Text style={styles.prayerTime}>
                  {prayerState.current.time}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.prayerColumn}>
                <Text style={styles.prayerLabel}>{t.home.next}</Text>
                <Text style={[styles.prayerName, { color: themeColor }]}>
                  {prayerState.next.name}
                </Text>
                <Text style={styles.prayerTime}>{prayerState.next.time}</Text>
                <View
                  style={[
                    styles.countdownBadge,
                    { backgroundColor: themeColor },
                  ]}
                >
                  <Text style={styles.countdownText}>
                    - {formatTimeDiff(prayerState.next.diff)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <Text>No prayer times available</Text>
        )}

        {lastRead && (
          <TouchableOpacity
            style={styles.continueCard}
            onPress={() => {
              if (lastRead.type === "surah") {
                router.push(`/surah/${lastRead.id}`);
              } else {
                router.push(`/juz/${lastRead.id}`);
              }
            }}
          >
            <View style={styles.continueCardContent}>
              <View
                style={[
                  styles.continueIcon,
                  { backgroundColor: themeColor + "20" },
                ]}
              >
                <Ionicons name="bookmark" size={24} color={themeColor} />
              </View>
              <View style={styles.continueInfo}>
                <Text style={styles.continueLabel}>
                  {t.home.continueReading}
                </Text>
                <Text style={styles.continueSurah}>{lastRead.surahName}</Text>
                <Text style={styles.continueAyah}>
                  {t.home.lastReadAt} {lastRead.ayah}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={themeColor} />
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: themeColor }]}
          onPress={() => router.push("/calendar")}
        >
          <Ionicons name="calendar" size={24} color="#fff" />
          <Text style={styles.menuButtonText}>{t.home.calendar}</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: themeColor }]}
          onPress={() => router.push("/qibla")}
        >
          <Ionicons name="compass" size={24} color="#fff" />
          <Text style={styles.menuButtonText}>{t.home.qibla}</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: themeColor }]}
          onPress={() => router.push("/dua")}
        >
          <Ionicons name="book" size={24} color="#fff" />
          <Text style={styles.menuButtonText}>{t.home.dua}</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    marginTop: 30, // Added top margin for spacing from status bar
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    color: "#999",
    fontSize: 14,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  cardContainer: {
    padding: 20,
    marginTop: -40,
  },
  prayerCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  prayerColumn: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#eee",
    marginHorizontal: 15,
    alignSelf: "center",
  },
  prayerLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "600",
  },
  prayerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  prayerTime: {
    fontSize: 20,
    fontWeight: "300",
    color: "#333",
    marginBottom: 10,
  },
  countdownBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countdownText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  menuButtonText: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
  },
  continueCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  continueCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  continueIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  continueInfo: {
    flex: 1,
  },
  continueLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  continueSurah: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  continueAyah: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
