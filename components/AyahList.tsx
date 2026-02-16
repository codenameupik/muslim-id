import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
} from "react-native";
import surahMap from "../assets/quran/map";
import enMap from "../assets/quran/translation/en/map";
import idMap from "../assets/quran/translation/id/map";
import { Fonts } from "../constants/theme";
import { useSettings } from "../context/SettingsContext";
import { isMoreAdvanced } from "../utils/quranUtils";

interface SurahDetail {
  index: string;
  name: string;
  verse: { [key: string]: string };
  count: number;
}

interface AyahListProps {
  surahIndex: string;
  targetAyah?: string;
}

interface TranslationDetail {
  name: string;
  index: string;
  verse: { [key: string]: string };
}

const AyahList: React.FC<AyahListProps> = ({ surahIndex, targetAyah }) => {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [translation, setTranslation] = useState<TranslationDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const {
    language,
    themeColor,
    arabicFontSize,
    translationFontSize,
    setLastRead,
    lastRead,
    isBookmarked,
    addBookmark,
    removeBookmark,
    theme,
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

  const verses = React.useMemo(() => {
    if (!surah) return [];
    return Object.entries(surah.verse).map(([key, text]) => ({
      id: key,
      text,
      translation: translation?.verse[key],
    }));
  }, [surah, translation]);

  // Scroll to target ayat if specified
  useEffect(() => {
    if (verses.length > 0 && targetAyah && flatListRef.current) {
      const targetIndex = verses.findIndex(
        (v) => v.id === `verse_${targetAyah}`,
      );

      if (targetIndex !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: targetIndex,
            animated: true,
            viewPosition: 0.2,
          });
        }, 100);
      }
    }
  }, [verses, targetAyah]);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!surah || viewableItems.length === 0) return;
      const lastVisible = viewableItems[viewableItems.length - 1];
      if (lastVisible?.item?.id && lastVisible.item.id !== "verse_0") {
        const ayahNum = parseInt(lastVisible.item.id.replace("verse_", ""), 10);
        const newPosition = {
          type: "surah" as const,
          id: surahIndex,
          surahName: surah.name,
          ayah: ayahNum,
          surahIndex: surahIndex, // Add surah index
          timestamp: Date.now(),
        };

        // Only update if more advanced
        if (isMoreAdvanced(newPosition, lastRead)) {
          setLastRead(newPosition);
        }
      }
    },
    [surah, surahIndex, setLastRead, lastRead],
  );

  const toggleBookmark = (ayahNum: number) => {
    if (!surah) return;
    const bookmarkId = `${surahIndex}_${ayahNum}`;
    const bookmarked = isBookmarked(surahIndex, ayahNum);

    if (bookmarked) {
      removeBookmark(bookmarkId);
    } else {
      addBookmark({
        id: bookmarkId,
        surahIndex,
        surahName: surah.name,
        ayah: ayahNum,
        timestamp: Date.now(),
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={themeColor} />
      </View>
    );
  }

  if (!surah) {
    return <Text style={styles.error}>Surah not found</Text>;
  }

  return (
    <FlatList
      ref={flatListRef}
      data={verses}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => {
        const ayahNum =
          item.id === "verse_0"
            ? 0
            : parseInt(item.id.replace("verse_", ""), 10);
        const bookmarked =
          ayahNum > 0 ? isBookmarked(surahIndex, ayahNum) : false;

        return (
          <View
            style={[
              styles.item,
              {
                borderBottomColor: theme.border,
                backgroundColor:
                  index % 2 === 0 ? theme.card : theme.background,
              },
            ]}
          >
            <View style={styles.header}>
              {item.id !== "verse_0" && (
                <View
                  style={[
                    styles.numberBadge,
                    {
                      backgroundColor: themeColor + "15",
                      borderColor: themeColor + "30",
                    },
                  ]}
                >
                  <Text style={[styles.number, { color: themeColor }]}>
                    {ayahNum}
                  </Text>
                </View>
              )}
              <View style={{ flex: 1 }} />
              {item.id !== "verse_0" && (
                <TouchableOpacity
                  onPress={() => toggleBookmark(ayahNum)}
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name={bookmarked ? "bookmark" : "bookmark-outline"}
                    size={24}
                    color={themeColor}
                  />
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={[
                styles.arabic,
                {
                  fontSize: arabicFontSize,
                  color: theme.text,
                  lineHeight: arabicFontSize * 1.8,
                },
              ]}
            >
              {item.text}
            </Text>

            {item.translation && (
              <Text
                style={[
                  styles.translation,
                  {
                    fontSize: translationFontSize,
                    color: theme.textSecondary,
                    lineHeight: translationFontSize * 1.5,
                  },
                ]}
              >
                {item.translation}
              </Text>
            )}
          </View>
        );
      }}
      contentContainerStyle={[
        styles.list,
        { backgroundColor: theme.background },
      ]}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      onScrollToIndexFailed={(info) => {
        // Jump to approximate location
        flatListRef.current?.scrollToOffset({
          offset: info.averageItemLength * info.index,
          animated: false,
        });
        // Small delay to allow rendering, then scroll to exact index
        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.2,
            });
          }
        }, 100);
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
    fontFamily: Fonts.body,
  },
  item: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  arabic: {
    textAlign: "right",
    fontFamily: Fonts.arabic,
    marginBottom: 16,
  },
  translation: {
    textAlign: "left",
    fontFamily: Fonts.body,
  },
});

export default AyahList;
