import React, { useState } from "react";
import { View, TouchableOpacity, Pressable, Modal } from "react-native";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import { Home, Grid, Heart, Settings, Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";

interface BottomNavBarProps {
  currentRoute?: string;
}

const BottomNavBar = ({ currentRoute = "home" }: BottomNavBarProps) => {
  const router = useRouter();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleNavigation = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (route === "ai-search") {
      setIsSearchModalOpen(true);
    } else {
      router.push(`/${route === "home" ? "" : route}`);
    }
  };

  return (
    <View className="bg-white dark:bg-gray-900 w-full">
      {/* Main Navigation Bar */}
      <View className="flex-row items-center justify-between px-4 h-20 pb-6 pt-2 border-t border-gray-200 dark:border-gray-800">
        {/* Home Button */}
        <NavButton
          icon={
            <Home
              size={24}
              color={currentRoute === "home" ? "#3b82f6" : "#6b7280"}
            />
          }
          label="Home"
          isActive={currentRoute === "home"}
          onPress={() => handleNavigation("home")}
        />

        {/* Categories Button */}
        <NavButton
          icon={
            <Grid
              size={24}
              color={currentRoute === "categories" ? "#3b82f6" : "#6b7280"}
            />
          }
          label="Categories"
          isActive={currentRoute === "categories"}
          onPress={() => handleNavigation("categories")}
        />

        {/* AI Search Button (Center, Prominent) */}
        <View className="-mt-6 relative">
          <Pressable
            className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center shadow-lg"
            style={{
              shadowColor: "#3b82f6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4.65,
              elevation: 8,
            }}
            onPress={() => handleNavigation("ai-search")}
          >
            <View className="items-center justify-center">
              <Plus size={32} color="#ffffff" />
            </View>
          </Pressable>
          <Text className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">
            AI Search
          </Text>
        </View>

        {/* Favorites Button */}
        <NavButton
          icon={
            <Heart
              size={24}
              color={currentRoute === "favorites" ? "#3b82f6" : "#6b7280"}
            />
          }
          label="Favorites"
          isActive={currentRoute === "favorites"}
          onPress={() => handleNavigation("favorites")}
        />

        {/* Settings Button */}
        <NavButton
          icon={
            <Settings
              size={24}
              color={currentRoute === "settings" ? "#3b82f6" : "#6b7280"}
            />
          }
          label="Settings"
          isActive={currentRoute === "settings"}
          onPress={() => handleNavigation("settings")}
        />
      </View>

      {/* Temporary placeholder for AISearchModal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSearchModalOpen}
        onRequestClose={() => setIsSearchModalOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-gray-900 rounded-t-3xl p-6 h-2/3">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold dark:text-white">
                AI Wallpaper Generator
              </Text>
              <TouchableOpacity onPress={() => setIsSearchModalOpen(false)}>
                <Text className="text-blue-500 text-lg">Close</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-gray-600 dark:text-gray-400 mb-4">
              Enter a prompt to generate a unique AI wallpaper
            </Text>
            <View className="h-12 bg-gray-100 dark:bg-gray-800 rounded-full px-4 mb-4 justify-center">
              <Text className="text-gray-400">Type your prompt here...</Text>
            </View>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {[
                "Nature",
                "Abstract",
                "Minimal",
                "Space",
                "Neon",
                "Cyberpunk",
              ].map((keyword) => (
                <View
                  key={keyword}
                  className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1"
                >
                  <Text className="text-sm dark:text-white">{keyword}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity className="bg-blue-500 h-12 rounded-full items-center justify-center">
              <Text className="text-white font-medium">Generate Wallpaper</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const NavButton = ({ icon, label, isActive, onPress }: NavButtonProps) => {
  return (
    <TouchableOpacity
      className="items-center justify-center w-16"
      onPress={onPress}
    >
      {icon}
      <Text
        className={`text-xs mt-1 ${isActive ? "text-blue-500 font-medium" : "text-gray-600 dark:text-gray-400"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default BottomNavBar;
