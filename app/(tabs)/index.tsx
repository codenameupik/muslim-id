import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import SurahList from '../../components/SurahList';

export default function Home() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Muslim ID' }} />
      <SurahList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
