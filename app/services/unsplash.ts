// Unsplash API service

const UNSPLASH_API_KEY = "FdYuWIiLfuqafC3kBGEHlysxTUO02U6y0KMmd9h7Be0";
const UNSPLASH_API_URL = "https://api.unsplash.com";

export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
  };
}

export interface WallpaperItem {
  id: string;
  imageUrl: string;
  title: string;
  isFavorite: boolean;
  category?: string;
  author?: string;
  downloadUrl?: string;
}

// Convert Unsplash photo to our app's wallpaper format
export const mapUnsplashToWallpaper = (
  photo: UnsplashPhoto,
): WallpaperItem => ({
  id: photo.id,
  imageUrl: photo.urls.regular,
  title: photo.alt_description || photo.description || "Untitled Wallpaper",
  isFavorite: false,
  author: photo.user.name,
  downloadUrl: photo.urls.full,
});

// Fetch random photos
export const getRandomPhotos = async (count = 10): Promise<WallpaperItem[]> => {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?count=${count}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const photos: UnsplashPhoto[] = await response.json();
    return photos.map(mapUnsplashToWallpaper);
  } catch (error) {
    console.error("Error fetching random photos:", error);
    return [];
  }
};

// Search photos by query
export const searchPhotos = async (
  query: string,
  page = 1,
  perPage = 20,
): Promise<{ results: WallpaperItem[]; total: number }> => {
  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(
        query,
      )}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      results: data.results.map(mapUnsplashToWallpaper),
      total: data.total,
    };
  } catch (error) {
    console.error("Error searching photos:", error);
    return { results: [], total: 0 };
  }
};

// Get photos by category/collection
export const getPhotosByCategory = async (
  category: string,
  page = 1,
  perPage = 20,
): Promise<WallpaperItem[]> => {
  try {
    // For simplicity, we're using search with the category as the query
    // In a real app, you might want to map categories to collection IDs
    const { results } = await searchPhotos(category, page, perPage);

    // Add the category to each wallpaper
    return results.map((wallpaper) => ({
      ...wallpaper,
      category,
    }));
  } catch (error) {
    console.error(`Error fetching photos for category ${category}:`, error);
    return [];
  }
};

// Get a single photo by ID
export const getPhotoById = async (
  id: string,
): Promise<WallpaperItem | null> => {
  try {
    const response = await fetch(`${UNSPLASH_API_URL}/photos/${id}`, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const photo: UnsplashPhoto = await response.json();
    return mapUnsplashToWallpaper(photo);
  } catch (error) {
    console.error(`Error fetching photo with ID ${id}:`, error);
    return null;
  }
};
