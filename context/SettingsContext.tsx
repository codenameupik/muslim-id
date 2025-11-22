import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'id' | null;

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('translationLanguage');
        if (storedLang) {
          setLanguageState(storedLang as Language);
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

  return (
    <SettingsContext.Provider value={{ language, setLanguage }}>
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
