import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import juzInfo from "../../assets/quran/juz.json";
import surahMap from "../../assets/quran/map";
import enMap from "../../assets/quran/translation/en/map";
import idMap from "../../assets/quran/translation/id/map";
import { useSettings } from "../../context/SettingsContext";

interface VerseItem {
  id: string;
  type: "header" | "verse";
  text?: string;
  translation?: string;
  surahName?: string;
  surahIndex?: string;
  verseNumber?: number;
}

export default function JuzDetail() {
  const { id } = useLocalSearchParams();
  const juzIndex = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const [verses, setVerses] = useState<VerseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  const {
    themeColor,
    language,
    arabicFontSize,
    translationFontSize,
    setLastRead,
    isBookmarked,
    addBookmark,
    removeBookmark,
    theme,
  } = useSettings();

  useEffect(() => {
    const loadJuzContent = async () => {
      try {
        setLoading(true);
        const juz = juzInfo.find(
          (j) => parseInt(j.index, 10) === parseInt(juzIndex!, 10),
        );

        if (!juz) {
          console.error("Juz not found");
          return;
        }

        const startSurahIdx = parseInt(juz.start.index, 10);
        const endSurahIdx = parseInt(juz.end.index, 10);
        const startVerse = parseInt(juz.start.verse.replace("verse_", ""), 10);
        const endVerse = parseInt(juz.end.verse.replace("verse_", ""), 10);

        const items: VerseItem[] = [];

        for (let i = startSurahIdx; i <= endSurahIdx; i++) {
          const surahKey = i.toString().padStart(3, "0");
          const surahData = surahMap[surahKey];

          let translationData = null;
          if (language) {
            const map = language === "en" ? enMap : idMap;
            translationData = map[surahKey];
          }

          if (surahData) {
            items.push({
              id: `header-${surahKey}`,
              type: "header",
              surahName: surahData.name,
              surahIndex: surahKey,
            });

            const sVerse = i === startSurahIdx ? startVerse : 1;
            const eVerse = i === endSurahIdx ? endVerse : surahData.count;

            for (let v = sVerse; v <= eVerse; v++) {
              const verseKey = `verse_${v}`;
              const text = surahData.verse[verseKey];
              const translationText = translationData?.verse[verseKey];

              if (text) {
                items.push({
                  id: `${surahKey}-${v}`,
                  type: "verse",
                  text: text,
                  translation: translationText,
                  verseNumber: v,
                  surahIndex: surahKey,
                  surahName: surahData.name,
                });
              }
            }
          }
        }
        setVerses(items);
      } catch (error) {
        console.error("Failed to load juz content", error);
      } finally {
        setLoading(false);
      }
    };

    if (juzIndex) {
      loadJuzContent();
    }
  }, [juzIndex, language]);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length === 0) return;
      // Find the last visible verse (not a header)
      for (let i = viewableItems.length - 1; i >= 0; i--) {
        const item = viewableItems[i].item;
        if (item && item.type === "verse" && item.verseNumber) {
          setLastRead({
            type: "juz",
            id: juzIndex!,
            surahName: `Juz ${juzIndex} Surah ${item.surahName}`,
            ayah: item.verseNumber,
            timestamp: Date.now(),
          });
          break;
        }
      }
    },
    [juzIndex, setLastRead],
  );

  const toggleBookmark = (item: VerseItem) => {
    if (!item.surahIndex || !item.verseNumber || !item.surahName) return;

    const bookmarkId = `${item.surahIndex}_${item.verseNumber}`;
    const bookmarked = isBookmarked(item.surahIndex, item.verseNumber);

    if (bookmarked) {
      removeBookmark(bookmarkId);
    } else {
      addBookmark({
        id: bookmarkId,
        surahIndex: item.surahIndex,
        surahName: item.surahName,
        ayah: item.verseNumber,
        timestamp: Date.now(),
      });
    }
  };

  const nextJuz =
    parseInt(juzIndex!, 10) < 30 ? parseInt(juzIndex!, 10) + 1 : null;
  const prevJuz =
    parseInt(juzIndex!, 10) > 1 ? parseInt(juzIndex!, 10) - 1 : null;

  const navigateToJuz = (index: number) => {
    setShowSelector(false);
    router.replace(`/juz/${index}`);
  };

  if (loading) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={themeColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: `Juz ${juzIndex}` }} />
      <FlatList
        data={verses}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          if (item.type === "header") {
            return (
              <View
                style={[
                  styles.headerContainer,
                  { backgroundColor: themeColor + "10" },
                ]}
              >
                <Text style={[styles.headerText, { color: themeColor }]}>
                  {item.surahName}
                </Text>
              </View>
            );
          }

          const isBookmarkedItem =
            item.surahIndex && item.verseNumber
              ? isBookmarked(item.surahIndex, item.verseNumber)
              : false;

          return (
            <View
              style={[
                styles.verseContainer,
                { borderBottomColor: theme.border },
              ]}
            >
              <View style={styles.verseHeader}>
                {item.verseNumber !== 0 && (
                  <View
                    style={[
                      styles.numberBadge,
                      { backgroundColor: themeColor + "20" },
                    ]}
                  >
                    <Text style={[styles.number, { color: themeColor }]}>
                      {item.verseNumber}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  onPress={() => toggleBookmark(item)}
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name={isBookmarkedItem ? "bookmark" : "bookmark-outline"}
                    size={24}
                    color={themeColor}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  styles.arabic,
                  { fontSize: arabicFontSize, color: theme.text },
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
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <View style={styles.navigationButtons}>
              {prevJuz ? (
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    { backgroundColor: themeColor + "20" },
                  ]}
                  onPress={() => navigateToJuz(prevJuz)}
                >
                  <Ionicons name="chevron-back" size={24} color={themeColor} />
                  <Text style={[styles.navButtonText, { color: themeColor }]}>
                    Juz {prevJuz}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.navButtonPlaceholder} />
              )}

              <TouchableOpacity
                style={[styles.selectorButton, { backgroundColor: themeColor }]}
                onPress={() => setShowSelector(true)}
              >
                <Text style={styles.selectorButtonText}>Juz {juzIndex}</Text>
                <Ionicons
                  name="chevron-up"
                  size={16}
                  color="white"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>

              {nextJuz ? (
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    { backgroundColor: themeColor + "20" },
                  ]}
                  onPress={() => navigateToJuz(nextJuz)}
                >
                  <Text style={[styles.navButtonText, { color: themeColor }]}>
                    Juz {nextJuz}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={24}
                    color={themeColor}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.navButtonPlaceholder} />
              )}
            </View>
          </View>
        )}
      />

      <Modal
        visible={showSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSelector(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setShowSelector(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Pilih Juz
              </Text>
              <TouchableOpacity onPress={() => setShowSelector(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.selectorGrid}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.selectorItem,
                    {
                      backgroundColor:
                        num === parseInt(juzIndex!, 10)
                          ? themeColor
                          : themeColor + "10",
                    },
                  ]}
                  onPress={() => navigateToJuz(num)}
                >
                  <Text
                    style={[
                      styles.selectorItemText,
                      {
                        color:
                          num === parseInt(juzIndex!, 10)
                            ? "white"
                            : theme.text,
                      },
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 8,
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  verseContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  verseHeader: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
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
    marginBottom: 8,
    fontFamily: "Amiri_400Regular",
  },
  translation: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
  },
  footer: {
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 4,
  },
  navButtonPlaceholder: {
    width: 100,
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  selectorButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  selectorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    justifyContent: "center",
  },
  selectorItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  selectorItemText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
