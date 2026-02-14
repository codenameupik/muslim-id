import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { translations } from "../../constants/i18n";
import { Fonts } from "../../constants/theme";
import { useSettings } from "../../context/SettingsContext";

export default function KhatamSetup() {
  const router = useRouter();
  const { theme, themeColor, saveKhatamPlan, appLanguage } = useSettings();
  const t = translations[appLanguage];
  const [days, setDays] = useState("30");

  const handleCreatePlan = async () => {
    const targetDays = parseInt(days, 10);
    if (isNaN(targetDays) || targetDays <= 0) {
      Alert.alert(t.common.invalidInput, t.common.invalidPages);
      return;
    }

    const newPlan = {
      id: Date.now().toString(),
      startDate: Date.now(),
      targetDays,
      currentJuz: 1,
      currentPage: 1,
      status: "active" as const,
      history: [],
    };

    await saveKhatamPlan(newPlan);
    router.replace("/(tabs)");
  };

  const dailyPages = Math.ceil(604 / (parseInt(days, 10) || 30));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: t.khatam.setupTitle,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: Fonts.heading },
        }}
      />

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {t.khatam.daysTarget}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border },
              ]}
              value={days}
              onChangeText={setDays}
              keyboardType="number-pad"
              maxLength={3}
            />
            <Text style={[styles.unit, { color: theme.text }]}>
              {t.khatam.days}
            </Text>
          </View>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {t.khatam.pagesPerDay}:
          </Text>
          <View
            style={[styles.targetBox, { backgroundColor: themeColor + "15" }]}
          >
            <Text style={[styles.targetNumber, { color: themeColor }]}>
              {dailyPages}
            </Text>
            <Text style={[styles.targetLabel, { color: themeColor }]}>
              {t.khatam.pages} / {t.khatam.days}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: themeColor }]}
          onPress={handleCreatePlan}
        >
          <Text style={styles.createButtonText}>{t.khatam.createPlan}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
  },
  card: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontFamily: Fonts.body,
    marginRight: 12,
  },
  unit: {
    fontSize: 16,
    fontFamily: Fonts.body,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.body,
    marginBottom: 16,
    textAlign: "center",
  },
  targetBox: {
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
  },
  targetNumber: {
    fontSize: 36,
    fontFamily: Fonts.heading,
    marginBottom: 4,
  },
  targetLabel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
  },
  createButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
});
