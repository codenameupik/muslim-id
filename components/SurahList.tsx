import { Link } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import surahData from '../assets/quran/surah.json';
import { useSettings } from '../context/SettingsContext';

interface Surah {
  index: string;
  title: string;
  titleAr: string;
  count: number;
}

const SurahList = () => {
  const { themeColor } = useSettings();

  return (
    <FlatList
      data={surahData}
      keyExtractor={(item) => item.index}
      renderItem={({ item }: { item: Surah }) => (
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
      )}
    />
  );
};

const styles = StyleSheet.create({
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
});

export default SurahList;
