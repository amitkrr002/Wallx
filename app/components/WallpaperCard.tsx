import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Image } from "expo-image";
import { Heart } from "lucide-react-native";
import { useRouter } from "expo-router";

interface WallpaperCardProps {
  id?: string;
  imageUrl?: string;
  title?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

const WallpaperCard = ({
  id = "wallpaper-1",
  imageUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
  title = "Abstract Wave",
  isFavorite = false,
  onFavoriteToggle = () => {},
}: WallpaperCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    // Navigate to wallpaper detail/set screen
    router.push(`/wallpaper/${id}`);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    onFavoriteToggle(id);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden m-1 shadow-md"
      style={{ width: 180, height: 320 }}
    >
      <View className="relative w-full h-full">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          contentFit="cover"
          transition={300}
        />
        <View className="absolute bottom-0 left-0 right-0 p-2 bg-black/30 backdrop-blur-sm">
          <Text className="text-white font-medium text-sm">{title}</Text>
        </View>
        <TouchableOpacity
          onPress={handleFavoritePress}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/20 backdrop-blur-sm"
        >
          <Heart
            size={20}
            color="white"
            fill={isFavorite ? "white" : "transparent"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default WallpaperCard;
