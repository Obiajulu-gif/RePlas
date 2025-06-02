"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info, Save, Loader2, Scale, Sparkles, Calculator, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { GeminiAIClient } from "@/lib/ai/gemini-client"
import { PlasticAnalysisResult } from "@/components/plastic-analysis-result"
import { extractBase64FromDataURL } from "@/lib/image-utils"
import config from "@/lib/config"
import { cn } from "@/lib/utils"

// Initialize Gemini client
const geminiClient = new GeminiAIClient();

export default function WeightInputPage() {
  const [weight, setWeight] = useState<string>("")
  const [unit, setUnit] = useState<string>("grams")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [plasticAnalysis, setPlasticAnalysis] = useState<null | any>(null)
  const [imageSource, setImageSource] = useState<string | null>(null)
  const router = useRouter()

  // Check if Gemini is configured
  const [isGeminiConfigured, setIsGeminiConfigured] = useState(false)

  useEffect(() => {
    // Retrieve the uploaded image from sessionStorage
    const savedImage = sessionStorage.getItem('plasticImage')
    if (savedImage) {
      setImageSource(savedImage)
    }

    // Check if Gemini API is configured
    setIsGeminiConfigured(config.gemini.enabled)
  }, [])

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value)
  }

  const handleUnitChange = (value: string) => {
    setUnit(value)
  }

  const handleSave = async () => {
    // Validate input
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      setError("Please enter a valid weight value greater than zero")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Only analyze if we have an image and Gemini is configured
      if (imageSource) {
        // Extract base64 data without the prefix
        const base64Data = extractBase64FromDataURL(imageSource)

        let result;
        
        // If Gemini is configured properly, use it
        if (isGeminiConfigured && geminiClient.geminiVisionModel) {
          // Call Gemini to analyze the plastic type
          result = await geminiClient.analyzePlasticImage(
            base64Data, 
            Number(weight), 
            unit
          )
        } else {
          // Use mock data when API key is missing or invalid
          console.log('Using mock data for plastic analysis')
          result = getMockPlasticAnalysis()
        }
        
        // Save the analysis result
        setPlasticAnalysis(result)
        
        // Store the result in sessionStorage for use on the next page
        sessionStorage.setItem('plasticAnalysis', JSON.stringify(result))
      } else {
        setError("No image found. Please go back and capture or upload an image first.")
      }
    } catch (err) {
      console.error("Error analyzing plastic:", err)
      setError("Failed to analyze the plastic. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to get mock plastic analysis data when API is not available
  const getMockPlasticAnalysis = () => {
    const mockAnalyses = [
      {
        type: "PET (Type 1)",
        confidence: 0.92,
        recyclable: true,
        description: "Polyethylene terephthalate, commonly used for water and soda bottles.",
      },
      {
        type: "HDPE (Type 2)",
        confidence: 0.88,
        recyclable: true,
        description: "High-density polyethylene, used for milk jugs and detergent bottles.",
      },
      {
        type: "PVC (Type 3)",
        confidence: 0.75,
        recyclable: false,
        description: "Polyvinyl chloride, used for pipes and some food packaging. Limited recyclability.",
      },
      {
        type: "LDPE (Type 4)",
        confidence: 0.85,
        recyclable: true,
        description: "Low-density polyethylene, used for grocery bags and food containers.",
      },
    ]
    
    return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-green-950/30">
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/scan" passHref>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 hover:bg-white/50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800/50 backdrop-blur-sm rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Scale className="mr-2 h-6 w-6 text-green-500" />
            Plastic Weight
          </h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

        {/* Progress steps */}
        <div className="flex items-center justify-between px-2 mt-2 mb-6 relative">
          {/* Progress bar background */}
          <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          
          {/* Active progress bar */}
          <div className="absolute top-4 left-0 w-2/3 h-1 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
          
          {/* Step 1 */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 font-medium ring-4 ring-white dark:ring-gray-900">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">Scan</span>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-medium shadow-lg shadow-green-400/20 dark:shadow-green-900/30 ring-4 ring-white dark:ring-gray-900">
              <Scale className="h-5 w-5" />
            </div>
            <span className="text-xs mt-2 font-medium text-green-600 dark:text-green-400">Weight</span>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center relative z-10">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 font-medium ring-4 ring-white dark:ring-gray-900">
              3
            </div>
            <span className="text-xs mt-2 text-gray-400 dark:text-gray-500">Analysis</span>
          </div>
        </div>

        <Alert className="mb-6 border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 shadow-sm rounded-xl backdrop-blur-sm">
          <div className="p-1 bg-white dark:bg-gray-800 rounded-full mr-2">
            <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <AlertTitle className="text-gray-900 dark:text-gray-100 font-medium">Enter Plastic Weight</AlertTitle>
          <AlertDescription className="text-gray-600 dark:text-gray-300">
          Please enter the weight of your plastic item for accurate recycling tracking and carbon impact calculation.
        </AlertDescription>
      </Alert>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100 dark:border-gray-700">
          <div className="p-5">
            <div className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="weight" className="text-gray-700 dark:text-gray-300 flex items-center">
                  <Calculator className="h-4 w-4 mr-2 text-green-500" />
                  Weight
                </Label>
              <div className="flex gap-4">
                  <div className="flex-1 relative">
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={handleWeightChange}
                      className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500 dark:focus:ring-green-500"
                  />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-green-500 opacity-0 transition-opacity duration-300" style={{ opacity: weight ? 0.7 : 0 }}></div>
                    </div>
                </div>
                <div className="w-1/3">
                  <Select value={unit} onValueChange={handleUnitChange}>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-500 focus:ring-green-500 dark:focus:ring-green-500">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grams">Grams (g)</SelectItem>
                      <SelectItem value="kilograms">Kilograms (kg)</SelectItem>
                      <SelectItem value="pounds">Pounds (lb)</SelectItem>
                      <SelectItem value="ounces">Ounces (oz)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {error && (
                <div className="p-4 bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/20 text-red-800 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800/50">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button 
              onClick={handleSave} 
                className={cn(
                  "w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md shadow-green-600/20 dark:shadow-green-900/20",
                  (!weight || !imageSource) && "opacity-70"
                )}
              disabled={isLoading || !weight || !imageSource}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Analyze Plastic
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Display analysis results */}
      {(isLoading || plasticAnalysis) && (
        <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                <ChevronRight className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Analysis Results</h2>
            </div>
          <PlasticAnalysisResult result={plasticAnalysis} isLoading={isLoading} />
        </div>
      )}

      {plasticAnalysis && (
          <div className="mt-4 mb-6">
          <Button 
            onClick={() => router.push('/scan/chat')} 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md shadow-blue-600/20 dark:shadow-blue-900/20"
          >
            Continue to Chat
          </Button>
        </div>
      )}

        <div className="mb-8">
          <details className="group">
            <summary className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm cursor-pointer border border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Why is weight important?</span>
              </div>
              <div className="transition-transform duration-200 group-open:rotate-180">
                <ArrowLeft className="h-5 w-5 -rotate-90 text-gray-400" />
              </div>
            </summary>
            <div className="mt-2 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-sm space-y-3 text-gray-600 dark:text-gray-300">
            <p>
              The weight of your plastic item helps us:
            </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Calculate your environmental impact</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Determine appropriate token rewards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Track recycling metrics accurately</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>Generate precise carbon offset data</span>
                  </li>
            </ul>
              </div>
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