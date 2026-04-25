// Image upload utility with support for local storage and IPFS (Web3)

export interface UploadResult {
  url: string;
  hash?: string; // IPFS hash if using Web3 storage
  type: 'local' | 'ipfs';
  fileName?: string;
  mimeType?: string;
}

// Convert image to base64 for local storage
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Upload to IPFS (using Pinata or similar service)
export const uploadToIPFS = async (file: File): Promise<UploadResult> => {
  try {
    // For demo purposes, we'll use a mock IPFS service
    // In production, integrate with Pinata, NFT.Storage, or Web3.Storage
    
    const formData = new FormData();
    formData.append('file', file);

    // Mock IPFS upload - replace with actual IPFS service
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY || '',
        'pinata_secret_api_key': import.meta.env.VITE_PINATA_SECRET_KEY || '',
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return {
        url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
        hash: data.IpfsHash,
        type: 'ipfs',
        fileName: file.name,
        mimeType: file.type,
      };
    } else {
      // Fallback to local storage if IPFS fails
      return uploadLocally(file);
    }
  } catch (error) {
    console.error('IPFS upload failed, using local storage:', error);
    return uploadLocally(file);
  }
};

// Upload to local storage (base64)
export const uploadLocally = async (file: File): Promise<UploadResult> => {
  const base64 = await imageToBase64(file);
  
  // Store in localStorage (for demo - in production, use backend)
  const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem(`image_${imageId}`, base64);
  
  return {
    url: base64,
    type: 'local',
    fileName: file.name,
    mimeType: file.type,
  };
};

// Main upload function
export const uploadImage = async (
  file: File,
  useWeb3: boolean = false,
  maxSizeMB: number = 5
): Promise<UploadResult> => {
  // Check file size
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File size must be less than ${maxSizeMB}MB`);
  }

  if (useWeb3) {
    try {
      return await uploadToIPFS(file);
    } catch (error) {
      console.error('Web3 upload failed, falling back to local:', error);
      return uploadLocally(file);
    }
  } else {
    return uploadLocally(file);
  }
};

// Get image from storage
export const getImage = (imageId: string): string | null => {
  return localStorage.getItem(`image_${imageId}`);
};

// Delete image
export const deleteImage = (imageId: string): void => {
  localStorage.removeItem(`image_${imageId}`);
};

