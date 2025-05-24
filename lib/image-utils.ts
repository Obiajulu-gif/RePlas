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
            text: `## PLASTIC IDENTIFICATION AND ANALYSIS REQUEST

I need detailed analysis of this plastic item. Please analyze with high precision.

### VISUAL ANALYSIS GUIDELINES:
1. PRIMARY: Check for recycling symbol (triangular arrow symbol with number 1-7)
2. SECONDARY: Analyze visual properties:
   - Transparency: Clear, translucent, opaque?
   - Rigidity: Rigid, semi-rigid, flexible?
   - Surface: Glossy, matte, textured?
   - Color: Natural, colored, transparent?
   - Thickness: Thin film, moderate, thick?
3. CONTEXTUAL: Consider the item's apparent purpose/use case
4. ADVANCED: Note any identifying marks, product codes, or manufacturer information

### PLASTIC TYPES REFERENCE CHART:
| Code | Abbreviation | Full Name | Common Properties | Typical Uses |
|------|--------------|-----------|-------------------|--------------|
| 1    | PET/PETE     | Polyethylene Terephthalate | Clear, tough, barrier to gas/moisture | Water bottles, food containers |
| 2    | HDPE         | High-Density Polyethylene | Stiff, strong, resistant to moisture | Milk jugs, detergent bottles |
| 3    | PVC/V        | Polyvinyl Chloride | Rigid or flexible, good chemical resistance | Pipes, siding, medical tubing |
| 4    | LDPE         | Low-Density Polyethylene | Flexible, tough, moisture resistant | Plastic bags, squeeze bottles |
| 5    | PP           | Polypropylene | Heat resistant, chemical resistant, barrier to moisture | Yogurt containers, bottle caps |
| 6    | PS           | Polystyrene | Versatile, rigid or foamed, clear | Disposable cups, packaging |
| 7    | OTHER        | Various (PC, ABS, nylon, etc.) | Properties vary widely | Various specialty items |

### DETAILED RESPONSE REQUIRED:
Please provide a comprehensive analysis with the following components:

1. IDENTIFICATION:
   - Full plastic type name (e.g., "Polyethylene Terephthalate")
   - Recycling code (1-7) with reasoning for your classification
   - Confidence level (0-100%) with explanation for uncertainty if below 90%

2. CHARACTERISTICS:
   - Physical properties description
   - Common commercial uses
   - Key identifying features visible in the image

3. RECYCLABILITY:
   - Recyclability status in standard facilities
   - Any special recycling considerations
   - Regional variations in recyclability if relevant

4. ENVIRONMENTAL IMPACT:
   - Decomposition timeline
   - Environmental toxicity concerns
   - Marine impact if disposed improperly
   - Carbon footprint relative to other plastics

5. CONSUMER ADVICE:
   - Safe handling practices
   - Reuse potential and safety considerations
   - Eco-friendly alternatives
   - Proper disposal methods

### FORMAT RESPONSE AS A STRUCTURED JSON:
{
  "plasticType": string,       // Full scientific name of plastic
  "recyclingCode": number,     // Integer between 1-7
  "description": string,       // 2-3 sentences about properties and uses
  "recyclable": boolean,       // true/false with current technology
  "confidence": number,        // 0-100 percentage
  "environmentalImpact": string, // 1-2 sentences on ecological impact
  "usageTips": string[]        // Array of 3-5 handling/disposal recommendations
}

If identification confidence is below 40%, include recommendations for better identification methods in the usageTips field, but still provide your best assessment based on visible evidence.`
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