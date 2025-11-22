import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../../context/SettingsContext';

import { translations } from '../../constants/i18n';

export default function DuaCategories() {
  const { themeColor, theme, appLanguage } = useSettings();
  const router = useRouter();
  const t = translations[appLanguage];

  const categories = [
    { id: 'morning-dhikr', title: t.dua.morning, icon: 'sunny-outline' },
    { id: 'evening-dhikr', title: t.dua.evening, icon: 'moon-outline' },
    { id: 'selected-dua', title: t.dua.selected, icon: 'book-outline' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ title: t.dua.title }} />
      
      <View style={styles.list}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.card, { backgroundColor: theme.card }]}
            onPress={() => router.push(`/dua/${category.id}`)}
          >
            <View style={[styles.iconContainer, { backgroundColor: themeColor + '20' }]}>
              <Ionicons name={category.icon as any} size={32} color={themeColor} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: theme.text }]}>{category.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  list: {
    gap: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
