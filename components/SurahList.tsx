import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import surahData from '../assets/quran/surah.json';
import { useSettings } from '../context/SettingsContext';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface Surah {
  index: string;
  title: string;
  titleAr: string;
  count: number;
  juz: { index: string }[];
}



const SurahList = () => {
  const { themeColor } = useSettings();
  const [viewMode, setViewMode] = useState<'surah' | 'juz'>('surah');
  const [expandedJuz, setExpandedJuz] = useState<number | null>(null);

  const juzData = useMemo(() => {
    const map = new Map<number, Surah[]>();
    for (let i = 1; i <= 30; i++) {
      map.set(i, []);
    }

    surahData.forEach((surah: any) => {
      surah.juz.forEach((j: any) => {
        const juzNum = parseInt(j.index, 10);
        if (map.has(juzNum)) {
          map.get(juzNum)?.push(surah);
        }
      });
    });

    return Array.from(map.entries()).map(([id, surahs]) => ({
      id,
      surahs,
    }));
  }, []);

  const toggleJuz = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedJuz(expandedJuz === id ? null : id);
  };

  const renderSurahItem = ({ item }: { item: Surah }) => (
    <Link href={`/surah/${item.index}`} asChild>
      <TouchableOpacity style={styles.item}>
        <View style={[styles.numberBadge, { backgroundColor: themeColor + '20' }]}>
          <Text style={[styles.number, { color: themeColor }]}>{item.index}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.count} Verses</Text>
        </View>
        <Text style={[styles.arabic, { color: themeColor }]}>{item.titleAr}</Text>
      </TouchableOpacity>
    </Link>
  );

  const renderJuzItem = ({ item }: { item: { id: number; surahs: Surah[] } }) => {
    const isExpanded = expandedJuz === item.id;
    return (
      <View style={styles.juzContainer}>
        <TouchableOpacity 
          style={[styles.juzHeader, isExpanded && { backgroundColor: themeColor + '10' }]} 
          onPress={() => toggleJuz(item.id)}
        >
          <Text style={[styles.juzTitle, { color: themeColor }]}>Juz {item.id}</Text>
          <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color={themeColor} />
        </TouchableOpacity>
        {isExpanded && (
          <View>
            {item.surahs.map((surah) => (
              <View key={surah.index}>
                 {renderSurahItem({ item: surah })}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'surah' && { backgroundColor: themeColor }]}
          onPress={() => setViewMode('surah')}
        >
          <Text style={[styles.toggleText, viewMode === 'surah' ? styles.activeText : { color: themeColor }]}>Surah</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'juz' && { backgroundColor: themeColor }]}
          onPress={() => setViewMode('juz')}
        >
          <Text style={[styles.toggleText, viewMode === 'juz' ? styles.activeText : { color: themeColor }]}>Juz</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'surah' ? (
        <FlatList
          data={surahData}
          keyExtractor={(item) => item.index}
          renderItem={renderSurahItem}
        />
      ) : (
        <FlatList
          data={juzData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderJuzItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleText: {
    fontWeight: 'bold',
  },
  activeText: {
    color: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  number: {
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  arabic: {
    fontSize: 20,
    fontFamily: 'System',
  },
  juzContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  juzHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  juzTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SurahList;
