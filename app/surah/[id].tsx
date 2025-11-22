import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AyahList from '../../components/AyahList';
import LanguageSelector from '../../components/LanguageSelector';

export default function SurahDetail() {
  const { id } = useLocalSearchParams();
  const surahIndex = Array.isArray(id) ? id[0] : id;
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: `Surah ${surahIndex}`,
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setModalVisible(true)} 
              style={{ 
                marginRight: 10, 
                backgroundColor: '#FFD700', // Yellow
                padding: 8, 
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Ionicons name="settings-outline" size={20} color="black" />
            </TouchableOpacity>
          )
        }} 
      />
      <AyahList surahIndex={surahIndex || '001'} />
      <LanguageSelector visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
