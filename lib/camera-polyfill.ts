/**
 * Camera access polyfill and utilities to handle cross-browser compatibility
 */

// Define a check for browser environment
const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';

// Legacy browsers support
if (isBrowser) {
  // Ensure navigator.mediaDevices exists
  if (!navigator.mediaDevices) {
    // @ts-ignore - Adding mediaDevices object for older browsers
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices
  // We need to check if getUserMedia is a function
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = (constraints) => {
      // First get hold of the legacy getUserMedia, if present
      const getUserMedia = 
        navigator.getUserMedia ||
        // @ts-ignore - Older browser method names
        navigator.webkitGetUserMedia ||
        // @ts-ignore
        navigator.mozGetUserMedia ||
        // @ts-ignore
        navigator.msGetUserMedia;

      // Some browsers just don't implement it - return an error with an informative message
      if (!getUserMedia) {
        return Promise.reject(
          new Error('getUserMedia is not implemented in this browser')
        );
      }

      // Otherwise, wrap the legacy call in a Promise
      return new Promise((resolve, reject) => {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
}

/**
 * Check if the camera is supported in the current browser
 * @returns boolean indicating if camera is supported
 */
export function isCameraSupported(): boolean {
  return !!(isBrowser && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Request camera access with better error handling
 * @param constraints MediaStreamConstraints for the camera
 * @returns Promise with the media stream
 */
export async function requestCameraAccess(
  constraints: MediaStreamConstraints
): Promise<MediaStream> {
  if (!isCameraSupported()) {
    throw new Error("Camera is not supported in this browser");
  }

  try {
    // Try to get camera access
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    // Handle specific error types and provide user-friendly messages
    if (err instanceof Error) {
      switch (err.name) {
        case "NotAllowedError":
          throw new Error(
            "Camera access denied. Please allow camera access in your browser settings."
          );
        case "NotFoundError":
          throw new Error(
            "No camera found. Please ensure your device has a working camera."
          );
        case "NotReadableError":
          throw new Error(
            "Camera is in use by another application or not accessible."
          );
        case "OverconstrainedError":
          throw new Error(
            "The requested camera constraints cannot be satisfied."
          );
        case "SecurityError":
          throw new Error(
            "Camera access is restricted due to security policy."
          );
        case "AbortError":
          throw new Error("Camera access request was aborted.");
        default:
          throw new Error(`Camera error: ${err.message}`);
      }
    }
    // For non-Error types
    throw new Error("Failed to access camera for an unknown reason");
  }
}

/**
 * Get all available camera devices
 * @returns Promise with array of input devices (cameras)
 */
export async function getAvailableCameras(): Promise<MediaDeviceInfo[]> {
  if (!isCameraSupported()) {
    return [];
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === "videoinput");
  } catch (err) {
    console.error("Error getting camera devices:", err);
    return [];
  }
}

/**
 * Check if the environment facing camera is available (rear camera on mobile)
 * @returns Promise with boolean indicating if environment camera is available
 */
export async function hasEnvironmentCamera(): Promise<boolean> {
  const cameras = await getAvailableCameras();
  return cameras.some(camera => 
    camera.label.toLowerCase().includes("back") || 
    camera.label.toLowerCase().includes("rear") ||
    camera.label.toLowerCase().includes("environment")
  );
}

/**
 * Get optimal camera constraints based on device
 * @param preferEnvironment Whether to prefer the environment-facing camera
 * @returns MediaStreamConstraints optimized for the current device
 */
export function getOptimalCameraConstraints(
  preferEnvironment: boolean = true
): MediaStreamConstraints {
  // Default constraints
  const constraints: MediaStreamConstraints = {
    video: {
      facingMode: preferEnvironment ? "environment" : "user",
      width: { ideal: 1280 },
      height: { ideal: 720 }
    },
    audio: false
  };

  return constraints;
} 