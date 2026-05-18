/**
 * Image compression utility to reduce localStorage quota usage
 * Converts images to compressed data URLs
 */

export async function compressImage(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 900,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed data URL
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Check localStorage quota usage
 */
export function getStorageUsage(): {
  used: number;
  limit: number;
  percentage: number;
} {
  let used = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }

  // Approximate limit (browsers typically allow 5-10MB)
  const limit = 5 * 1024 * 1024; // 5MB

  return {
    used,
    limit,
    percentage: (used / limit) * 100,
  };
}

/**
 * Clear old/unused data from localStorage to free up space
 */
export function clearOldData(): void {
  // This can be extended to remove old car listings if needed
  // For now, just logs usage
  const usage = getStorageUsage();
  console.log(
    `Storage usage: ${(usage.used / 1024 / 1024).toFixed(2)}MB / ${(usage.limit / 1024 / 1024).toFixed(2)}MB (${usage.percentage.toFixed(1)}%)`
  );
}
