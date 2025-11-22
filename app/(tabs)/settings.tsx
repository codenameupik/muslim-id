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
  const { language, setLanguage, themeColor, setThemeColor } = useSettings();

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
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation: 2,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
