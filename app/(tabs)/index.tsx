import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import { Fonts } from "../../constants/theme";
import { useSettings } from "../../context/SettingsContext";
import { usePrayerTimes } from "../../hooks/usePrayerTimes";

import { translations } from "../../constants/i18n";

export default function Home() {
  const { themeColor, appLanguage, lastRead, theme, khatamPlan } =
    useSettings();
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: "Muslim ID" }} />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[themeColor]}
            tintColor={themeColor}
          />
        }
      >
        <LinearGradient
          colors={[themeColor, themeColor + "CC"]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.location}>
                <Ionicons name="location" size={16} color="#fff" /> {city}
              </Text>
            </View>
            <View style={styles.logoPlaceholder}>
              <Ionicons name="moon" size={32} color="rgba(255,255,255,0.8)" />
            </View>
          </View>

          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => router.push("/search")}
            activeOpacity={0.9}
          >
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <Text style={styles.searchText}>{t.home.searchPlaceholder}</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.cardContainer}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={themeColor}
              style={styles.loader}
            />
          ) : errorMsg ? (
            <Text style={[styles.errorText, { color: theme.textSecondary }]}>
              {errorMsg}
            </Text>
          ) : prayerState.next && prayerState.current ? (
            <View
              style={[
                styles.prayerCard,
                { backgroundColor: theme.card, shadowColor: theme.text },
              ]}
            >
              <View style={styles.prayerRow}>
                <View style={styles.prayerColumn}>
                  <Text style={styles.prayerLabel}>{t.home.now}</Text>
                  <Text style={[styles.prayerName, { color: themeColor }]}>
                    {prayerState.current.name}
                  </Text>
                  <Text style={[styles.prayerTime, { color: theme.text }]}>
                    {prayerState.current.time}
                  </Text>
                </View>

                <View
                  style={[styles.divider, { backgroundColor: theme.border }]}
                />

                <View style={styles.prayerColumn}>
                  <Text style={styles.prayerLabel}>{t.home.next}</Text>
                  <Text style={[styles.prayerName, { color: themeColor }]}>
                    {prayerState.next.name}
                  </Text>
                  <Text style={[styles.prayerTime, { color: theme.text }]}>
                    {prayerState.next.time}
                  </Text>
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
            <Text
              style={{ color: theme.text, textAlign: "center", marginTop: 20 }}
            >
              No prayer times available
            </Text>
          )}

          {/* Khatam Planner Widget */}
          <TouchableOpacity
            style={[
              styles.continueCard, // Reuse continue card style for consistency
              { backgroundColor: theme.card, shadowColor: theme.text },
            ]}
            onPress={() => {
              if (khatamPlan) {
                router.push("/khatam/log");
              } else {
                router.push("/khatam/setup");
              }
            }}
            activeOpacity={0.8}
          >
            <View style={styles.continueCardContent}>
              <View
                style={[
                  styles.continueIcon,
                  { backgroundColor: themeColor + "15" },
                ]}
              >
                <Ionicons name="book" size={24} color={themeColor} />
              </View>
              <View style={styles.continueInfo}>
                <Text style={styles.continueLabel}>{t.home.khatamPlanner}</Text>
                <Text style={[styles.continueSurah, { color: theme.text }]}>
                  {khatamPlan
                    ? `${t.khatam.days} ${
                        Math.ceil(
                          (Date.now() - khatamPlan.startDate) /
                            (1000 * 60 * 60 * 24),
                        ) || 1
                      } / ${khatamPlan.targetDays}`
                    : t.khatam.createPlan}
                </Text>
                <Text
                  style={[styles.continueAyah, { color: theme.textSecondary }]}
                >
                  {khatamPlan
                    ? `${t.khatam.goal}: ${Math.ceil(604 / khatamPlan.targetDays)} ${t.khatam.pagesTotal}`
                    : t.khatam.noPlan}
                </Text>
              </View>
              <View
                style={[
                  styles.arrowIcon,
                  { backgroundColor: theme.background },
                ]}
              >
                <Ionicons
                  name={khatamPlan ? "add" : "arrow-forward"}
                  size={16}
                  color={themeColor}
                />
              </View>
            </View>
            {khatamPlan && (
              <View style={{ marginTop: 12 }}>
                <View
                  style={{
                    height: 6,
                    backgroundColor: theme.background,
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      width: `${Math.min(
                        ((khatamPlan.currentPage || 0) / 604) * 100,
                        100,
                      )}%`,
                      height: "100%",
                      backgroundColor: themeColor,
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    color: theme.textSecondary,
                    marginTop: 4,
                    textAlign: "right",
                  }}
                >
                  {t.khatam.pagesCount.replace(
                    "{{count}}",
                    (khatamPlan.currentPage || 0).toString(),
                  )}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {lastRead && (
            <TouchableOpacity
              style={[
                styles.continueCard,
                { backgroundColor: theme.card, shadowColor: theme.text },
              ]}
              onPress={() => {
                if (lastRead.type === "surah") {
                  router.push(`/surah/${lastRead.id}`);
                } else {
                  router.push(`/juz/${lastRead.id}`);
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.continueCardContent}>
                <View
                  style={[
                    styles.continueIcon,
                    { backgroundColor: themeColor + "15" },
                  ]}
                >
                  <Ionicons name="book-outline" size={24} color={themeColor} />
                </View>
                <View style={styles.continueInfo}>
                  <Text style={styles.continueLabel}>
                    {t.home.continueReading}
                  </Text>
                  <Text style={[styles.continueSurah, { color: theme.text }]}>
                    {lastRead.surahName}
                  </Text>
                  <Text
                    style={[
                      styles.continueAyah,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {t.home.lastReadAt} {lastRead.ayah}
                  </Text>
                </View>
                <View
                  style={[
                    styles.arrowIcon,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Ionicons name="arrow-forward" size={16} color={themeColor} />
                </View>
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.menuGrid}>
            <TouchableOpacity
              style={[
                styles.menuCard,
                { backgroundColor: theme.card, shadowColor: theme.text },
              ]}
              onPress={() => router.push("/calendar")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#4CAF5020" },
                ]}
              >
                <Ionicons name="calendar" size={24} color="#4CAF50" />
              </View>
              <Text style={[styles.menuCardText, { color: theme.text }]}>
                {t.home.calendar}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuCard,
                { backgroundColor: theme.card, shadowColor: theme.text },
              ]}
              onPress={() => router.push("/qibla")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#2196F320" },
                ]}
              >
                <Ionicons name="compass" size={24} color="#2196F3" />
              </View>
              <Text style={[styles.menuCardText, { color: theme.text }]}>
                {t.home.qibla}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuCard,
                { backgroundColor: theme.card, shadowColor: theme.text },
              ]}
              onPress={() => router.push("/dua")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#FF980020" },
                ]}
              >
                <Ionicons name="heart" size={24} color="#FF9800" />
              </View>
              <Text style={[styles.menuCardText, { color: theme.text }]}>
                {t.home.dua}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuCard,
                { backgroundColor: theme.card, shadowColor: theme.text },
              ]}
              onPress={() => router.push("/bookmarks")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#9C27B020" },
                ]}
              >
                <Ionicons name="bookmark" size={24} color="#9C27B0" />
              </View>
              <Text style={[styles.menuCardText, { color: theme.text }]}>
                {t.home.bookmarks}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.menuCard,
                { backgroundColor: theme.card, shadowColor: theme.text },
              ]}
              onPress={() => router.push("/khatam/history")}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "#9C27B020" },
                ]}
              >
                <Ionicons name="medal" size={24} color="#9C27B0" />
              </View>
              <Text style={[styles.menuCardText, { color: theme.text }]}>
                {t.home.khatamJourney}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logoPlaceholder: {
    opacity: 0.8,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    color: "#666",
    fontSize: 15,
    fontFamily: Fonts.body,
  },
  greeting: {
    fontSize: 28,
    fontFamily: Fonts.heading,
    color: "#fff",
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    fontFamily: Fonts.body,
    color: "rgba(255,255,255,0.9)",
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  loader: {
    marginTop: 20,
  },
  prayerCard: {
    borderRadius: 20,
    padding: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 16,
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
    height: "100%",
    backgroundColor: "#eee",
    marginHorizontal: 15,
    opacity: 0.5,
  },
  prayerLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: Fonts.semiBold,
  },
  prayerName: {
    fontSize: 20,
    fontFamily: Fonts.heading,
    marginBottom: 2,
  },
  prayerTime: {
    fontSize: 16,
    fontFamily: Fonts.body,
    marginBottom: 8,
  },
  countdownBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  countdownText: {
    color: "#fff",
    fontFamily: Fonts.semiBold,
    fontSize: 12,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontFamily: Fonts.body,
  },
  continueCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  continueCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  continueIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  continueInfo: {
    flex: 1,
  },
  continueLabel: {
    fontSize: 11,
    color: "#999",
    fontFamily: Fonts.semiBold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  continueSurah: {
    fontSize: 17,
    fontFamily: Fonts.heading,
  },
  continueAyah: {
    fontSize: 13,
    marginTop: 2,
    fontFamily: Fonts.body,
  },
  arrowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  menuCard: {
    width: "48%", // 2x2 grid
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  menuCardText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    textAlign: "center",
  },
});
