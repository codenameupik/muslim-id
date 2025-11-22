import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSettings } from '../../context/SettingsContext';

// Import JSON data directly
import eveningEn from '../../assets/dua/evening-dhikr/en.json';
import eveningId from '../../assets/dua/evening-dhikr/id.json';
import morningEn from '../../assets/dua/morning-dhikr/en.json';
import morningId from '../../assets/dua/morning-dhikr/id.json';
import selectedEn from '../../assets/dua/selected-dua/en.json';
import selectedId from '../../assets/dua/selected-dua/id.json';

interface DuaItem {
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  notes?: string;
  fawaid?: string;
  source?: string;
}

const DATA_MAP: Record<string, { en: any; id: any }> = {
  'morning-dhikr': { en: morningEn, id: morningId },
  'evening-dhikr': { en: eveningEn, id: eveningId },
  'selected-dua': { en: selectedEn, id: selectedId },
};

const TITLES: Record<string, string> = {
  'morning-dhikr': 'Morning Dhikr',
  'evening-dhikr': 'Evening Dhikr',
  'selected-dua': 'Selected Dua',
};

export default function DuaList() {
  const { category } = useLocalSearchParams();
  const { themeColor, theme, language, arabicFontSize, translationFontSize } = useSettings();
  const [duas, setDuas] = useState<DuaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryId = Array.isArray(category) ? category[0] : category;

  useEffect(() => {
    if (categoryId && DATA_MAP[categoryId]) {
      // Default to 'en' if language is not set or not 'id'
      const lang = language === 'id' ? 'id' : 'en';
      setDuas(DATA_MAP[categoryId][lang]);
    }
    setLoading(false);
  }, [categoryId, language]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={themeColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: TITLES[categoryId] || 'Dua List' }} />
      
      <FlatList
        data={duas}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: themeColor }]}>{item.title}</Text>
            
            <Text style={[styles.arabic, { fontSize: arabicFontSize, color: theme.text }]}>
              {item.arabic}
            </Text>
            
            <Text style={[styles.latin, { fontSize: translationFontSize, color: themeColor }]}>
              {item.latin}
            </Text>
            
            <Text style={[styles.translation, { fontSize: translationFontSize, color: theme.text }]}>
              {item.translation}
            </Text>

            {(item.source || item.fawaid) && (
              <View style={[styles.footer, { borderTopColor: theme.border }]}>
                {item.source && (
                  <Text style={[styles.source, { color: theme.textSecondary }]}>
                    Source: {item.source}
                  </Text>
                )}
                {item.fawaid && (
                  <Text style={[styles.fawaid, { color: theme.textSecondary }]}>
                    Benefit: {item.fawaid}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    gap: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  arabic: {
    fontFamily: 'System',
    textAlign: 'right',
    marginBottom: 15,
    lineHeight: 40,
  },
  latin: {
    fontStyle: 'italic',
    marginBottom: 10,
    lineHeight: 24,
  },
  translation: {
    marginBottom: 15,
    lineHeight: 24,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 5,
  },
  source: {
    fontSize: 12,
    marginBottom: 5,
  },
  fawaid: {
    fontSize: 12,
  },
});
