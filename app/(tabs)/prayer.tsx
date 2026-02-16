import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { translations } from "../../constants/i18n";
import { useSettings } from "../../context/SettingsContext";
import { usePrayerTimes } from "../../hooks/usePrayerTimes";

export default function PrayerScreen() {
  const { themeColor, appLanguage } = useSettings();
  const t = translations[appLanguage];
  const {
    prayerTimes,
    hijriDate,
    loading,
    errorMsg,
    city,
    refreshing,
    refresh,
  } = usePrayerTimes();

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColor} />
        <Text style={[styles.loadingText, { color: themeColor }]}>
          {t.prayer.loading}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          colors={[themeColor]}
        />
      }
    >
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <Text style={styles.cityText}>
          {city === "Locating..."
            ? t.prayer.locating
            : city === "Unknown Location"
              ? t.prayer.unknownLocation
              : city.includes("(Default)")
                ? city.replace("(Default)", `(${t.common.loading})`) // Or just city
                : city}
        </Text>
        {hijriDate && (
          <Text style={styles.dateText}>
            {hijriDate.day}{" "}
            {appLanguage === "en" ? hijriDate.month.en : hijriDate.month.ar}{" "}
            {hijriDate.year}
          </Text>
        )}
        <Text style={styles.gregorianText}>
          {new Date().toLocaleDateString(
            appLanguage === "en" ? "en-US" : "id-ID",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          )}
        </Text>
      </View>

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {errorMsg ===
            "Permission to access location was denied. Showing default location (Jakarta)."
              ? t.prayer.permissionDenied
              : errorMsg === "Failed to fetch prayer times"
                ? t.prayer.errorFetch
                : errorMsg === "Error getting location"
                  ? t.prayer.errorLocation
                  : errorMsg}
          </Text>
        </View>
      )}

      <View style={styles.timesContainer}>
        {prayerTimes && (
          <>
            <PrayerItem
              name={t.prayer.fajr}
              time={prayerTimes.Fajr}
              icon="moon-outline"
              themeColor={themeColor}
            />
            <PrayerItem
              name={t.prayer.sunrise}
              time={prayerTimes.Sunrise}
              icon="sunny-outline"
              themeColor={themeColor}
            />
            <PrayerItem
              name={t.prayer.dhuhr}
              time={prayerTimes.Dhuhr}
              icon="sunny"
              themeColor={themeColor}
            />
            <PrayerItem
              name={t.prayer.asr}
              time={prayerTimes.Asr}
              icon="partly-sunny"
              themeColor={themeColor}
            />
            <PrayerItem
              name={t.prayer.maghrib}
              time={prayerTimes.Maghrib}
              icon="cloudy-night"
              themeColor={themeColor}
            />
            <PrayerItem
              name={t.prayer.isha}
              time={prayerTimes.Isha}
              icon="moon"
              themeColor={themeColor}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const PrayerItem = ({
  name,
  time,
  icon,
  themeColor,
}: {
  name: string;
  time: string;
  icon: any;
  themeColor: string;
}) => (
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
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    padding: 30,
    paddingTop: 60,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cityText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 5,
  },
  gregorianText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
  errorContainer: {
    padding: 15,
    backgroundColor: "#ffebee",
    margin: 15,
    borderRadius: 8,
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
  timesContainer: {
    padding: 15,
  },
  prayerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  prayerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 15,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  prayerTime: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
