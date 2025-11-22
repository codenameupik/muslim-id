import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useSettings } from '../../context/SettingsContext';

import { translations } from '../../constants/i18n';

export default function TabLayout() {
  const { themeColor, appLanguage } = useSettings();
  const t = translations[appLanguage];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColor,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.home,
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: t.tabs.quran,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t.tabs.search,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: t.tabs.prayer,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'time' : 'time-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t.tabs.settings,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
