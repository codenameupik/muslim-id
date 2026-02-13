import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import juzInfo from "../assets/quran/juz.json";
import surahData from "../assets/quran/surah.json";
import { Fonts } from "../constants/theme";
import { useSettings } from "../context/SettingsContext";

interface Surah {
  index: string;
  title: string;
  titleAr: string;
  count: number;
  juz: { index: string }[];
}

interface JuzInfo {
  index: string;
  start: { index: string; verse: string; name: string };
  end: { index: string; verse: string; name: string };
}

const SurahList = () => {
  // Theme color from settings
  const { themeColor, lastRead, theme, bookmarks } = useSettings();
  const [viewMode, setViewMode] = useState<"surah" | "juz">("juz");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const juzData = useMemo(() => {
    return juzInfo.map((juz: JuzInfo) => {
      // We don't strictly need to filter surahs anymore if we are just linking to the Juz view,
      // but keeping it doesn't hurt if we want to display count or something later.
      // Actually, renderJuzItem doesn't use item.surahs anymore.
      // So we can simplify this.
      return juz;
    });
  }, []);

  const renderSurahItem = ({ item }: { item: Surah }) => {
    const hasBookmarks = bookmarks.some((b) => b.surahIndex === item.index);

    return (
      <Link href={`/surah/${item.index}`} asChild>
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              shadowColor: theme.text,
              shadowOpacity: isDark ? 0.3 : 0.08,
            },
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <View
              style={[styles.numberBadgeContainer, { borderColor: themeColor }]}
            >
              <View
                style={[
                  styles.numberBadge,
                  { backgroundColor: themeColor + "15" },
                ]}
              >
                <Text style={[styles.number, { color: themeColor }]}>
                  {item.index}
                </Text>
              </View>
            </View>

            <View style={styles.info}>
              <Text style={[styles.title, { color: theme.text }]}>
                {item.title}
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {item.count} Verses
              </Text>
            </View>

            <View style={styles.rightContent}>
              <Text style={[styles.arabic, { color: themeColor }]}>
                {item.titleAr}
              </Text>
              <View style={{ flexDirection: "row", gap: 4 }}>
                {hasBookmarks && (
                  <View
                    style={[
                      styles.bookmarkBadge,
                      { backgroundColor: themeColor + "10" },
                    ]}
                  >
                    <Ionicons name="bookmark" size={14} color={themeColor} />
                  </View>
                )}
                {lastRead &&
                  lastRead.type === "surah" &&
                  lastRead.id === item.index && (
                    <View
                      style={[
                        styles.bookmarkBadge,
                        { backgroundColor: themeColor + "20" },
                      ]}
                    >
                      <Ionicons name="glasses" size={14} color={themeColor} />
                    </View>
                  )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  const renderJuzItem = ({ item }: { item: JuzInfo }) => {
    const juzNum = parseInt(item.index, 10);
    const isLastRead =
      lastRead && lastRead.type === "juz" && lastRead.id === juzNum.toString();
    return (
      <Link href={`/juz/${juzNum}`} asChild>
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              shadowColor: theme.text,
              shadowOpacity: isDark ? 0.3 : 0.08,
            },
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.cardContent}>
            <View style={[styles.juzIconRing, { borderColor: themeColor }]}>
              <Text style={[styles.juzNumber, { color: themeColor }]}>
                {juzNum}
              </Text>
            </View>

            <View style={styles.juzInfo}>
              <Text style={[styles.juzTitle, { color: theme.text }]}>
                Juz {juzNum}
              </Text>
              <View
                style={[
                  styles.verseRangeContainer,
                  { backgroundColor: theme.background },
                ]}
              >
                <Text
                  style={[styles.juzSubtitle, { color: theme.textSecondary }]}
                >
                  {item.start.name} {item.start.verse.replace("verse_", "")} -{" "}
                  {item.end.name} {item.end.verse.replace("verse_", "")}
                </Text>
              </View>
            </View>

            {isLastRead && (
              <View
                style={[
                  styles.bookmarkBadge,
                  { backgroundColor: themeColor + "20" },
                ]}
              >
                <Ionicons name="glasses" size={14} color={themeColor} />
              </View>
            )}
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.toggleContainer, { backgroundColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "juz" && [
              styles.activeToggle,
              { backgroundColor: theme.card },
            ],
          ]}
          onPress={() => setViewMode("juz")}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "juz"
                ? { color: themeColor }
                : { color: theme.textSecondary },
            ]}
          >
            Juz
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "surah" && [
              styles.activeToggle,
              { backgroundColor: theme.card },
            ],
          ]}
          onPress={() => setViewMode("surah")}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "surah"
                ? { color: themeColor }
                : { color: theme.textSecondary },
            ]}
          >
            Surah
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === "surah" ? (
        <FlatList
          data={surahData}
          keyExtractor={(item) => item.index}
          renderItem={renderSurahItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={juzData}
          keyExtractor={(item) => item.index}
          renderItem={renderJuzItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    margin: 16,
    borderRadius: 25, // More rounded, pill shape
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  activeToggle: {
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  toggleText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
  },
  // Card Styles
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  numberBadgeContainer: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 10, // Slightly rounded square for a modern look
    transform: [{ rotate: "45deg" }], // Diamond shape effect
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontFamily: Fonts.heading,
    fontSize: 14,
    transform: [{ rotate: "-45deg" }], // Rotate text back
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontFamily: Fonts.heading,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Fonts.body,
  },
  rightContent: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  arabic: {
    fontSize: 26,
    fontFamily: Fonts.arabicBold,
    marginBottom: 4,
  },
  bookmarkBadge: {
    padding: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  // Juz Specific
  juzIconRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "transparent",
    borderStyle: "dotted", // Dotted border for a distinct look
  },
  juzNumber: {
    fontFamily: Fonts.heading,
    fontSize: 16,
  },
  juzInfo: {
    flex: 1,
  },
  juzTitle: {
    fontSize: 17,
    fontFamily: Fonts.heading,
    marginBottom: 6,
  },
  verseRangeContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  juzSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.body,
  },
});

export default SurahList;
