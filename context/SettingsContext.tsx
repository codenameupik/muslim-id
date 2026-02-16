import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type Language = "en" | "id" | null;
type ThemeColor = "#00695c" | "#1976D2" | "#7B1FA2" | "#E64A19";

export interface LastReadBookmark {
  type: "surah" | "juz";
  id: string;
  surahName: string;
  ayah: number;
  surahIndex?: string; // Optional surah index for juz navigation
  timestamp: number;
}

export interface Bookmark {
  id: string; // Unique ID (e.g., surahIndex_ayahNum)
  surahIndex: string;
  surahName: string;
  ayah: number;
  timestamp: number;
}

interface Theme {
  background: string;
  text: string;
  card: string;
  textSecondary: string;
  border: string;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  pagesRead: number;
}

export interface KhatamPlan {
  id: string;
  startDate: number; // timestamp
  targetDays: number; // e.g., 30
  currentJuz: number; // 1-30
  currentPage: number; // 1-604
  status: "active" | "completed" | "abandoned";
  history: DailyProgress[];
  endDate?: number; // timestamp when completed
}

interface SettingsContextType {
  appLanguage: "en" | "id";
  setAppLanguage: (lang: "en" | "id") => Promise<void>;
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => Promise<void>;
  arabicFontSize: number;
  setArabicFontSize: (size: number) => Promise<void>;
  translationFontSize: number;
  setTranslationFontSize: (size: number) => Promise<void>;
  theme: Theme;
  lastRead: LastReadBookmark | null;
  setLastRead: (bookmark: LastReadBookmark | null) => Promise<void>;
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  isBookmarked: (surahIndex: string, ayah: number) => boolean;
  khatamPlan: KhatamPlan | null;
  saveKhatamPlan: (plan: KhatamPlan | null) => Promise<void>;
  completedKhatams: KhatamPlan[];
  saveCompletedKhatam: (plan: KhatamPlan) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [language, setLanguageState] = useState<Language>(null);
  const [themeColor, setThemeColorState] = useState<ThemeColor>("#00695c");
  const [arabicFontSize, setArabicFontSizeState] = useState<number>(24);
  const [translationFontSize, setTranslationFontSizeState] =
    useState<number>(16);
  const [lastRead, setLastReadState] = useState<LastReadBookmark | null>(null);
  const [bookmarks, setBookmarksState] = useState<Bookmark[]>([]);
  const [khatamPlan, setKhatamPlanState] = useState<KhatamPlan | null>(null);
  const [completedKhatams, setCompletedKhatamsState] = useState<KhatamPlan[]>(
    [],
  );

  const isDark = systemColorScheme === "dark";

  const theme: Theme = {
    background: isDark ? "#121212" : "#f5f5f5",
    text: isDark ? "#ffffff" : "#000000",
    card: isDark ? "#1e1e1e" : "#ffffff",
    textSecondary: isDark ? "#aaaaaa" : "#666666",
    border: isDark ? "#333333" : "#eeeeee",
  };

