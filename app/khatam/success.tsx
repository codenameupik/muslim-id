import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { translations } from "../../constants/i18n";
import { Fonts } from "../../constants/theme";
import { useSettings } from "../../context/SettingsContext";

export default function KhatamSuccess() {
  const router = useRouter();
  const {
    theme,
    themeColor,
    khatamPlan,
    saveKhatamPlan,
    saveCompletedKhatam,
    appLanguage,
  } = useSettings();
  const t = translations[appLanguage];
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12 });
  }, [scale]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleFinish = async () => {
    if (khatamPlan) {
      // Archive current plan to history
      await saveCompletedKhatam({
        ...khatamPlan,
        status: "completed",
        currentPage: 604,
        endDate: Date.now(),
      });

      // Reset for a new plan
      await saveKhatamPlan(null);
    }
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View
          style={[styles.header, animatedIconStyle]}
          entering={FadeInUp.delay(200)}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: themeColor + "20" },
            ]}
          >
            <Ionicons name="ribbon" size={64} color={themeColor} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            Alhamdulillah!
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t.khatam.congrats}
          </Text>
        </Animated.View>

        <Animated.View
          style={[styles.duaCard, { backgroundColor: theme.card }]}
          entering={FadeInDown.delay(400).springify()}
        >
          <Text style={[styles.duaTitle, { color: themeColor }]}>
            {t.khatam.duaTitle}
          </Text>
          <Text style={[styles.arabic, { color: theme.text }]}>
            اللَّهُمَّ ارْحَمْنِي بِالْقُرْآنِ وَاجْعَلْهُ لِي إِمَامًا وَنُورًا
            وَهُدًى وَرَحْمَةً
          </Text>
          <Text style={[styles.translation, { color: theme.textSecondary }]}>
            O Allah, have mercy on me through the Quran, and make it for me a
            leader, a light, a guidance, and a mercy.
          </Text>
          <Text style={[styles.arabic, { color: theme.text, marginTop: 16 }]}>
            اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا
            جَهِلْتُ وَارْزُقْنِي تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ
            النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ الْعَالَمِينَ
          </Text>
          <Text style={[styles.translation, { color: theme.textSecondary }]}>
            O Allah, remind me of what I have forgotten from it, and teach me
            what I am ignorant of from it, and grant me its recitation during
            the hours of the night and the edges of the day, and make it a proof
            for me, O Lord of the worlds.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: themeColor }]}
            onPress={handleFinish}
          >
            <Text style={styles.buttonText}>{t.khatam.startNew}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.heading,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.body,
    textAlign: "center",
  },
  duaCard: {
    width: "100%",
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  duaTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading,
    marginBottom: 16,
    textAlign: "center",
  },
  arabic: {
    fontSize: 24,
    fontFamily: "Amiri-Regular",
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 12,
  },
  translation: {
    fontSize: 14,
    fontFamily: Fonts.body,
    textAlign: "center",
    lineHeight: 22,
    fontStyle: "italic",
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: "100%",
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
});
