import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { X, Sparkles, Send, Wand2 } from "lucide-react-native";

interface AISearchModalProps {
  isVisible?: boolean;
  onClose?: () => void;
  onGenerate?: (prompt: string) => Promise<void>;
}

const SUGGESTED_KEYWORDS = [
  "Abstract",
  "Nature",
  "Minimal",
  "Dark",
  "Neon",
  "Space",
  "Cyberpunk",
  "Watercolor",
  "Geometric",
  "Anime",
];

const AISearchModal = ({
  isVisible = true,
  onClose = () => {},
  onGenerate = async () => {},
}: AISearchModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  if (!isVisible) return null;

  const handleAddKeyword = (keyword: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPrompt((prev) => {
      if (prev.length === 0) return keyword;
      return `${prev}, ${keyword}`;
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsGenerating(true);

    try {
      await onGenerate(prompt);
      // For demo purposes, set a placeholder image
      setGeneratedImage(
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
      );
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPrompt("");
    setGeneratedImage(null);
  };

  return (
    <View className="absolute inset-0 flex justify-end z-50 bg-black/50">
      <BlurView intensity={20} className="absolute inset-0" />

      <View className="bg-gray-900 rounded-t-3xl p-6 h-[500px]">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-xl font-bold">
            AI Wallpaper Generator
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 rounded-full bg-gray-800"
          >
            <X size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {generatedImage ? (
          <View className="flex-1 items-center justify-center">
            <Image
              source={{ uri: generatedImage }}
              className="w-full h-[300px] rounded-xl"
              contentFit="cover"
            />
            <View className="flex-row mt-4 space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-800 p-3 rounded-xl flex-row justify-center items-center"
                onPress={handleReset}
              >
                <Text className="text-white font-medium">Try Another</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-blue-600 p-3 rounded-xl flex-row justify-center items-center"
                onPress={onClose}
              >
                <Text className="text-white font-medium">Use This</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Prompt Input */}
            <View className="bg-gray-800 rounded-xl p-3 mb-4 flex-row items-center">
              <Wand2 size={20} color="#9ca3af" className="mr-2" />
              <TextInput
                className="flex-1 text-white text-base"
                placeholder="Describe your perfect wallpaper..."
                placeholderTextColor="#9ca3af"
                value={prompt}
                onChangeText={setPrompt}
                multiline
              />
              {prompt.length > 0 && (
                <TouchableOpacity onPress={handleReset} className="p-1">
                  <X size={18} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>

            {/* Suggested Keywords */}
            <Text className="text-gray-400 mb-2 text-sm">
              Suggested Keywords
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
            >
              <View className="flex-row space-x-2">
                {SUGGESTED_KEYWORDS.map((keyword) => (
                  <TouchableOpacity
                    key={keyword}
                    className="bg-gray-800 px-3 py-2 rounded-full"
                    onPress={() => handleAddKeyword(keyword)}
                  >
                    <Text className="text-white">{keyword}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Generate Button */}
            <TouchableOpacity
              className={`bg-blue-600 p-4 rounded-xl flex-row justify-center items-center ${!prompt.trim() ? "opacity-50" : ""}`}
              onPress={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Sparkles size={20} color="#fff" className="mr-2" />
                  <Text className="text-white font-bold text-lg">Generate</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Tips */}
            <View className="mt-6 bg-gray-800/50 p-3 rounded-lg">
              <Text className="text-gray-400 text-sm">
                💡 Tip: Be specific with colors, style, and mood for better
                results
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default AISearchModal;
