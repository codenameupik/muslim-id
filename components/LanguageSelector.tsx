import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSettings } from '../context/SettingsContext';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ visible, onClose }) => {
  const { language, setLanguage } = useSettings();

  const handleSelect = (lang: 'en' | 'id' | null) => {
    setLanguage(lang);
    onClose();
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
          <Text style={styles.modalTitle}>Select Translation</Text>
          
          <TouchableOpacity
            style={[styles.option, language === 'en' && styles.selectedOption]}
            onPress={() => handleSelect('en')}
          >
            <Text style={[styles.optionText, language === 'en' && styles.selectedOptionText]}>English</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, language === 'id' && styles.selectedOption]}
            onPress={() => handleSelect('id')}
          >
            <Text style={[styles.optionText, language === 'id' && styles.selectedOptionText]}>Bahasa Indonesia</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, language === null && styles.selectedOption]}
            onPress={() => handleSelect(null)}
          >
            <Text style={[styles.optionText, language === null && styles.selectedOptionText]}>None</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
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
    padding: 35,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#e0f2f1',
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#00695c',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LanguageSelector;
