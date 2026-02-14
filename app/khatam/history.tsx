import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { translations } from "../../constants/i18n";
import { Fonts } from "../../constants/theme";
import { KhatamPlan, useSettings } from "../../context/SettingsContext";

export default function KhatamHistory() {
  const { theme, themeColor, completedKhatams, appLanguage } = useSettings();
  const t = translations[appLanguage];

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderItem = ({ item }: { item: KhatamPlan }) => {
    const duration = item.endDate
      ? Math.ceil((item.endDate - item.startDate) / (1000 * 60 * 60 * 24))
      : item.targetDays;

    return (
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.cardHeader}>
          <View
            style={[styles.iconBadge, { backgroundColor: themeColor + "20" }]}
          >
            <Ionicons name="checkmark-circle" size={24} color={themeColor} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {t.khatam.completedKhatam}
            </Text>
            <Text style={[styles.cardDate, { color: theme.textSecondary }]}>
              {formatDate(item.startDate)} -{" "}
              {item.endDate ? formatDate(item.endDate) : "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t.khatam.duration}
            </Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {duration} {t.khatam.days}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t.khatam.goal}
            </Text>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {item.targetDays} {t.khatam.days}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              {t.khatam.pages}
            </Text>
            <Text style={[styles.statValue, { color: theme.text }]}>604</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t.khatam.historyTitle,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: Fonts.heading },
        }}
      />

      <FlatList
        data={completedKhatams}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="book-outline"
              size={64}
              color={theme.textSecondary}
            />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {t.khatam.journeyEmpty}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
  cardDate: {
    fontSize: 12,
    fontFamily: Fonts.body,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
    justifyContent: "space-between",
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: Fonts.semiBold,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: Fonts.heading,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.body,
    marginTop: 16,
    textAlign: "center",
  },
});
