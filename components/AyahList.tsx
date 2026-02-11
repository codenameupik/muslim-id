import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
    ViewToken,
} from "react-native";
import surahMap from "../assets/quran/map";
import enMap from "../assets/quran/translation/en/map";
import idMap from "../assets/quran/translation/id/map";
import { useSettings } from "../context/SettingsContext";

interface SurahDetail {
  index: string;
  name: string;
  verse: { [key: string]: string };
  count: number;
}

interface AyahListProps {
  surahIndex: string;
}

interface TranslationDetail {
  name: string;
  index: string;
  verse: { [key: string]: string };
}

const AyahList: React.FC<AyahListProps> = ({ surahIndex }) => {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [translation, setTranslation] = useState<TranslationDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const {
    language,
    themeColor,
    arabicFontSize,
    translationFontSize,
    setLastRead,
  } = useSettings();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load Surah (Arabic)
        const surahData = surahMap[surahIndex];
        if (surahData) {
          setSurah(surahData);
        }

        // Load Translation if selected
        if (language) {
          const map = language === "en" ? enMap : idMap;
          const transData = map[surahIndex];
          if (transData) {
            setTranslation(transData);
          }
        } else {
          setTranslation(null);
        }
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [surahIndex, language]);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!surah || viewableItems.length === 0) return;
      const lastVisible = viewableItems[viewableItems.length - 1];
      if (lastVisible?.item?.id && lastVisible.item.id !== "verse_0") {
        const ayahNum = parseInt(lastVisible.item.id.replace("verse_", ""), 10);
        setLastRead({
          type: "surah",
          id: surahIndex,
          surahName: surah.name,
          ayah: ayahNum,
          timestamp: Date.now(),
        });
      }
    },
    [surah, surahIndex, setLastRead],
  );

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.loader}
        size="large"
        color={themeColor}
      />
    );
  }

  if (!surah) {
    return <Text style={styles.error}>Surah not found</Text>;
  }

  const verses = Object.entries(surah.verse).map(([key, text]) => ({
    id: key,
    text,
    translation: translation?.verse[key],
  }));

  return (
    <FlatList
      data={verses}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <View style={styles.item}>
          <View style={styles.header}>
            {item.id !== "verse_0" && (
              <View
                style={[
                  styles.numberBadge,
                  { backgroundColor: themeColor + "20" },
                ]}
              >
                <Text style={[styles.number, { color: themeColor }]}>
                  {item.id.replace("verse_", "")}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.arabic, { fontSize: arabicFontSize }]}>
            {item.text}
          </Text>
          {item.translation && (
            <Text
              style={[styles.translation, { fontSize: translationFontSize }]}
            >
              {item.translation}
            </Text>
          )}
        </View>
      )}
      contentContainerStyle={styles.list}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
  item: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 12,
    fontWeight: "bold",
  },
  arabic: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: "right",
    color: "#000",
    fontFamily: "System",
    marginBottom: 8,
  },
  translation: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    textAlign: "left",
  },
});

export default AyahList;
