import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'id' | null;
type ThemeColor = '#00695c' | '#1976D2' | '#7B1FA2' | '#E64A19';

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(null);
  const [themeColor, setThemeColorState] = useState<ThemeColor>('#00695c');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('translationLanguage');
        if (storedLang) {
          setLanguageState(storedLang as Language);
        }
        const storedColor = await AsyncStorage.getItem('themeColor');
        if (storedColor) {
          setThemeColorState(storedColor as ThemeColor);
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    loadSettings();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      if (lang) {
        await AsyncStorage.setItem('translationLanguage', lang);
      } else {
        await AsyncStorage.removeItem('translationLanguage');
      }
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };

  const setThemeColor = async (color: ThemeColor) => {
    try {
      setThemeColorState(color);
      await AsyncStorage.setItem('themeColor', color);
    } catch (error) {
      console.error('Failed to save theme color', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ language, setLanguage, themeColor, setThemeColor }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
