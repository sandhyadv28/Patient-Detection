import { environment } from '../environments/environment.staging';

// API configuration for image requests
const IMAGE_API_CONFIG = {
  BASE_URL: 'http://localhost:5173/api/',
  HEADERS: {
    'ai-api-key': 'secret',
    'hospital-name': 'Adarsha Hospital - Karimnagar',
    'hospital-unit': 'ICU',
    'accept': '*/*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'sec-ch-ua': '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
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
 * @returns Promise with image blob URL
 */
export const fetchPatientImage = async (imageKey: string): Promise<string> => {
  try {
    const encodedImageKey = encodeURIComponent(imageKey);
    const url = `${IMAGE_API_CONFIG.BASE_URL}pdd/detailed/per-slot/image?image_key=${encodedImageKey}`;
    
    console.log('Fetching image from:', url);
    console.log('Image key:', imageKey);
    console.log('Encoded image key:', encodedImageKey);
    console.log('Request headers:', IMAGE_API_CONFIG.HEADERS);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'ai-api-key': 'secret',
        'hospital-name': 'Adarsha Hospital - Karimnagar',
        'hospital-unit': 'ICU',
      },
    });

    console.log('Image API Response status:', response.status);
    console.log('Image API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image API Error response:', errorText);
      
      // Handle CORS errors specifically
      if (response.status === 0) {
        throw new Error('CORS error: Request was blocked by browser security policy. Please check if the API server allows cross-origin requests.');
      }
      
      throw new Error(`Image API request failed with status ${response.status}: ${errorText}`);
    }

    // Check if response is an image
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (contentType && contentType.startsWith('image/')) {
      // Response is a direct image, convert to blob URL
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      console.log('Created blob URL for image:', blobUrl);
      return blobUrl;
    }

    // If it's JSON response with image data
    try {
      const data: ImageApiResponse = await response.json();
      console.log('Image API JSON response:', data);
      
      if (data.success && (data.data || (data as any).url)) {
        return data.data || (data as any).url;
      }

      throw new Error(data.error || 'Failed to fetch image data');
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      throw new Error('Invalid response format from image API');
    }
  } catch (error) {
    console.error('Error fetching patient image:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      if (error.message.includes('CORS')) {
        throw new Error('CORS error: The image API server does not allow cross-origin requests from this domain. Please contact the API administrator.');
      }
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
    console.log('Getting image URL for key:', imageKey);
    const imageData = await fetchPatientImage(imageKey);
    
    // If it's already a URL (blob URL or http), return it
    if (imageData.startsWith('http') || imageData.startsWith('blob:')) {
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