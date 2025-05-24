/**
 * Utility functions for image processing
 */

/**
 * Compresses an image file to the specified dimensions and quality
 * @param file The image file to compress
 * @param maxWidth Maximum width of the compressed image
 * @param maxHeight Maximum height of the compressed image
 * @param quality JPEG quality (0-1)
 * @returns A data URL of the compressed image
 */
export async function compressImage(
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width
          let height = img.height
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width)
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height)
              height = maxHeight
            }
          }
          
          // Create canvas and draw resized image
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          
          // Convert to data URL with specified quality
          const dataUrl = canvas.toDataURL('image/jpeg', quality)
          resolve(dataUrl)
        }
        
        img.onerror = () => {
          reject(new Error('Failed to load image'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Compresses an image data URL to the specified dimensions and quality
 * @param dataUrl The data URL of the image to compress
 * @param maxWidth Maximum width of the compressed image
 * @param maxHeight Maximum height of the compressed image
 * @param quality JPEG quality (0-1)
 * @returns A data URL of the compressed image
 */
export async function compressImageFromDataUrl(
  dataUrl: string,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.src = dataUrl
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width
        let height = img.height
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Convert to data URL with specified quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image from data URL'))
      }
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Converts a data URL to a Blob for API uploads
 * @param dataUrl The data URL to convert
 * @returns A Blob of the image
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new Blob([u8arr], { type: mime })
}

/**
 * Prepares an image for the LLM API by compressing and converting to appropriate format
 * @param imageSource Data URL of the image
 * @returns Base64 encoded image string (without the data URL prefix)
 */
export function prepareImageForLLM(imageSource: string): string {
  // Check if the image is already in a data URL format
  if (!imageSource || typeof imageSource !== 'string' || !imageSource.startsWith('data:')) {
    throw new Error('Invalid image source format. Expected a data URL.');
  }
  
  // Extract base64 data from data URL (remove the prefix)
  const base64Data = imageSource.split(',')[1];
  
  // Verify that we have valid base64 data
  if (!base64Data) {
    throw new Error('Failed to extract base64 data from image source.');
  }
  
  return base64Data;
}

/**
 * Generates a prompt for the LLM to identify plastic type from image
 * @param base64Image Base64 encoded image string
 * @returns Structured prompt for the LLM
 */
export function generatePlasticIdentificationPrompt(base64Image: string): any {
  // Log image data length to help with debugging
  console.log(`Base64 image data length: ${base64Image.length} characters`);

  return {
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: `Analyze this image of a plastic item and identify the plastic type with high precision.
            
            IMPORTANT CONSIDERATIONS:
            - Focus on the recycling symbol (triangle with a number 1-7 inside) if visible
            - Look for texture, color, transparency, and other visual characteristics of the plastic
            - Consider the shape and purpose of the item for contextual clues
            - If uncertain, provide your best estimate with appropriate confidence level
            
            DETAILED RESPONSE REQUIRED:
            1. The exact plastic type name (e.g., "Polyethylene Terephthalate", "High-Density Polyethylene")
            2. The recycling code (1-7) with 7 being "Other" or unknown plastics
            3. A detailed description of common uses and characteristics
            4. Whether it's commonly recyclable in standard facilities
            5. Your confidence level of identification as a percentage (0-100)
            6. Environmental impact assessment (decomposition time, toxicity concerns, etc.)
            7. At least 3 specific usage tips or safe handling practices
            
            FORMAT RESPONSE AS A STRUCTURED JSON OBJECT:
            {
              "plasticType": string,       // Full name of plastic type
              "recyclingCode": number,     // Number between 1-7
              "description": string,       // 2-3 sentences about the plastic
              "recyclable": boolean,       // true/false
              "confidence": number,        // 0-100
              "environmentalImpact": string, // Environmental concerns
              "usageTips": string[]        // Array of handling tips
            }
            
            If you cannot identify the plastic type with at least 40% confidence, return a JSON with default values, low confidence, and recommendations for better identification.`
          }
        ]
      }
    ]
  }
}

/**
 * Converts a data URL to a Blob
 * 
 * @param dataURL - The data URL to convert
 * @returns The resulting Blob
 */
export function dataURLtoBlob(dataURL: string): Blob {
  // Convert base64 to raw binary data held in a string
  const byteString = atob(dataURL.split(',')[1]);
  
  // Separate out the mime component
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  
  // Write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  // Create a blob with the binary data and its MIME type
  return new Blob([ab], { type: mimeString });
}

/**
 * Extracts a base64 string from an image data URL
 * 
 * @param dataURL - The data URL to extract from
 * @returns The base64 part of the data URL
 */
export function extractBase64FromDataURL(dataURL: string): string {
  return dataURL.split(',')[1];
}

/**
 * Get file size in a readable format
 * 
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.2 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 