  const [appLanguage, setAppLanguageState] = useState<"en" | "id">("en");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedAppLang = await AsyncStorage.getItem("appLanguage");
        if (storedAppLang) {
          setAppLanguageState(storedAppLang as "en" | "id");
        }
        const storedLang = await AsyncStorage.getItem("translationLanguage");
        if (storedLang) {
          setLanguageState(storedLang as Language);
        }
        const storedColor = await AsyncStorage.getItem("themeColor");
        if (storedColor) {
          setThemeColorState(storedColor as ThemeColor);
        }
        const storedArabicSize = await AsyncStorage.getItem("arabicFontSize");
        if (storedArabicSize) {
          setArabicFontSizeState(parseInt(storedArabicSize, 10));
        }
        const storedTransSize = await AsyncStorage.getItem(
          "translationFontSize",
        );
        if (storedTransSize) {
          setTranslationFontSizeState(parseInt(storedTransSize, 10));
        }
        const storedLastRead = await AsyncStorage.getItem("lastRead");
        if (storedLastRead) {
          setLastReadState(JSON.parse(storedLastRead));
        }
        const storedBookmarks = await AsyncStorage.getItem("bookmarks");
        if (storedBookmarks) {
          setBookmarksState(JSON.parse(storedBookmarks));
        }
        const storedKhatamPlan = await AsyncStorage.getItem("khatamPlan");
        if (storedKhatamPlan) {
          setKhatamPlanState(JSON.parse(storedKhatamPlan));
        }
        const storedCompletedKhatams =
          await AsyncStorage.getItem("completedKhatams");
        if (storedCompletedKhatams) {
          setCompletedKhatamsState(JSON.parse(storedCompletedKhatams));
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      }
    };
    loadSettings();
  }, []);

  const setAppLanguage = async (lang: "en" | "id") => {
    try {
      setAppLanguageState(lang);
      await AsyncStorage.setItem("appLanguage", lang);
    } catch (error) {
      console.error("Failed to save app language", error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      if (lang) {
        await AsyncStorage.setItem("translationLanguage", lang);
      } else {
        await AsyncStorage.removeItem("translationLanguage");
      }
    } catch (error) {
      console.error("Failed to save settings", error);
    }
  };

  const setThemeColor = async (color: ThemeColor) => {
    try {
      setThemeColorState(color);
      await AsyncStorage.setItem("themeColor", color);
    } catch (error) {
      console.error("Failed to save theme color", error);
    }
  };

  const setArabicFontSize = async (size: number) => {
    try {
      setArabicFontSizeState(size);
      await AsyncStorage.setItem("arabicFontSize", size.toString());
    } catch (error) {
      console.error("Failed to save arabic font size", error);
    }
  };

  const setTranslationFontSize = async (size: number) => {
    try {
      setTranslationFontSizeState(size);
      await AsyncStorage.setItem("translationFontSize", size.toString());
    } catch (error) {
      console.error("Failed to save translation font size", error);
    }
  };

  const setLastRead = async (bookmark: LastReadBookmark | null) => {
    try {
      setLastReadState(bookmark);
      if (bookmark) {
        await AsyncStorage.setItem("lastRead", JSON.stringify(bookmark));
      } else {
        await AsyncStorage.removeItem("lastRead");
      }
    } catch (error) {
      console.error("Failed to save last read bookmark", error);
    }
  };

  const addBookmark = async (bookmark: Bookmark) => {
    try {
      const newBookmarks = [...bookmarks, bookmark];
      setBookmarksState(newBookmarks);
      await AsyncStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    } catch (error) {
      console.error("Failed to add bookmark", error);
    }
  };

  const removeBookmark = async (id: string) => {
    try {
      const newBookmarks = bookmarks.filter((b) => b.id !== id);
      setBookmarksState(newBookmarks);
      await AsyncStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
    } catch (error) {
      console.error("Failed to remove bookmark", error);
    }
  };

  const saveKhatamPlan = async (plan: KhatamPlan | null) => {
    try {
      setKhatamPlanState(plan);
      if (plan) {
        await AsyncStorage.setItem("khatamPlan", JSON.stringify(plan));
      } else {
        await AsyncStorage.removeItem("khatamPlan");
      }
    } catch (error) {
      console.error("Failed to save khatam plan", error);
    }
  };

  const saveCompletedKhatam = async (plan: KhatamPlan) => {
    try {
      const newHistory = [plan, ...completedKhatams];
      setCompletedKhatamsState(newHistory);
      await AsyncStorage.setItem(
        "completedKhatams",
        JSON.stringify(newHistory),
      );
    } catch (error) {
      console.error("Failed to save completed khatam", error);
    }
  };

  const isBookmarked = (surahIndex: string, ayah: number) => {
    return bookmarks.some(
      (b) => b.surahIndex === surahIndex && b.ayah === ayah,
    );
  };

  return (
    <SettingsContext.Provider
      value={{
        appLanguage,
        setAppLanguage,
        language,
        setLanguage,
        themeColor,
        setThemeColor,
        arabicFontSize,
        setArabicFontSize,
        translationFontSize,
        setTranslationFontSize,
        theme,
        lastRead,
        setLastRead,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        khatamPlan,
        saveKhatamPlan,
        completedKhatams,
        saveCompletedKhatam,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
