import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import juzInfo from '../../assets/quran/juz.json';
import surahMap from '../../assets/quran/map';
import enMap from '../../assets/quran/translation/en/map';
import idMap from '../../assets/quran/translation/id/map';
import { useSettings } from '../../context/SettingsContext';

interface VerseItem {
  id: string;
  type: 'header' | 'verse';
  text?: string;
  translation?: string;
  surahName?: string;
  verseNumber?: number;
}

export default function JuzDetail() {
  const { id } = useLocalSearchParams();
  const juzIndex = Array.isArray(id) ? id[0] : id;
  const [verses, setVerses] = useState<VerseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { themeColor, language } = useSettings();

  useEffect(() => {
    const loadJuzContent = async () => {
      try {
        setLoading(true);
        const juz = juzInfo.find((j) => parseInt(j.index, 10) === parseInt(juzIndex!, 10));
        
        if (!juz) {
          console.error('Juz not found');
          return;
        }

        const startSurahIdx = parseInt(juz.start.index, 10);
        const endSurahIdx = parseInt(juz.end.index, 10);
        const startVerse = parseInt(juz.start.verse.replace('verse_', ''), 10);
        const endVerse = parseInt(juz.end.verse.replace('verse_', ''), 10);

        const items: VerseItem[] = [];

        for (let i = startSurahIdx; i <= endSurahIdx; i++) {
          const surahKey = i.toString().padStart(3, '0');
          const surahData = surahMap[surahKey];
          
          let translationData = null;
          if (language) {
             const map = language === 'en' ? enMap : idMap;
             translationData = map[surahKey];
          }

          if (surahData) {
            items.push({
              id: `header-${surahKey}`,
              type: 'header',
              surahName: surahData.name,
            });

            const sVerse = (i === startSurahIdx) ? startVerse : 1;
            const eVerse = (i === endSurahIdx) ? endVerse : surahData.count;

            for (let v = sVerse; v <= eVerse; v++) {
              const verseKey = `verse_${v}`;
              const text = surahData.verse[verseKey];
              const translationText = translationData?.verse[verseKey];
              
              if (text) {
                items.push({
                  id: `${surahKey}-${v}`,
                  type: 'verse',
                  text: text,
                  translation: translationText,
                  verseNumber: v,
                });
              }
            }
          }
        }
        setVerses(items);
      } catch (error) {
        console.error('Failed to load juz content', error);
      } finally {
        setLoading(false);
      }
    };

    if (juzIndex) {
      loadJuzContent();
    }
  }, [juzIndex, language]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={themeColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Juz ${juzIndex}` }} />
      <FlatList
        data={verses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <View style={[styles.headerContainer, { backgroundColor: themeColor + '10' }]}>
                <Text style={[styles.headerText, { color: themeColor }]}>{item.surahName}</Text>
              </View>
            );
          }
          return (
            <View style={styles.verseContainer}>
              <View style={styles.verseHeader}>
                 {item.verseNumber !== 0 && (
                   <View style={[styles.numberBadge, { backgroundColor: themeColor + '20' }]}>
                     <Text style={[styles.number, { color: themeColor }]}>{item.verseNumber}</Text>
                   </View>
                 )}
              </View>
              <Text style={styles.arabic}>{item.text}</Text>
              {item.translation && (
                <Text style={styles.translation}>{item.translation}</Text>
              )}
            </View>
          );
        }}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  verseContainer: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 16,
  },
  verseHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  arabic: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'right',
    color: '#000',
    fontFamily: 'System',
    marginBottom: 8,
  },
  translation: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'left',
  },
});
