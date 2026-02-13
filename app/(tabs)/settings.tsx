import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { Fonts } from "../../constants/theme";
import { useSettings } from "../../context/SettingsContext";

import { translations } from "../../constants/i18n";

const THEME_COLORS = [
  { name: "Teal", color: "#00695c" },
  { name: "Blue", color: "#1976D2" },
  { name: "Purple", color: "#7B1FA2" },
  { name: "Orange", color: "#E64A19" },
];

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SettingsScreen() {
  const {
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
  } = useSettings();

  const t = translations[appLanguage];
  const [creditsExpanded, setCreditsExpanded] = useState(false);

  const toggleCredits = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCreditsExpanded(!creditsExpanded);
  };

  const handleLanguageSelect = (lang: "en" | "id" | null) => {
    setLanguage(lang);
  };

  const handleThemeSelect = (color: string) => {
    setThemeColor(color as any);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t.settings.themeColor}
        </Text>
        <View style={styles.colorContainer}>
          {THEME_COLORS.map((color) => (
            <TouchableOpacity
              key={color.color}
              style={[
                styles.colorOption,
                { backgroundColor: color.color },
                themeColor === color.color && styles.selectedColor,
              ]}
              onPress={() => handleThemeSelect(color.color)}
            />
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t.settings.appLanguage}
        </Text>

        <TouchableOpacity
          style={[
            styles.option,
            { borderColor: theme.border },
            appLanguage === "en" && {
              backgroundColor: themeColor + "20",
              borderColor: themeColor,
            },
          ]}
          onPress={() => setAppLanguage("en")}
        >
          <Text
            style={[
              styles.optionText,
              appLanguage === "en" && {
                color: themeColor,
                fontFamily: Fonts.semiBold,
              },
              { color: appLanguage === "en" ? themeColor : theme.text },
            ]}
          >
            {t.settings.english}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            { borderColor: theme.border },
            appLanguage === "id" && {
              backgroundColor: themeColor + "20",
              borderColor: themeColor,
            },
          ]}
          onPress={() => setAppLanguage("id")}
        >
          <Text
            style={[
              styles.optionText,
              appLanguage === "id" && {
                color: themeColor,
                fontFamily: Fonts.semiBold,
              },
              { color: appLanguage === "id" ? themeColor : theme.text },
            ]}
          >
            {t.settings.indonesia}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t.settings.translation}
        </Text>

        <TouchableOpacity
          style={[
            styles.option,
            { borderColor: theme.border },
            language === "en" && {
              backgroundColor: themeColor + "20",
              borderColor: themeColor,
            },
          ]}
          onPress={() => handleLanguageSelect("en")}
        >
          <Text
            style={[
              styles.optionText,
              language === "en" && {
                color: themeColor,
                fontFamily: Fonts.semiBold,
              },
              { color: language === "en" ? themeColor : theme.text },
            ]}
          >
            {t.settings.english}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            { borderColor: theme.border },
            language === "id" && {
              backgroundColor: themeColor + "20",
              borderColor: themeColor,
            },
          ]}
          onPress={() => handleLanguageSelect("id")}
        >
          <Text
            style={[
              styles.optionText,
              language === "id" && {
                color: themeColor,
                fontFamily: Fonts.semiBold,
              },
              { color: language === "id" ? themeColor : theme.text },
            ]}
          >
            {t.settings.bahasaIndonesia}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            { borderColor: theme.border },
            language === null && {
              backgroundColor: themeColor + "20",
              borderColor: themeColor,
            },
          ]}
          onPress={() => handleLanguageSelect(null)}
        >
          <Text
            style={[
              styles.optionText,
              language === null && {
                color: themeColor,
                fontFamily: Fonts.semiBold,
              },
              { color: language === null ? themeColor : theme.text },
            ]}
          >
            {t.settings.none}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t.settings.textSize}
        </Text>

        <View style={styles.sizeControl}>
          <Text style={[styles.sizeLabel, { color: theme.text }]}>
            {t.settings.arabicText}
          </Text>
          <View style={styles.sizeButtons}>
            <TouchableOpacity
              style={[styles.sizeButton, { borderColor: themeColor }]}
              onPress={() =>
                setArabicFontSize(Math.max(18, arabicFontSize - 2))
              }
            >
              <Text style={[styles.sizeButtonText, { color: themeColor }]}>
                -
              </Text>
            </TouchableOpacity>
            <Text style={[styles.sizeValue, { color: theme.text }]}>
              {arabicFontSize}
            </Text>
            <TouchableOpacity
              style={[styles.sizeButton, { borderColor: themeColor }]}
              onPress={() =>
                setArabicFontSize(Math.min(40, arabicFontSize + 2))
              }
            >
              <Text style={[styles.sizeButtonText, { color: themeColor }]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sizeControl}>
          <Text style={[styles.sizeLabel, { color: theme.text }]}>
            {t.settings.translationText}
          </Text>
          <View style={styles.sizeButtons}>
            <TouchableOpacity
              style={[styles.sizeButton, { borderColor: themeColor }]}
              onPress={() =>
                setTranslationFontSize(Math.max(12, translationFontSize - 2))
              }
            >
              <Text style={[styles.sizeButtonText, { color: themeColor }]}>
                -
              </Text>
            </TouchableOpacity>
            <Text style={[styles.sizeValue, { color: theme.text }]}>
              {translationFontSize}
            </Text>
            <TouchableOpacity
              style={[styles.sizeButton, { borderColor: themeColor }]}
              onPress={() =>
                setTranslationFontSize(Math.min(30, translationFontSize + 2))
              }
            >
              <Text style={[styles.sizeButtonText, { color: themeColor }]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.previewContainer,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>
            {t.settings.preview}
          </Text>
          <View style={styles.previewBox}>
            <Text
              style={[
                styles.arabicPreview,
                { fontSize: arabicFontSize, color: theme.text },
              ]}
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </Text>
            {language && (
              <Text
                style={[
                  styles.translationPreview,
                  { fontSize: translationFontSize, color: theme.textSecondary },
                ]}
              >
                {language === "id"
                  ? "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
                  : "In the name of Allah, the Entirely Merciful, the Especially Merciful."}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <TouchableOpacity
            style={styles.cardHeader}
            onPress={toggleCredits}
            activeOpacity={0.7}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {t.settings.credits}
            </Text>
            <Ionicons
              name={creditsExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>

          {creditsExpanded && (
            <View>
              <View
                style={[styles.divider, { backgroundColor: theme.border }]}
              />
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://github.com/semarketir/quranjson")
                }
                style={styles.creditItem}
              >
                <Text style={styles.creditLink}>
                  Quran Data: semarketir/quranjson
                </Text>
              </TouchableOpacity>
              <View
                style={[styles.divider, { backgroundColor: theme.border }]}
              />
              <TouchableOpacity
                onPress={() => Linking.openURL("https://aladhan.com/")}
                style={styles.creditItem}
              >
                <Text style={styles.creditLink}>Prayer Times: Aladhan API</Text>
              </TouchableOpacity>
              <View
                style={[styles.divider, { backgroundColor: theme.border }]}
              />
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://github.com/fitrahive/dua-dhikr")
                }
                style={styles.creditItem}
              >
                <Text style={styles.creditLink}>
                  Dua Data: fitrahive/dua-dhikr
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading,
    marginBottom: 15,
    color: "#333",
  },
  option: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontFamily: Fonts.body,
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    elevation: 2,
    borderWidth: 3,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sizeControl: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 8,
  },
  sizeLabel: {
    fontSize: 16,
    color: "#333",
    fontFamily: Fonts.body,
  },
  sizeButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  sizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sizeButtonText: {
    fontSize: 20,
    fontFamily: Fonts.heading,
  },
  sizeValue: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: "center",
  },
  previewContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  previewLabel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: "#666",
    marginBottom: 10,
  },
  previewBox: {
    alignItems: "flex-end",
  },
  arabicPreview: {
    fontFamily: Fonts.arabic,
    marginBottom: 8,
    textAlign: "right",
  },
  translationPreview: {
    color: "#555",
    textAlign: "left",
    alignSelf: "flex-start",
    fontFamily: Fonts.body,
  },
  creditLink: {
    fontSize: 16,
    color: "#00695c",
    textDecorationLine: "underline",
    fontFamily: Fonts.body,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  creditItem: {
    padding: 16,
  },
  divider: {
    height: 1,
    width: "100%",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading,
  },
});
