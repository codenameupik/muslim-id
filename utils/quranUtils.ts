import { LastReadBookmark } from "../context/SettingsContext";

/**
 * Compares two reading positions and returns true if newPosition is more advanced than currentPosition
 * Returns true if newPosition should replace currentPosition
 *
 * @param newPosition - The new reading position to compare
 * @param currentPosition - The current saved reading position
 * @returns true if newPosition is more advanced and should replace currentPosition
 */
export function isMoreAdvanced(
  newPosition: LastReadBookmark,
  currentPosition: LastReadBookmark | null,
): boolean {
  if (!currentPosition) return true;

  // Get surah index - for juz type, use surahIndex field, for surah type use id
  const newSurahIndex = parseInt(newPosition.surahIndex || newPosition.id, 10);
  const currentSurahIndex = parseInt(
    currentPosition.surahIndex || currentPosition.id,
    10,
  );

  // Compare surah index first
  if (newSurahIndex > currentSurahIndex) return true;
  if (newSurahIndex < currentSurahIndex) return false;

  // Same surah, compare ayah number
  return newPosition.ayah > currentPosition.ayah;
}
