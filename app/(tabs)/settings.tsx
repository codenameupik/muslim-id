import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../../context/SettingsContext';

const THEME_COLORS = [
  { name: 'Teal', value: '#00695c' },
  { name: 'Blue', value: '#1976D2' },
  { name: 'Purple', value: '#7B1FA2' },
  { name: 'Orange', value: '#E64A19' },
];

export default function SettingsScreen() {
  const { 
    language, 
    setLanguage, 
    themeColor, 
    setThemeColor,
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize
  } = useSettings();

  const handleLanguageSelect = (lang: 'en' | 'id' | null) => {
    setLanguage(lang);
  };

  const handleThemeSelect = (color: string) => {
    setThemeColor(color as any);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Translation</Text>
        
        <TouchableOpacity
          style={[styles.option, language === 'en' && { backgroundColor: themeColor + '20' }]}
          onPress={() => handleLanguageSelect('en')}
        >
          <Text style={[styles.optionText, language === 'en' && { color: themeColor, fontWeight: 'bold' }]}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, language === 'id' && { backgroundColor: themeColor + '20' }]}
          onPress={() => handleLanguageSelect('id')}
        >
          <Text style={[styles.optionText, language === 'id' && { color: themeColor, fontWeight: 'bold' }]}>Bahasa Indonesia</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, language === null && { backgroundColor: themeColor + '20' }]}
          onPress={() => handleLanguageSelect(null)}
        >
          <Text style={[styles.optionText, language === null && { color: themeColor, fontWeight: 'bold' }]}>None</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme Color</Text>
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
        <Text style={styles.sectionTitle}>Text Size</Text>
        
        <View style={styles.sizeControl}>
          <Text style={styles.sizeLabel}>Arabic Text</Text>
          <View style={styles.sizeButtons}>
            <TouchableOpacity 
              style={[styles.sizeButton, { borderColor: themeColor }]} 
              onPress={() => setArabicFontSize(Math.max(18, arabicFontSize - 2))}
            >
              <Text style={[styles.sizeButtonText, { color: themeColor }]}>-</Text>
            </TouchableOpacity>
            <Text style={styles.sizeValue}>{arabicFontSize}</Text>
            <TouchableOpacity 
              style={[styles.sizeButton, { borderColor: themeColor }]} 
              onPress={() => setArabicFontSize(Math.min(40, arabicFontSize + 2))}
            >
              <Text style={[styles.sizeButtonText, { color: themeColor }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sizeControl}>
          <Text style={styles.sizeLabel}>Translation Text</Text>
          <View style={styles.sizeButtons}>
            <TouchableOpacity 
              style={[styles.sizeButton, { borderColor: themeColor }]} 
              onPress={() => setTranslationFontSize(Math.max(12, translationFontSize - 2))}
            >
              <Text style={[styles.sizeButtonText, { color: themeColor }]}>-</Text>
            </TouchableOpacity>
            <Text style={styles.sizeValue}>{translationFontSize}</Text>
            <TouchableOpacity 
              style={[styles.sizeButton, { borderColor: themeColor }]} 
              onPress={() => setTranslationFontSize(Math.min(30, translationFontSize + 2))}
            >
              <Text style={[styles.sizeButtonText, { color: themeColor }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.previewContainer}>
          <Text style={styles.previewLabel}>Preview</Text>
          <View style={styles.previewBox}>
            <Text style={[styles.arabicPreview, { fontSize: arabicFontSize }]}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</Text>
            {language && (
              <Text style={[styles.translationPreview, { fontSize: translationFontSize }]}>
                {language === 'id' ? 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.' : 'In the name of Allah, the Entirely Merciful, the Especially Merciful.'}
              </Text>
            )}
          </View>
        </View>
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
});
