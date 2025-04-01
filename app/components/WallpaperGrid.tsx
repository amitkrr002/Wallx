import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import WallpaperCard from "./WallpaperCard";

interface Wallpaper {
  id: string;
  imageUrl: string;
  title: string;
  isFavorite: boolean;
  category?: string;
}

interface WallpaperGridProps {
  title?: string;
  wallpapers?: Wallpaper[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  category?: string;
}

const WallpaperGrid = ({
  title = "Trending Wallpapers",
  wallpapers = [
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
  ],
  isLoading = false,
  onRefresh = () => {},
  onEndReached = () => {},
  category = "",
}: WallpaperGridProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Initialize favorites from wallpapers prop
  useEffect(() => {
    const initialFavorites: Record<string, boolean> = {};
    wallpapers.forEach((wallpaper) => {
      if (wallpaper.isFavorite) {
        initialFavorites[wallpaper.id] = true;
      }
    });
    setFavorites(initialFavorites);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    onRefresh();
    // Simulate refresh completion after 1.5 seconds
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    // Can be used for parallax effects or hiding/showing elements on scroll
  });

  // Render a grid item
  const renderItem = ({ item, index }: { item: Wallpaper; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      className="flex-1"
    >
      <WallpaperCard
        id={item.id}
        imageUrl={item.imageUrl}
        title={item.title}
        isFavorite={favorites[item.id] || false}
        onFavoriteToggle={handleFavoriteToggle}
      />
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-gray-100 dark:bg-gray-900">
      {title && (
        <View className="px-4 py-2">
          <Text className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {title}
          </Text>
        </View>
      )}

      {isLoading && wallpapers.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="mt-4 text-gray-600 dark:text-gray-400">
            Loading wallpapers...
          </Text>
        </View>
      ) : (
        <Animated.FlatList
          data={wallpapers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                {category
                  ? `No wallpapers found in ${category}`
                  : "No wallpapers found"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default WallpaperGrid;
