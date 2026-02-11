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
  const { themeColor } = useSettings();
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
      <TouchableOpacity style={styles.item}>
        <View
          style={[styles.numberBadge, { backgroundColor: themeColor + "20" }]}
        >
          <Text style={[styles.number, { color: themeColor }]}>
            {item.index}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.count} Verses</Text>
        </View>
        <Text style={[styles.arabic, { color: themeColor }]}>
          {item.titleAr}
        </Text>
      </TouchableOpacity>
    </Link>
  );

  const renderJuzItem = ({ item }: { item: JuzInfo }) => {
    return (
      <Link href={`/juz/${parseInt(item.index, 10)}`} asChild>
        <TouchableOpacity style={styles.juzContainer}>
          <View style={styles.juzInfo}>
            <Text style={[styles.juzTitle, { color: themeColor }]}>
              Juz {parseInt(item.index, 10)}
            </Text>
            <Text style={styles.juzSubtitle}>
              {item.start.name} {item.start.verse.replace("verse_", "")} -{" "}
              {item.end.name} {item.end.verse.replace("verse_", "")}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={themeColor} />
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "juz" && { backgroundColor: themeColor },
          ]}
          onPress={() => setViewMode("juz")}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "juz" ? styles.activeText : { color: themeColor },
            ]}
          >
            Juz
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "surah" && { backgroundColor: themeColor },
          ]}
          onPress={() => setViewMode("surah")}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "surah" ? styles.activeText : { color: themeColor },
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
        />
      ) : (
        <FlatList
          data={juzData}
          keyExtractor={(item) => item.index}
          renderItem={renderJuzItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  toggleContainer: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  toggleText: {
    fontWeight: "bold",
  },
  activeText: {
    color: "#fff",
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
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  number: {
    fontWeight: "bold",
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
  },
  arabic: {
    fontSize: 20,
    fontFamily: "System",
  },
  juzContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  juzInfo: {
    flex: 1,
  },
  juzTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  juzSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});

export default SurahList;
