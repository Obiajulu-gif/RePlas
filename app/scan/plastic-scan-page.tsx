"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, Camera, Upload, Info, Trash2, Check, 
  AlertCircle, RefreshCw, Loader2, Recycle, 
  ImagePlus, CircleHelp, Scan, Sparkles
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { isCameraSupported as checkCameraSupport, requestCameraAccess } from "@/lib/camera-polyfill"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

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
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl mt-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="font-medium flex items-center text-gray-800 dark:text-gray-200">
        <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
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
          className="w-full bg-white/80 hover:bg-white text-gray-800 border-gray-300 dark:bg-gray-800/80 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 backdrop-blur-sm"
        >
          <RefreshCw className="w-3 h-3 mr-2" />
          Refresh Page
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-green-950/30">
    <div className="container max-w-md mx-auto px-4 py-8">
      {/* Header with progress indicators */}
      <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
          <Link href="/" passHref>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 hover:bg-white/50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800/50 backdrop-blur-sm rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <Recycle className="mr-2 h-6 w-6 text-green-500" />
              Plastic Scan
            </h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        
        {/* Progress steps */}
          <div className="flex items-center justify-between px-2 mt-6 relative">
            {/* Progress bar background */}
            <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            
            {/* Active progress bar */}
            <div className="absolute top-4 left-0 w-1/3 h-1 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-medium shadow-lg shadow-green-400/20 dark:shadow-green-900/30 ring-4 ring-white dark:ring-gray-900">
                <Scan className="h-5 w-5" />
              </div>
              <span className="text-xs mt-2 font-medium text-green-600 dark:text-green-400">Scan</span>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 font-medium ring-4 ring-white dark:ring-gray-900">
                2
              </div>
              <span className="text-xs mt-2 text-gray-400 dark:text-gray-500">Weight</span>
          </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 font-medium ring-4 ring-white dark:ring-gray-900">
                3
          </div>
              <span className="text-xs mt-2 text-gray-400 dark:text-gray-500">Analysis</span>
          </div>
        </div>
      </div>

      {/* Instructions Alert */}
        <Alert className="mb-6 border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 shadow-sm rounded-xl backdrop-blur-sm">
          <div className="p-1 bg-white dark:bg-gray-800 rounded-full mr-2">
            <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <AlertTitle className="text-gray-900 dark:text-gray-100 font-medium">How to scan plastic items</AlertTitle>
          <AlertDescription className="text-gray-600 dark:text-gray-300">
            Take a clear photo of your plastic item or scan the recycling symbol for the best results.
        </AlertDescription>
      </Alert>

        {/* Error message */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-0 bg-red-50 dark:bg-red-950/50 rounded-xl">
          <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            {error.includes('denied') && <CameraPermissionGuide />}
        </Alert>
      )}

        {/* Main content area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100 dark:border-gray-700">
          {/* Preview area */}
          <div className="p-4">
            {imageSource ? (
              <div className="relative">
                <div className="aspect-[4/3] w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                  <Image
                    src={imageSource}
                    alt="Captured plastic item"
                    fill
                    style={{ objectFit: "contain" }}
                    className="rounded-lg"
                  />
                </div>
                <Button
                  onClick={clearImage}
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : isCameraActive ? (
              <div className="relative aspect-[4/3] w-full bg-black rounded-lg mb-0 overflow-hidden">
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
                  <div className="relative w-3/4 h-3/4 border-2 border-white/30 rounded-lg overflow-hidden">
                  {/* Scanning line animation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-500 opacity-80 animate-scan"></div>
                  
                  {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-green-500"></div>
                    <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-green-500"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-green-500"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-green-500"></div>
              
                    {/* Pulse animation in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 animate-ping"></div>
                      <div className="absolute w-8 h-8 rounded-full bg-green-500/40"></div>
                  </div>
                  </div>
                </div>
                
                {/* Instructions overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-black/60 backdrop-blur-sm">
                  <p className="text-white text-center text-sm">
                    Position the recycling symbol in the frame
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <ImagePlus className="h-8 w-8 text-green-500" />
            </div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Image Selected</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
                  Take a photo or upload an image of your plastic item
                </p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                onClick={startCamera}
                disabled={isCameraActive || isLoading || !isCameraSupported || !!imageSource}
                className={cn(
                  "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-md shadow-green-600/20 dark:shadow-green-900/20",
                  (!isCameraSupported || !!imageSource) && "opacity-50 cursor-not-allowed"
                )}
              >
                <Camera className="mr-2 h-5 w-5" />
                Take Photo
              </Button>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isCameraActive || isLoading || !!imageSource}
                variant="outline"
                className={cn(
                  "bg-white hover:bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700",
                  (!!imageSource) && "opacity-50 cursor-not-allowed"
                )}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Continue or camera action buttons */}
            {imageSource ? (
              <Button 
                onClick={proceedWithImage} 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md shadow-green-600/20 dark:shadow-green-900/20"
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
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md shadow-green-600/20 dark:shadow-green-900/20"
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
                ) : null}
              </>
            )}
        </div>
      </div>

        {/* Help section */}
        <div className="mb-8">
          <details className="group">
            <summary className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm cursor-pointer border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <CircleHelp className="h-5 w-5 mr-2 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tips for better scanning</span>
              </div>
              <div className="transition-transform duration-200 group-open:rotate-180">
                <ArrowLeft className="h-5 w-5 -rotate-90 text-gray-400" />
              </div>
            </summary>
            <div className="mt-2 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </span>
                  <span>Ensure good lighting for clear images</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </span>
                  <span>Focus on the recycling symbol if present</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </span>
                  <span>Hold the camera steady while taking photos</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2 mt-0.5">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </span>
                  <span>Make sure the plastic item is clean and visible</span>
            </li>
              </ul>
            </div>
          </details>
              </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Powering sustainable recycling with AI</p>
          <div className="flex items-center justify-center mt-2">
            <Sparkles className="h-3 w-3 mr-1 text-green-500" />
            <span>RePlas &copy; {new Date().getFullYear()}</span>
              </div>
        </div>
      </div>
    </div>
  )
}

// Add scanner animation
export const scanAnimationCss = `
@keyframes scan {
  0% {
    transform: translateY(-100%);
    opacity: 0.7;
  }
  50% {
    transform: translateY(100%);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0.7;
  }
}

.animate-scan {
  animation: scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
` 