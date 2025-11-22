import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../../context/SettingsContext';

import { translations } from '../../constants/i18n';

const THEME_COLORS = [
  { name: 'Teal', value: '#00695c' },
  { name: 'Blue', value: '#1976D2' },
  { name: 'Purple', value: '#7B1FA2' },
  { name: 'Orange', value: '#E64A19' },
];

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
    theme
  } = useSettings();

  const t = translations[appLanguage];

  const handleLanguageSelect = (lang: 'en' | 'id' | null) => {
    setLanguage(lang);
  };

  const handleThemeSelect = (color: string) => {
    setThemeColor(color as any);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.settings.themeColor}</Text>
        <View style={styles.colorContainer}>
          {THEME_COLORS.map((color) => (
            <TouchableOpacity
              key={color.value}
              style={[
                styles.colorOption,
                { backgroundColor: color.value },
                themeColor === color.value && styles.selectedColor
              ]}
              onPress={() => handleThemeSelect(color.value)}
            />
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.settings.appLanguage}</Text>
        
        <TouchableOpacity
          style={[styles.option, appLanguage === 'en' && { backgroundColor: themeColor + '20' }]}
          onPress={() => setAppLanguage('en')}
        >
          <Text style={[styles.optionText, appLanguage === 'en' && { color: themeColor, fontWeight: 'bold' }, { color: theme.text }]}>{t.settings.english}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, appLanguage === 'id' && { backgroundColor: themeColor + '20' }]}
          onPress={() => setAppLanguage('id')}
        >
          <Text style={[styles.optionText, appLanguage === 'id' && { color: themeColor, fontWeight: 'bold' }, { color: theme.text }]}>{t.settings.indonesia}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.settings.translation}</Text>
        
        <TouchableOpacity
          style={[styles.option, language === 'en' && { backgroundColor: themeColor + '20' }]}
          onPress={() => handleLanguageSelect('en')}
        >
          <Text style={[styles.optionText, language === 'en' && { color: themeColor, fontWeight: 'bold' }, { color: theme.text }]}>{t.settings.english}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, language === 'id' && { backgroundColor: themeColor + '20' }]}
          onPress={() => handleLanguageSelect('id')}
        >
          <Text style={[styles.optionText, language === 'id' && { color: themeColor, fontWeight: 'bold' }, { color: theme.text }]}>{t.settings.bahasaIndonesia}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, language === null && { backgroundColor: themeColor + '20' }]}
          onPress={() => handleLanguageSelect(null)}
        >
          <Text style={[styles.optionText, language === null && { color: themeColor, fontWeight: 'bold' }, { color: theme.text }]}>{t.settings.none}</Text>
        </TouchableOpacity>
      </View>



      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.settings.textSize}</Text>
        
        <View style={styles.sizeControl}>
          <Text style={[styles.sizeLabel, { color: theme.text }]}>{t.settings.arabicText}</Text>
          <View style={styles.sizeButtons}>
            <TouchableOpacity 
              style={[styles.sizeButton, { borderColor: themeColor }]} 
              onPress={() => setArabicFontSize(Math.max(18, arabicFontSize - 2))}
            >
              <Text style={[styles.sizeButtonText, { color: themeColor }]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.sizeValue, { color: theme.text }]}>{arabicFontSize}</Text>
            <TouchableOpacity 
              style={[styles.sizeButton, { borderColor: themeColor }]} 
              onPress={() => setArabicFontSize(Math.min(40, arabicFontSize + 2))}
            >
              <Text style={[styles.sizeButtonText, { color: themeColor }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sizeControl}>
          <Text style={[styles.sizeLabel, { color: theme.text }]}>{t.settings.translationText}</Text>
          <View style={styles.sizeButtons}>
            <TouchableOpacity 
              style={[styles.sizeButton, { borderColor: themeColor }]} 
              onPress={() => setTranslationFontSize(Math.max(12, translationFontSize - 2))}
            >
              <Text style={[styles.sizeButtonText, { color: themeColor }]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.sizeValue, { color: theme.text }]}>{translationFontSize}</Text>
            <TouchableOpacity 
              style={[styles.sizeButton, { borderColor: themeColor }]} 
              onPress={() => setTranslationFontSize(Math.min(30, translationFontSize + 2))}
            >
              <Text style={[styles.sizeButtonText, { color: themeColor }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.previewContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>{t.settings.preview}</Text>
          <View style={styles.previewBox}>
            <Text style={[styles.arabicPreview, { fontSize: arabicFontSize, color: theme.text }]}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</Text>
            {language && (
              <Text style={[styles.translationPreview, { fontSize: translationFontSize, color: theme.textSecondary }]}>
                {language === 'id' ? 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.' : 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.settings.credits}</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/semarketir/quranjson')}>
          <Text style={styles.creditLink}>Quran Data: semarketir/quranjson</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://aladhan.com/')}>
          <Text style={styles.creditLink}>Prayer Times: Aladhan API</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  option: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    elevation: 2,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#fff',
    elevation: 4, // Slightly higher elevation for selected
  },
  sizeControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
  },
  sizeLabel: {
    fontSize: 16,
    color: '#333',
  },
  sizeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sizeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  previewContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  previewBox: {
    alignItems: 'flex-end',
  },
  arabicPreview: {
    fontFamily: 'System',
    marginBottom: 8,
    textAlign: 'right',
  },
  translationPreview: {
    color: '#555',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  creditLink: {
    fontSize: 16,
    color: '#00695c',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
});
