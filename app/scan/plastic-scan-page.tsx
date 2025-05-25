"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, Camera, Upload, Info, Trash2, Check, 
  AlertCircle, RefreshCw, Loader2, Recycle, 
  ImagePlus, CircleHelp, Scan
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { isCameraSupported as checkCameraSupport, requestCameraAccess } from "@/lib/camera-polyfill"

export default function PlasticScanPage() {
  const [imageSource, setImageSource] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCameraSupported, setIsCameraSupported] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const router = useRouter()

  // Check if camera is supported
  useEffect(() => {
    // Check camera support using our polyfill
    setIsCameraSupported(checkCameraSupport())
  }, [])

  // Function to handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const file = e.target.files?.[0]
    
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }
    
    try {
      setIsLoading(true)
      
      // Import the image compression utility
      const { compressImage } = await import('@/lib/image-utils')
      
      // Compress the image before creating URL
      const compressedImage = await compressImage(file, 800, 800, 0.8)
      
      // Update state with compressed image
      setImageSource(compressedImage)
      
      // Store in session storage for next step
      sessionStorage.setItem('plasticImage', compressedImage)
      
      // Reset the file input
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      console.error('Error processing image:', err)
      setError('Error processing image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Function to handle camera capture
  const startCamera = async () => {
    try {
      setError(null)
      setIsCameraActive(true)
      
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      // Use Permissions API to check camera permission state
      if (navigator.permissions) {
        try {
          const status = await navigator.permissions.query({ name: 'camera' as PermissionName })
          if (status.state === 'denied') {
            // Permission denied: show guide and abort
            setIsCameraActive(false)
            setError('Camera access has been denied. Please enable camera permission in your browser settings.')
            return
          }
          // If prompt or granted, proceed to request access (will trigger prompt if needed)
        } catch (permErr) {
          console.warn('Permissions API error:', permErr)
        }
      }
      
      // Use our polyfill to get camera stream with better error handling
      const stream = await requestCameraAccess({ 
        video: { facingMode: 'environment' } 
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setIsCameraActive(false)
      
      // Set error message
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to access camera. Please try uploading an image instead.')
      }
    }
  }
  
  // Function to capture photo from camera
  const capturePhoto = async () => {
    if (!videoRef.current) return
    
    try {
      setIsLoading(true)
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      
      if (ctx && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        
        // Get compressed image data
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8)
        
        // Update state with captured image
        setImageSource(imageUrl)
        
        // Store in session storage for next step
        sessionStorage.setItem('plasticImage', imageUrl)
        
        stopCamera()
      }
    } catch (err) {
      console.error('Error capturing photo:', err)
      setError('Failed to capture photo')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Function to stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
  }
  
  // Function to clear selected image
  const clearImage = () => {
    if (imageSource) URL.revokeObjectURL(imageSource)
    setImageSource(null)
    setError(null)
  }
  
  // Function to proceed with the selected image
  const proceedWithImage = () => {
    if (imageSource) {
      try {
        // Store the image in session storage for the next step
        sessionStorage.setItem('plasticImage', imageSource);
        
        // Navigate to the weight input step
        router.push('/scan/weight');
      } catch (error) {
        console.error('Error saving image to session storage:', error);
        setError('Failed to proceed with image. Please try again.');
      }
    }
  }

  // Component to show camera permission guide
  const CameraPermissionGuide = () => (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md mt-4 border border-gray-200 dark:border-gray-700">
      <h3 className="font-medium flex items-center text-gray-800 dark:text-gray-200">
        <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
        How to enable camera access
      </h3>
      <ol className="list-decimal ml-5 mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-300">
        <li>Click the camera or lock icon in your browser's address bar</li>
        <li>Select "Allow" for camera access</li>
        <li>Refresh the page and try again</li>
      </ol>
      <div className="mt-3">
        <Button 
          onClick={() => window.location.reload()} 
          size="sm" 
          variant="outline" 
          className="w-full bg-white hover:bg-gray-50 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <RefreshCw className="w-3 h-3 mr-2" />
          Refresh Page
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      {/* Header with progress indicators */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <Link href="/" passHref>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Plastic Scan</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        
        {/* Progress steps */}
        <div className="flex items-center justify-between px-2 mt-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">1</div>
            <span className="text-xs mt-1 font-medium text-green-600 dark:text-green-400">Scan</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 font-medium">2</div>
            <span className="text-xs mt-1 text-gray-400 dark:text-gray-500">Weight</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 font-medium">3</div>
            <span className="text-xs mt-1 text-gray-400 dark:text-gray-500">Analysis</span>
          </div>
        </div>
      </div>

      {/* Instructions Alert */}
      <Alert className="mb-6 border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <Info className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
        <AlertTitle className="text-gray-900 dark:text-gray-100">How to scan plastic items</AlertTitle>
        <AlertDescription className="text-gray-600 dark:text-gray-300">
          <p className="mb-3">
            Focus on the <strong>recycling symbol</strong> (a triangle with a number 1-7 inside) 
            on your plastic item. If you can't find the symbol, take a clear photo of the entire item.
          </p>
          <div className="flex items-center justify-center mt-4 mb-2">
            <div className="w-20 h-20 flex flex-col items-center justify-center p-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <Recycle className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              <div className="mt-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">1-7</div>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {!isCameraSupported && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Camera Not Supported</AlertTitle>
          <AlertDescription>
            Your device or browser doesn't support camera access. Please use the "Upload from Gallery" option instead.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-5">
          {!imageSource && !isCameraActive && (
            <div className="aspect-[4/3] w-full bg-gray-50 dark:bg-gray-800 rounded-lg mb-5 flex flex-col items-center justify-center p-8">
              <div className="mb-5 relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Scan className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <Recycle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <h3 className="text-gray-800 dark:text-gray-200 font-medium text-lg text-center mb-2">Scan Your Plastic</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm max-w-xs">
                Take a clear photo focusing on the recycling symbol if visible
              </p>
            </div>
          )}

          {isCameraActive && (
            <div className="relative aspect-[4/3] w-full bg-black rounded-lg mb-5 overflow-hidden">
              <video 
                ref={videoRef}
                className="h-full w-full object-cover"
                playsInline
                autoPlay
                muted
              />
              {/* Scanning overlay with animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Scanner frame with animated border */}
                <div className="relative w-2/3 h-2/3 border-2 border-white/30 rounded-lg overflow-hidden">
                  {/* Scanning line animation */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500 opacity-70 animate-scan"></div>
                  
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500"></div>
                </div>
              </div>
              
              {/* Instructions overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-1.5 bg-white/20 rounded-full">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Position the recycling symbol in frame</p>
                    <p className="text-xs opacity-80 mt-0.5">Hold your device steady for a clear image</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {imageSource && (
            <div className="relative aspect-[4/3] w-full mb-5">
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <Image
                  src={imageSource}
                  alt="Selected plastic item"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-lg border-2 border-white/50 pointer-events-none"></div>
              <button 
                onClick={clearImage} 
                className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-md"
                title="Remove image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              {/* Image quality indicator */}
              <div className="absolute left-3 top-3 px-2.5 py-1 bg-black/60 rounded-full flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
                <span className="text-white text-xs font-medium">Good Quality</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
              <p className="font-medium flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                Error
              </p>
              <p className="text-sm mt-1">{error}</p>
              
              {/* Show permission guide if the error is related to camera permissions */}
              {error.toLowerCase().includes('permission') || 
               error.toLowerCase().includes('denied') || 
               error.toLowerCase().includes('access') ? (
                <CameraPermissionGuide />
               ) : null}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-5">
            {imageSource ? (
              <Button 
                onClick={proceedWithImage} 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Continue with This Image
                  </>
                )}
              </Button>
            ) : (
              <>
                {isCameraActive ? (
                  <div className="flex gap-3">
                    <Button 
                      onClick={capturePhoto} 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Camera className="mr-2 h-5 w-5" />
                      )}
                      Take Photo
                    </Button>
                    <Button 
                      onClick={stopCamera} 
                      variant="outline" 
                      className="bg-white hover:bg-gray-50 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      onClick={startCamera} 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                      disabled={!isCameraSupported || isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Camera className="mr-2 h-5 w-5" />
                      )}
                      Take Photo with Camera
                    </Button>
                    <div className="relative">
                      <Button 
                        onClick={() => fileInputRef.current?.click()} 
                        variant="outline" 
                        className="w-full border-gray-300 bg-white hover:bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          <ImagePlus className="mr-2 h-5 w-5" />
                        )}
                        Upload from Gallery
                      </Button>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100 flex items-center">
          <CircleHelp className="w-5 h-5 mr-2 text-gray-500" />
          Tips for Best Results
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-800">
          <ol className="grid grid-cols-1 gap-3">
            <li className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">1</div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">Focus on the recycling symbol</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Look for a triangle with a number (1-7) inside</p>
              </div>
            </li>
            
            <li className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">2</div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">Ensure good lighting</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Avoid shadows and make sure the plastic is well-lit</p>
              </div>
            </li>
            
            <li className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">3</div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">Clean the surface</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Remove dirt or stickers covering the recycling code</p>
              </div>
            </li>
            
            <li className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">4</div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">Hold steady</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Keep your device still when taking the photo</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}

// Add this to your global CSS file or page-level styles
// .animate-scan {
//   animation: scanning 2s linear infinite;
// }
// 
// @keyframes scanning {
//   0% {
//     transform: translateY(0);
//   }
//   50% {
//     transform: translateY(calc(100% * 6));
//   }
//   100% {
//     transform: translateY(0);
//   }
// } 