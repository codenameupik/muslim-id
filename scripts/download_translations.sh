#!/bin/bash

# Create directories
mkdir -p assets/quran/translation/en
mkdir -p assets/quran/translation/id

# Download English Translations
echo "Downloading English Translations..."
for i in {1..114}
do
   echo "Downloading English Surah $i..."
   curl -s "https://raw.githubusercontent.com/semarketir/quranjson/master/source/translation/en/en_translation_$i.json" -o "assets/quran/translation/en/en_translation_$i.json"
done

# Download Indonesian Translations
echo "Downloading Indonesian Translations..."
for i in {1..114}
do
   echo "Downloading Indonesian Surah $i..."
   curl -s "https://raw.githubusercontent.com/semarketir/quranjson/master/source/translation/id/id_translation_$i.json" -o "assets/quran/translation/id/id_translation_$i.json"
done

echo "Translation download complete!"
