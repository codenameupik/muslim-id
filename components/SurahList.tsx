import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
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
  const { themeColor, lastRead, theme } = useSettings();
  const [viewMode, setViewMode] = useState<"surah" | "juz">("surah");

  const juzData = useMemo(() => {
    return juzInfo.map((juz: JuzInfo) => {
      // We don't strictly need to filter surahs anymore if we are just linking to the Juz view,
      // but keeping it doesn't hurt if we want to display count or something later.
      // Actually, renderJuzItem doesn't use item.surahs anymore.
      // So we can simplify this.
      return juz;
    });
  }, []);

  const renderSurahItem = ({ item }: { item: Surah }) => (
    <Link href={`/surah/${item.index}`} asChild>
      <TouchableOpacity
        style={[
          styles.item,
          { backgroundColor: theme.card, borderBottomColor: theme.border },
        ]}
        activeOpacity={0.7}
      >
        <View
          style={[styles.numberBadge, { backgroundColor: themeColor + "15" }]}
        >
          <Text style={[styles.number, { color: themeColor }]}>
            {item.index}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {item.count} Verses
          </Text>
        </View>
        {lastRead &&
          lastRead.type === "surah" &&
          lastRead.id === item.index && (
            <Ionicons
              name="bookmark"
              size={18}
              color={themeColor}
              style={{ marginRight: 12 }}
            />
          )}
        <Text style={[styles.arabic, { color: themeColor }]}>
          {item.titleAr}
        </Text>
      </TouchableOpacity>
    </Link>
  );

  const renderJuzItem = ({ item }: { item: JuzInfo }) => {
    const juzNum = parseInt(item.index, 10);
    const isBookmarked =
      lastRead && lastRead.type === "juz" && lastRead.id === juzNum.toString();
    return (
      <Link href={`/juz/${juzNum}`} asChild>
        <TouchableOpacity
          style={[
            styles.juzContainer,
            { backgroundColor: theme.card, borderBottomColor: theme.border },
          ]}
          activeOpacity={0.7}
        >
          <View style={styles.juzIconContainer}>
            <View
              style={[styles.juzIconRing, { borderColor: themeColor + "40" }]}
            >
              <Text style={[styles.juzNumber, { color: themeColor }]}>
                {juzNum}
              </Text>
            </View>
          </View>

          <View style={styles.juzInfo}>
            <Text style={[styles.juzTitle, { color: theme.text }]}>
              Juz {juzNum}
            </Text>
            <Text style={[styles.juzSubtitle, { color: theme.textSecondary }]}>
              {item.start.name} {item.start.verse.replace("verse_", "")} -{" "}
              {item.end.name} {item.end.verse.replace("verse_", "")}
            </Text>
          </View>
          {isBookmarked && (
            <Ionicons
              name="bookmark"
              size={18}
              color={themeColor}
              style={{ marginRight: 8 }}
            />
          )}
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.textSecondary}
          />
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
    paddingBottom: 40,
  },
  toggleContainer: {
    flexDirection: "row",
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  activeToggle: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  toggleText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  number: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.heading,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Fonts.body,
  },
  arabic: {
    fontSize: 24,
    fontFamily: Fonts.arabic,
  },
  juzContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  juzIconContainer: {
    marginRight: 16,
  },
  juzIconRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  juzNumber: {
    fontFamily: Fonts.heading,
    fontSize: 14,
  },
  juzInfo: {
    flex: 1,
  },
  juzTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading,
  },
  juzSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: Fonts.body,
  },
});

export default SurahList;
