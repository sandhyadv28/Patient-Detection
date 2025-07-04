import { environment } from '../environments/environment.staging';

// API configuration for image requests
const IMAGE_API_CONFIG = {
  BASE_URL: 'https://staging.cloudphysicianworld.com/api/',
  HEADERS: {
    'ai-api-key': 'secret',
    'hospital-name': 'Adarsha Hospital - Karimnagar',
    'hospital-unit': 'ICU',
    'Content-Type': 'application/json',
  },
};

export interface ImageApiResponse {
  success: boolean;
  data?: string; // Base64 encoded image or image URL
  error?: string;
}

/**
 * Fetch patient detection image by image key
 * @param imageKey - The image key from the detection record
 * @returns Promise with image data
 */
export const fetchPatientImage = async (imageKey: string): Promise<string> => {
  try {
    const encodedImageKey = encodeURIComponent(imageKey);
    const url = `${IMAGE_API_CONFIG.BASE_URL}pdd/detailed/per-slot/image?image_key=${encodedImageKey}`;
    
    console.log('Fetching image from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: IMAGE_API_CONFIG.HEADERS,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Image API request failed with status ${response.status}: ${errorText}`);
    }

    // Check if response is an image
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.startsWith('image/')) {
      // Return the image URL directly if it's an image response
      return url;
    }

    // If it's JSON response with image data
    const data: ImageApiResponse = await response.json();
    if (data.success && data.data) {
      return data.data;
    }

    throw new Error(data.error || 'Failed to fetch image data');
  } catch (error) {
    console.error('Error fetching patient image:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the image API server.');
    }
    throw error;
  }
};

/**
 * Get image URL for display (handles both direct URLs and base64 data)
 * @param imageKey - The image key from the detection record
 * @returns Promise with image URL or base64 data
 */
export const getImageUrl = async (imageKey: string): Promise<string> => {
  try {
    const imageData = await fetchPatientImage(imageKey);
    
    // If it's already a URL, return it
    if (imageData.startsWith('http')) {
      return imageData;
    }
    
    // If it's base64 data, return it as data URL
    if (imageData.startsWith('data:')) {
      return imageData;
    }
    
    // If it's base64 without data URL prefix, add it
    if (imageData.startsWith('/9j/') || imageData.startsWith('iVBORw0KGgo')) {
      return `data:image/jpeg;base64,${imageData}`;
    }
    
    return imageData;
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
}; 