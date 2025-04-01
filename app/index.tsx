import React, { useState, useEffect } from "react";
import { View, SafeAreaView, StatusBar, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import WallpaperGrid from "./components/WallpaperGrid";
import BottomNavBar from "./components/BottomNavBar";
import AISearchModal from "./components/AISearchModal";
import {
  getRandomPhotos,
  searchPhotos,
  WallpaperItem,
} from "./services/unsplash";

// Create a simple header component directly in this file
const AppHeader = () => {
  return (
    <View className="w-full h-14 px-4 flex-row items-center justify-between bg-white dark:bg-gray-800">
      <Text className="text-xl font-bold text-gray-800 dark:text-white">
        WallX
      </Text>
      <View className="w-8 h-8" />
    </View>
  );
};

export default function HomeScreen() {
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [wallpapers, setWallpapers] = useState<WallpaperItem[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Fetch wallpapers when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchWallpapers();
      return () => {
        // Cleanup if needed
      };
    }, []),
  );

  const fetchWallpapers = async () => {
    setIsLoading(true);
    try {
      const photos = await getRandomPhotos(20);
      setWallpapers(photos);
    } catch (error) {
      console.error("Error fetching wallpapers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchWallpapers();
  };

  const handleLoadMore = async () => {
    try {
      const additionalPhotos = await getRandomPhotos(10);
      setWallpapers((prev) => [...prev, ...additionalPhotos]);
    } catch (error) {
      console.error("Error loading more wallpapers:", error);
    }
  };

  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = { ...prev, [id]: !prev[id] };
      return newFavorites;
    });

    setWallpapers((prev) =>
      prev.map((wallpaper) =>
        wallpaper.id === id
          ? { ...wallpaper, isFavorite: !wallpaper.isFavorite }
          : wallpaper,
      ),
    );
  };

  const handleGenerateWallpaper = async (prompt: string) => {
    setIsLoading(true);
    try {
      // Use search instead of AI generation since we're using Unsplash
      const { results } = await searchPhotos(prompt);
      if (results.length > 0) {
        // Add the first result as a "generated" wallpaper
        const generatedWallpaper = {
          ...results[0],
          title: prompt.substring(0, 20) + (prompt.length > 20 ? "..." : ""),
          category: "AI Generated",
        };

        setWallpapers((prev) => [generatedWallpaper, ...prev]);
      }
    } catch (error) {
      console.error("Error generating wallpaper:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View className="flex-1">
        <AppHeader />

        <WallpaperGrid
          title="Trending Wallpapers"
          wallpapers={wallpapers}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </View>

      <BottomNavBar
        currentRoute="home"
        onSearchPress={() => setIsSearchModalVisible(true)}
      />

      {isSearchModalVisible && (
        <AISearchModal
          isVisible={isSearchModalVisible}
          onClose={() => setIsSearchModalVisible(false)}
          onGenerate={handleGenerateWallpaper}
        />
      )}
    </SafeAreaView>
  );
}
