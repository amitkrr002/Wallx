import React, { useState } from "react";
import { View, SafeAreaView, StatusBar, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import WallpaperGrid from "./components/WallpaperGrid";
import BottomNavBar from "./components/BottomNavBar";
import AISearchModal from "./components/AISearchModal";

// Create a simple header component directly in this file since there seems to be an issue with the import
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
  const [isLoading, setIsLoading] = useState(false);
  const [wallpapers, setWallpapers] = useState([
    {
      id: "wall-1",
      imageUrl:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
      title: "Abstract Wave",
      isFavorite: false,
      category: "Abstract",
    },
    {
      id: "wall-2",
      imageUrl:
        "https://images.unsplash.com/photo-1516617442634-75371039cb3a?w=400&q=80",
      title: "Minimal Dark",
      isFavorite: true,
      category: "Minimal",
    },
    {
      id: "wall-3",
      imageUrl:
        "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80",
      title: "Mountain Sunset",
      isFavorite: false,
      category: "Nature",
    },
    {
      id: "wall-4",
      imageUrl:
        "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=400&q=80",
      title: "Neon City",
      isFavorite: false,
      category: "Urban",
    },
    {
      id: "wall-5",
      imageUrl:
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&q=80",
      title: "Geometric Art",
      isFavorite: false,
      category: "Abstract",
    },
    {
      id: "wall-6",
      imageUrl:
        "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80",
      title: "Colorful Gradient",
      isFavorite: false,
      category: "Abstract",
    },
    {
      id: "wall-7",
      imageUrl:
        "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&q=80",
      title: "Digital Universe",
      isFavorite: false,
      category: "Space",
    },
    {
      id: "wall-8",
      imageUrl:
        "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80",
      title: "Purple Haze",
      isFavorite: false,
      category: "Abstract",
    },
  ]);

  // Simulate fetching wallpapers when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const fetchWallpapers = async () => {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);
      };

      fetchWallpapers();

      return () => {
        // Cleanup if needed
      };
    }, []),
  );

  const handleRefresh = () => {
    // Simulate refreshing wallpapers
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleLoadMore = () => {
    // Simulate loading more wallpapers
    console.log("Loading more wallpapers...");
  };

  const handleGenerateWallpaper = async (prompt: string) => {
    // Simulate generating a wallpaper with AI
    console.log(`Generating wallpaper with prompt: ${prompt}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add the generated wallpaper to the list (in a real app, this would come from the API)
    const newWallpaper = {
      id: `wall-${Date.now()}`,
      imageUrl:
        "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&q=80",
      title: prompt.substring(0, 20) + (prompt.length > 20 ? "..." : ""),
      isFavorite: false,
      category: "AI Generated",
    };

    setWallpapers((prev) => [newWallpaper, ...prev]);
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
