import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const THEME_COLORS = [
  { name: 'Teal', value: '#00695c' },
  { name: 'Blue', value: '#1976D2' },
  { name: 'Purple', value: '#7B1FA2' },
  { name: 'Orange', value: '#E64A19' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { language, setLanguage, themeColor, setThemeColor } = useSettings();

  const handleLanguageSelect = (lang: 'en' | 'id' | null) => {
    setLanguage(lang);
  };

  const handleThemeSelect = (color: string) => {
    setThemeColor(color as any);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView>
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

            <View style={styles.divider} />

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

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: themeColor }]}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
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
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
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
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  closeButton: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default SettingsModal;
