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

  // Helper function to get the plastic type badge styles
  const getTypeBadgeStyles = (code: number) => {
    const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (code) {
      case 1: // PET
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case 2: // HDPE
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case 3: // PVC
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
      case 4: // LDPE
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      case 5: // PP
        return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`;
      case 6: // PS
        return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300`;
      case 7: // Other
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col">
      {/* Navigation header */}
      <div className="w-full px-6 py-5 flex items-center justify-between">
          <Link href="/scan/weight" passHref>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        <h1 className="text-xl font-bold text-white">Analysis Results</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        
      {/* Main content container */}
      <div className="flex-1 flex flex-col px-6 pb-8">
        {/* Progress steps */}
        <div className="w-full flex items-center justify-between mb-8 pt-2 max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs mt-2 text-gray-400">Scan</span>
          </div>
          <div className="flex-1 h-1 bg-green-500 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs mt-2 text-gray-400">Weight</span>
          </div>
          <div className="flex-1 h-1 bg-green-500 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">3</div>
            <span className="text-xs mt-2 font-medium text-green-400">Analysis</span>
        </div>
      </div>

        <div className="max-w-7xl mx-auto w-full">
          {/* Loading state */}
      {isLoading && (
            <div className="w-full bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-800 p-6 text-center">
              <div className="flex flex-col items-center justify-center py-8">
          <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-t-green-500 animate-spin"
                    style={{ animationDuration: '1.5s' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
                    <Recycle className="h-8 w-8 text-green-500" />
            </div>
          </div>
                
                <h3 className="text-xl font-medium text-white mb-2">Analyzing Your Plastic</h3>
                <p className="text-gray-400 mb-8 max-w-md">{loadingStep}...</p>
                
                <div className="w-full max-w-md mb-2">
                  <Progress value={loadingProgress} className="h-2 bg-gray-800" />
            </div>
                <p className="text-sm text-gray-500">{loadingProgress}% Complete</p>
          </div>
        </div>
      )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="w-full bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-800 p-6">
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">Analysis Failed</h3>
                <p className="text-gray-400 mb-6 max-w-md">{error}</p>
                
                <div className="flex gap-3">
                  <Link href="/scan" passHref>
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-white">
                      Scan Again
                    </Button>
                  </Link>
                  <Link href="/" passHref>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Return Home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !isLoading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main result card */}
              <div className="lg:col-span-2 bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-800">
                <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-medium text-white">Analysis Complete</h2>
                      <p className="text-sm text-gray-400">AI has analyzed your plastic item</p>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center ${result.recyclable ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'} px-3 py-1 rounded-full text-sm font-medium`}>
                      {result.recyclable ? 'Recyclable' : 'Not Recyclable'}
                    </span>
                </div>
              </div>
              
              <div className="p-5">
                  {/* Image and plastic info */}
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    {/* Image */}
                  {imageSource && (
                      <div className="w-full md:w-1/3 aspect-square rounded-xl overflow-hidden bg-gray-800 border border-gray-700 relative">
                      <Image
                        src={imageSource}
                        alt="Plastic item"
                        fill
                          className="object-contain"
                      />
                        <div className="absolute bottom-3 right-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm text-white font-bold text-xl">
                            {result.recyclingCode}
                          </div>
                        </div>
                    </div>
                  )}
                    
                    {/* Info */}
                    <div className="flex-1">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">{result.plasticType}</h3>
                            <span className={getTypeBadgeStyles(result.recyclingCode)}>
                              Type {result.recyclingCode}
                            </span>
                          </div>
                          <p className="text-gray-400 mt-2">{result.description}</p>
                        </div>
                        
                  <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-1.5">Confidence Level</h4>
                          <div className="flex items-center gap-3">
                            <Progress value={result.confidence} className="h-2 bg-gray-800 flex-1" />
                            <span className="text-sm font-medium text-gray-300">{result.confidence}%</span>
                  </div>
                </div>
                
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-1.5">Weight</h4>
                          <p className="text-white font-medium">
                            {weight} {unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Environmental impact */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Leaf className="h-5 w-5 text-green-500" />
                      <h3 className="text-lg font-medium text-white">Environmental Impact</h3>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-800 border border-gray-700">
                      <p className="text-gray-300">{result.environmentalImpact}</p>
                    </div>
                      </div>
                  
                  {/* Usage tips */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="h-5 w-5 text-green-500" />
                      <h3 className="text-lg font-medium text-white">Handling Tips</h3>
                    </div>
                    <ul className="space-y-2">
                      {result.usageTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-900 flex items-center justify-center text-green-500 mt-0.5 text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-gray-300">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                        </div>
              
              {/* Actions column */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-800 p-5">
                  <h3 className="text-lg font-medium text-white mb-4">What's Next?</h3>
                  
                  <div className="space-y-4">
                    <Button 
                      onClick={proceedToChat}
                      className="w-full bg-green-600 hover:bg-green-700 text-white p-6 h-auto flex items-center justify-center"
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Chat with AI about this plastic
                    </Button>
                    
                    <Link href="/" className="w-full block" passHref>
                      <Button 
                        variant="outline"
                        className="w-full border-gray-700 hover:bg-gray-800 text-white"
                      >
                        Finish & Return Home
                      </Button>
                    </Link>
                    
                    <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 mt-6">
                      <h4 className="text-sm font-medium text-white mb-2">Did You Know?</h4>
                      <p className="text-sm text-gray-300">
                        Every piece of plastic you recycle helps reduce CO₂ emissions and prevents pollution of our oceans and landfills.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 