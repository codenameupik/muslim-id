import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import AyahList from '../../components/AyahList';

export default function SurahDetail() {
  const { id } = useLocalSearchParams();
  const surahIndex = Array.isArray(id) ? id[0] : id;

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: `Surah ${surahIndex}`,
        }} 
      />
      <AyahList surahIndex={surahIndex || '001'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
