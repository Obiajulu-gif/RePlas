"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info, CheckCircle, XCircle, Loader2, MessageSquare, Recycle, Leaf } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { prepareImageForLLM, generatePlasticIdentificationPrompt, compressImage, compressImageFromDataUrl } from "@/lib/image-utils"
import { GeminiAIClient } from "@/lib/ai/gemini-client"

type AnalysisResult = {
  plasticType: string;
  recyclingCode: number;
  description: string;
  recyclable: boolean;
  confidence: number;
  environmentalImpact: string;
  usageTips: string[];
}

export default function AnalysisPage() {
  // Configuration flags
  const DEMO_MODE = false; // Set to true to use simulated responses instead of real API
  const DEBUG_MODE = true; // Set to true to show debug information
  
  const [imageSource, setImageSource] = useState<string | null>(null)
  const [weight, setWeight] = useState<string | null>(null)
  const [unit, setUnit] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loadingStep, setLoadingStep] = useState<string>("Initializing")
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const router = useRouter()
  
  // Initialize Gemini client (done only once)
  const geminiClient = new GeminiAIClient()
  
  // Check if API key is available
  useEffect(() => {
    if (DEBUG_MODE) {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('NEXT_PUBLIC_GEMINI_API_KEY is not defined');
      } else {
        console.log('NEXT_PUBLIC_GEMINI_API_KEY is defined:', apiKey.substring(0, 4) + '...');
      }
    }
  }, [])

  // Load data from session storage when component mounts
  useEffect(() => {
    const storedImage = sessionStorage.getItem('plasticImage')
    const storedWeight = sessionStorage.getItem('plasticWeight')
    const storedUnit = sessionStorage.getItem('plasticUnit')
    
    if (storedImage) {
      setImageSource(storedImage)
    } else {
      setError("No image found. Please go back and scan your plastic item")
      setIsLoading(false)
      return
    }

    if (storedWeight && storedUnit) {
      setWeight(storedWeight)
      setUnit(storedUnit)
    } else {
      setError("Weight information missing. Please go back and enter the weight")
      setIsLoading(false)
      return
    }

    if (DEBUG_MODE) {
      console.log('Debug mode enabled');
      console.log('Demo mode:', DEMO_MODE ? 'Enabled' : 'Disabled');
      console.log('Image data length:', storedImage.length);
      console.log('Weight:', storedWeight, storedUnit);
    }

    // Process the image with the LLM API
    analyzePlasticImage(storedImage, storedWeight, storedUnit)
  }, [])

  // Function to analyze the plastic image
  const analyzePlasticImage = async (image: string, weight: string, unit: string) => {
    try {
      setIsLoading(true)
      setLoadingStep("Preprocessing image")
      setLoadingProgress(10)
      setError(null) // Clear any previous errors
      
      if (DEMO_MODE) {
        // Use demo mode with simulated responses
        if (DEBUG_MODE) console.log('Using DEMO mode with simulated responses');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoadingProgress(30);
        
        setLoadingStep("Simulating AI analysis");
        setLoadingProgress(50);
        
        // Simulate longer processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoadingProgress(80);
        
        // Mock result for demonstration
        const mockResult: AnalysisResult = {
          plasticType: "Polyethylene Terephthalate",
          recyclingCode: 1,
          description: "PET or PETE is commonly used for water bottles, soda bottles, and some food packaging.",
          recyclable: true,
          confidence: 92,
          environmentalImpact: "High recycling rate, but creates microplastics when degrading.",
          usageTips: [
            "Avoid reusing repeatedly as it may leach chemicals",
            "Keep away from heat to prevent breakdown",
            "Widely accepted by recycling programs"
          ]
        };
        
        setLoadingStep("Processing results");
        setLoadingProgress(100);
        setResult(mockResult);
        setIsLoading(false);
        return;
      }
      
      // REAL API MODE
      if (DEBUG_MODE) console.log('Using REAL API mode');
      
      // Pre-process the image (compress if needed)
      let optimizedImage = image;
      
      try {
        // Compress the image to reduce size for API call (max 800x800, 80% quality)
        optimizedImage = await compressImageFromDataUrl(image, 800, 800, 0.8);
        if (DEBUG_MODE) console.log('Image compressed successfully, new size:', optimizedImage.length);
        setLoadingProgress(30)
      } catch (compressionError) {
        console.warn('Image compression failed, using original image:', compressionError);
        // Continue with the original image if compression fails
      }
      
      // 1. Prepare the image for the API
      setLoadingStep("Preparing image for analysis")
      const base64Image = prepareImageForLLM(optimizedImage);
      setLoadingProgress(40)
      
      // 2. Call the LLM API via the Gemini client
      setLoadingStep("Analyzing plastic with AI")
      setLoadingProgress(50)
      
      try {
        const response = await callGeminiAPI(base64Image, weight, unit);
        
        if (!response) {
          throw new Error('Failed to get response from Gemini API');
        }
        
        // 3. Update state with the parsed result
        setLoadingStep("Processing results")
        setLoadingProgress(90)
        setResult(response);
        setLoadingProgress(100)
        setIsLoading(false);
      } catch (apiError: any) {
        console.error('Error calling Gemini API:', apiError);
        setError(`AI analysis failed: ${apiError.message || 'Unknown error'}. Please try again.`);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error analyzing image:', err)
      setError('Failed to analyze the plastic. Please try again.')
      setIsLoading(false)
    }
  }
  
  // Function to call Gemini API for image analysis
  const callGeminiAPI = async (base64Image: string, weight: string, unit: string) => {
    try {
      // 1. Generate the prompt for plastic identification
      const prompt = generatePlasticIdentificationPrompt(base64Image);
      
      console.log('Calling Gemini API with image data');
      
      // 2. Make the API call using our GeminiAIClient
      const apiResponse = await fetch('/api/analyze-plastic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          weight,
          unit
        }),
      });
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        const errorMessage = errorData.error || `API request failed with status ${apiResponse.status}`;
        throw new Error(errorMessage);
      }
      
      const data = await apiResponse.json();
      console.log('Received response from API:', data ? Object.keys(data).join(', ') : 'No data');
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // 3. Transform the response to match our AnalysisResult type if needed
      // Check if we need to transform the data or if it already matches our expected format
      return {
        plasticType: data.plasticType || "Unknown Plastic",
        recyclingCode: data.recyclingCode || 7,
        description: data.description || "Unable to identify plastic type accurately.",
        recyclable: data.recyclable !== undefined ? data.recyclable : false,
        confidence: data.confidence || 50,
        environmentalImpact: data.environmentalImpact || "Unknown environmental impact.",
        usageTips: data.usageTips || ["Handle with care", "Check local recycling guidelines"]
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error; // Re-throw to be handled by parent
    }
  }

  // Function to navigate to chat
  const proceedToChat = () => {
    if (result) {
      // Store analysis result in session storage for chat
      sessionStorage.setItem('plasticAnalysis', JSON.stringify(result))
      router.push('/scan/chat')
    }
  }

  // Helper function to get the plastic type color
  const getPlasticTypeColor = (code: number): string => {
    const colors: Record<number, string> = {
      1: 'blue',
      2: 'green',
      3: 'yellow',
      4: 'red',
      5: 'purple',
      6: 'orange',
      7: 'gray'
    };
    return colors[code] || 'gray';
  }

  // Helper function to get the plastic type badge style
  const getTypeBadgeStyles = (code: number) => {
    const baseClasses = "rounded-full px-2.5 py-0.5 text-xs font-medium";
    
    switch(code) {
      case 1: return `${baseClasses} bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`;
      case 2: return `${baseClasses} bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400`;
      case 3: return `${baseClasses} bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case 4: return `${baseClasses} bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400`;
      case 5: return `${baseClasses} bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400`;
      case 6: return `${baseClasses} bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400`;
      default: return `${baseClasses} bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400`;
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      {/* Header with progress indicators */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <Link href="/scan/weight" passHref>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Plastic Analysis</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        
        {/* Progress steps - more compact and visually clear */}
        <div className="flex items-center justify-between px-1 mt-4">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">Scan</span>
          </div>
          <div className="flex-1 h-0.5 bg-green-500 dark:bg-green-600 mx-1"></div>
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">Weight</span>
          </div>
          <div className="flex-1 h-0.5 bg-green-500 dark:bg-green-600 mx-1"></div>
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white font-medium text-sm">3</div>
            <span className="text-xs mt-1 font-medium text-green-600 dark:text-green-400">Analysis</span>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent"
              style={{ 
                transformOrigin: 'center',
                animation: 'spin 1.5s linear infinite'
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Recycle className="h-10 w-10 text-green-500 opacity-70" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Analyzing Your Plastic</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-xs">
            Our AI is identifying the plastic type, recyclability, and environmental impact
          </p>
          
          {/* Progress indicator - more visually appealing */}
          <div className="w-full max-w-xs mb-4">
            <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{loadingStep}</span>
              <span>{loadingProgress}%</span>
            </div>
            <Progress value={loadingProgress} className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800" />
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {loadingStep === "Analyzing plastic with AI" ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2 text-green-500" />
                This may take a moment as our AI identifies the plastic...
              </span>
            ) : loadingStep === "Processing results" ? (
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                AI analysis complete! Processing results...
              </span>
            ) : (
              <span className="flex items-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2 text-green-500" />
                {loadingStep}...
              </span>
            )}
          </p>
          
          {/* Loading tips - better styling */}
          <div className="mt-8 max-w-xs p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30 text-xs text-blue-700 dark:text-blue-300">
            <p className="flex items-start">
              <Info className="h-3.5 w-3.5 mt-0.5 mr-2 flex-shrink-0" />
              For best results, ensure the recycling symbol (if present) is clearly visible in the image.
            </p>
          </div>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6 border-red-200 dark:border-red-900/50">
          <AlertTitle className="flex items-center text-red-700 dark:text-red-300">
            <XCircle className="h-4 w-4 mr-2" />
            Analysis Failed
          </AlertTitle>
          <AlertDescription className="text-red-600 dark:text-red-300">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
              onClick={() => {
                if (imageSource && weight && unit) {
                  analyzePlasticImage(imageSource, weight, unit);
                }
              }}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && result && (
        <div className="space-y-5">
          {/* Enhanced Results Display with Tabs */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Plastic Type Header with Dynamic Color Gradient */}
            <div className={`p-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r 
              ${result.recyclingCode === 1 ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30' :
                result.recyclingCode === 2 ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30' :
                result.recyclingCode === 3 ? 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/30' :
                result.recyclingCode === 4 ? 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30' :
                result.recyclingCode === 5 ? 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30' :
                result.recyclingCode === 6 ? 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30' :
                'from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/70'
              }`}
            >
              {/* Plastic Classification Hero Section */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{result.plasticType}</h2>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <div className={getTypeBadgeStyles(result.recyclingCode)}>
                      Type {result.recyclingCode}
                    </div>
                    
                    <Badge 
                      variant={result.recyclable ? "default" : "destructive"}
                      className={`px-2 py-0.5 ${result.recyclable ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}
                    >
                      {result.recyclable ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1.5" />
                          Recyclable
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1.5" />
                          Not Recyclable
                        </>
                      )}
                    </Badge>
                    
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                      <span>{weight} {unit}</span>
                    </span>
                  </div>
                </div>
                
                {/* Enhanced Recycling Symbol */}
                <div className={`h-20 w-20 rounded-full flex-shrink-0 relative shadow-lg border-2 
                  ${result.recyclingCode === 1 ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30' :
                    result.recyclingCode === 2 ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30' :
                    result.recyclingCode === 3 ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/30' :
                    result.recyclingCode === 4 ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30' :
                    result.recyclingCode === 5 ? 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/30' :
                    result.recyclingCode === 6 ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/30' :
                    'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Recycle className={`h-10 w-10 
                      ${result.recyclingCode === 1 ? 'text-blue-500' :
                        result.recyclingCode === 2 ? 'text-green-500' :
                        result.recyclingCode === 3 ? 'text-yellow-500' :
                        result.recyclingCode === 4 ? 'text-red-500' :
                        result.recyclingCode === 5 ? 'text-purple-500' :
                        result.recyclingCode === 6 ? 'text-orange-500' :
                        'text-gray-500'
                      } opacity-60`} 
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold 
                      ${result.recyclingCode === 1 ? 'text-blue-700 dark:text-blue-300' :
                        result.recyclingCode === 2 ? 'text-green-700 dark:text-green-300' :
                        result.recyclingCode === 3 ? 'text-yellow-700 dark:text-yellow-300' :
                        result.recyclingCode === 4 ? 'text-red-700 dark:text-red-300' :
                        result.recyclingCode === 5 ? 'text-purple-700 dark:text-purple-300' :
                        result.recyclingCode === 6 ? 'text-orange-700 dark:text-orange-300' :
                        'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {result.recyclingCode}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Confidence Meter with Improved Visualization */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">AI Confidence</span>
                  <span className={`text-xs font-medium ${
                    result.confidence > 80 ? 'text-green-600 dark:text-green-400' : 
                    result.confidence > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {result.confidence}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      result.confidence > 80 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                      result.confidence > 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Main Content Area with Improved Visual Organization */}
            <div className="p-0">
              {/* Content Area with Enhanced Layout */}
              <div className="p-5">
                {/* Overview Section */}
                <div className="flex gap-4 mb-6">
                  {imageSource && (
                    <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow">
                      <Image
                        src={imageSource}
                        alt="Plastic item"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">About This Plastic</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {result.description}
                    </p>
                  </div>
                </div>
                
                {/* Enhanced Information Cards */}
                <div className="space-y-4">
                  {/* Environmental Impact Card with Improved Visual Design */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 border border-green-200 dark:border-green-800/50 transition-all duration-150 hover:shadow-md">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-green-100 dark:bg-green-800/40 rounded-full">
                        <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-medium text-green-800 dark:text-green-300">Environmental Impact</h3>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-200 pl-9 leading-relaxed">{result.environmentalImpact}</p>
                  </div>
                  
                  {/* Usage Tips with Improved Readability */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800/50 transition-all duration-150 hover:shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-800/40 rounded-full">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-medium text-blue-800 dark:text-blue-300">Usage & Recycling Tips</h3>
                    </div>
                    <div className="space-y-3 pl-1">
                      {result.usageTips.map((tip, i) => (
                        <div key={i} className="flex p-2 rounded-lg bg-white/80 dark:bg-gray-800/50 border border-blue-100 dark:border-blue-800/30">
                          <div className="mt-0.5 min-w-6 h-6 mr-3 rounded-full bg-blue-100 dark:bg-blue-800/60 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{i+1}</span>
                          </div>
                          <p className="text-sm text-blue-700 dark:text-blue-200">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Call To Action Section */}
            <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 border-t border-gray-200 dark:border-gray-700">
              <Button 
                onClick={proceedToChat} 
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat with AI about This Plastic
              </Button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                Get personalized recycling advice and eco-friendly alternatives
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 