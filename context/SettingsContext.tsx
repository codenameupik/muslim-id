import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Language = 'en' | 'id' | null;
type ThemeColor = '#00695c' | '#1976D2' | '#7B1FA2' | '#E64A19';

interface Theme {
  background: string;
  text: string;
  card: string;
  textSecondary: string;
  border: string;
}

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => Promise<void>;
  arabicFontSize: number;
  setArabicFontSize: (size: number) => Promise<void>;
  translationFontSize: number;
  setTranslationFontSize: (size: number) => Promise<void>;
  theme: Theme;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [language, setLanguageState] = useState<Language>(null);
  const [themeColor, setThemeColorState] = useState<ThemeColor>('#00695c');
  const [arabicFontSize, setArabicFontSizeState] = useState<number>(24);
  const [translationFontSize, setTranslationFontSizeState] = useState<number>(16);

  const isDark = systemColorScheme === 'dark';

  const theme: Theme = {
    background: isDark ? '#121212' : '#f5f5f5',
    text: isDark ? '#ffffff' : '#000000',
    card: isDark ? '#1e1e1e' : '#ffffff',
    textSecondary: isDark ? '#aaaaaa' : '#666666',
    border: isDark ? '#333333' : '#eeeeee',
  };

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
        const storedArabicSize = await AsyncStorage.getItem('arabicFontSize');
        if (storedArabicSize) {
          setArabicFontSizeState(parseInt(storedArabicSize, 10));
        }
        const storedTransSize = await AsyncStorage.getItem('translationFontSize');
        if (storedTransSize) {
          setTranslationFontSizeState(parseInt(storedTransSize, 10));
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

  const setArabicFontSize = async (size: number) => {
    try {
      setArabicFontSizeState(size);
      await AsyncStorage.setItem('arabicFontSize', size.toString());
    } catch (error) {
      console.error('Failed to save arabic font size', error);
    }
  };

  const setTranslationFontSize = async (size: number) => {
    try {
      setTranslationFontSizeState(size);
      await AsyncStorage.setItem('translationFontSize', size.toString());
    } catch (error) {
      console.error('Failed to save translation font size', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      language, 
      setLanguage, 
      themeColor, 
      setThemeColor,
      arabicFontSize,
      setArabicFontSize,
      translationFontSize,
      setTranslationFontSize,
      theme
    }}>
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
