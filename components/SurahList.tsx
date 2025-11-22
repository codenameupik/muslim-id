import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import surahData from '../assets/quran/surah.json';

interface Surah {
  index: string;
  title: string;
  titleAr: string;
  count: number;
  type: string;
}

const SurahList = () => {
  const router = useRouter();

  const renderItem = ({ item }: { item: Surah }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/surah/${item.index}`)}
    >
      <View style={styles.numberContainer}>
        <Text style={styles.number}>{item.index}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.type} • {item.count} Verses</Text>
      </View>
      <Text style={styles.arabic}>{item.titleAr}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={surahData}
      renderItem={renderItem}
      keyExtractor={(item) => item.index}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  numberContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  number: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  arabic: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004d40',
  },
});

export default SurahList;
