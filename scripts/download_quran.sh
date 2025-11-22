#!/bin/bash

# Create directory
mkdir -p assets/quran/surah

# Download Surah list
echo "Downloading Surah list..."
curl -s "https://raw.githubusercontent.com/semarketir/quranjson/master/source/surah.json" -o assets/quran/surah.json

# Download each Surah
echo "Downloading Surahs..."
for i in {1..114}
do
   echo "Downloading Surah $i..."
   curl -s "https://raw.githubusercontent.com/semarketir/quranjson/master/source/surah/surah_$i.json" -o "assets/quran/surah/surah_$i.json"
done

echo "Download complete!"
