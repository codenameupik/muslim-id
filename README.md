# Muslim ID

Muslim ID is a comprehensive Islamic companion application built with React Native and Expo. It provides essential tools and resources for the daily life of a Muslim, designed with a modern and intuitive user interface.

## Features

- **📖 Al-Quran**: Read the Holy Quran with easy navigation by Surah or Juz.
- **🕌 Prayer Times**: Accurate prayer times based on your location.
- **🧭 Qibla Compass**: Find the Qibla direction anywhere in the world.
- **📅 Islamic Calendar**: View Hijri dates and important Islamic events.
- **🤲 Duas**: A collection of authentic supplications for various occasions.
- **🔍 Search**: Quickly find Surahs, Duas, and other content.
- **⚙️ Customization**: Settings to tailor the app to your preferences.

## APIs & Data Sources

- **[Aladhan API](https://aladhan.com/prayer-times-api)**: Used for accurate Prayer Times, Hijri Calendar, and Qibla direction.
- **[Quran JSON](https://github.com/semarketir/quranjson)**: Source for Quran text and translations.
- **[Dua & Dhikr](https://github.com/fitrahive/dua-dhikr)**: Collection of authentic Duas and Dhikr.

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Icons**: [Expo Symbols](https://docs.expo.dev/versions/latest/sdk/symbols/) / SF Symbols
- **Styling**: React Native StyleSheet

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/codenameupik/muslim-id.git
    cd muslim-id
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the app:

    ```bash
    npx expo start
    ```

4.  Use the Expo Go app on your phone to scan the QR code, or run on an emulator/simulator.

## Project Structure

- `app/`: Main application source code (Expo Router screens).
- `components/`: Reusable UI components.
- `constants/`: App constants and configuration.
- `hooks/`: Custom React hooks.
- `assets/`: Images, fonts, and other static assets.

## Screenshots

<div style="display: flex; flex-direction: row; gap: 10px; overflow-x: auto;">
  <!-- Add your screenshots here -->
  <!-- <img src="./assets/screenshots/home.png" width="200" /> -->
  <!-- <img src="./assets/screenshots/quran.png" width="200" /> -->
</div>

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
