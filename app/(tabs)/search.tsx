import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../../context/SettingsContext';

// Import Data
import eveningEn from '../../assets/dua/evening-dhikr/en.json';
import eveningId from '../../assets/dua/evening-dhikr/id.json';
import morningEn from '../../assets/dua/morning-dhikr/en.json';
import morningId from '../../assets/dua/morning-dhikr/id.json';
import selectedEn from '../../assets/dua/selected-dua/en.json';
import selectedId from '../../assets/dua/selected-dua/id.json';
import surahData from '../../assets/quran/surah.json';

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'surah' | 'juz' | 'dua';
  data: any;
}

export default function SearchScreen() {
  const { themeColor, theme, language } = useSettings();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    const sections: { title: string; data: SearchResult[] }[] = [];

    // Search Surahs
    const surahResults: SearchResult[] = surahData
      .filter(s => 
        s.title.toLowerCase().includes(lowerQuery) || 
        s.titleAr.includes(query) ||
        s.index.includes(query)
      )
      .map(s => ({
        id: `surah-${s.index}`,
        title: `${s.index}. ${s.title}`,
        subtitle: `${s.type} • ${s.count} Verses`,
        type: 'surah',
        data: s
      }));

    if (surahResults.length > 0) {
      sections.push({ title: 'Surah', data: surahResults });
    }

    // Search Juz
    const juzResults: SearchResult[] = [];
    for (let i = 1; i <= 30; i++) {
      if (`juz ${i}`.includes(lowerQuery) || i.toString() === query) {
        juzResults.push({
          id: `juz-${i}`,
          title: `Juz ${i}`,
          type: 'juz',
          data: { id: i }
        });
      }
    }

    if (juzResults.length > 0) {
      sections.push({ title: 'Juz', data: juzResults });
    }

    // Search Duas
    const lang = language === 'id' ? 'id' : 'en';
    const duas = [
      ...morningEn.map((d, i) => ({ ...d, category: 'morning-dhikr', index: i, lang: 'en' })),
      ...morningId.map((d, i) => ({ ...d, category: 'morning-dhikr', index: i, lang: 'id' })),
      ...eveningEn.map((d, i) => ({ ...d, category: 'evening-dhikr', index: i, lang: 'en' })),
      ...eveningId.map((d, i) => ({ ...d, category: 'evening-dhikr', index: i, lang: 'id' })),
      ...selectedEn.map((d, i) => ({ ...d, category: 'selected-dua', index: i, lang: 'en' })),
      ...selectedId.map((d, i) => ({ ...d, category: 'selected-dua', index: i, lang: 'id' })),
    ].filter(d => d.lang === lang);

    const duaResults: SearchResult[] = duas
      .filter(d => 
        d.title.toLowerCase().includes(lowerQuery) || 
        d.translation.toLowerCase().includes(lowerQuery)
      )
      .map(d => ({
        id: `dua-${d.category}-${d.index}`,
        title: d.title,
        subtitle: d.translation.substring(0, 50) + '...',
        type: 'dua',
        data: d
      }));

    if (duaResults.length > 0) {
      sections.push({ title: 'Dua & Dhikr', data: duaResults });
    }

    return sections;
  }, [query, language]);

  const handlePress = (item: SearchResult) => {
    if (item.type === 'surah') {
      router.push(`/surah/${item.data.index}`);
    } else if (item.type === 'juz') {
      router.push(`/juz/${item.data.id}`);
    } else if (item.type === 'dua') {
      router.push(`/dua/${item.data.category}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Search Surah, Juz, or Dua..."
          placeholderTextColor={theme.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <SectionList
        sections={results}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, { color: themeColor, backgroundColor: theme.background }]}>
            {title}
          </Text>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.item, { backgroundColor: theme.card }]}
            onPress={() => handlePress(item)}
          >
            <View>
              <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
              {item.subtitle && (
                <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
                  {item.subtitle}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          query.length >= 2 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No results found
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // For status bar
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 10,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
  },
});
