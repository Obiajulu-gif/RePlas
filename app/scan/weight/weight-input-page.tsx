"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { GeminiAIClient } from "@/lib/ai/gemini-client"
import { PlasticAnalysisResult } from "@/components/plastic-analysis-result"
import { extractBase64FromDataURL } from "@/lib/image-utils"
import config from "@/lib/config"

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
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/scan" passHref>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Plastic Weight</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4 mr-2" />
        <AlertTitle>Enter Plastic Weight</AlertTitle>
        <AlertDescription>
          Please enter the weight of your plastic item for accurate recycling tracking and carbon impact calculation.
        </AlertDescription>
      </Alert>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight"
                    value={weight}
                    onChange={handleWeightChange}
                  />
                </div>
                <div className="w-1/3">
                  <Select value={unit} onValueChange={handleUnitChange}>
                    <SelectTrigger>
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
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button 
              onClick={handleSave} 
              className="w-full bg-green-600 hover:bg-green-700"
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
          <h2 className="text-lg font-medium mb-2">Analysis Results</h2>
          <PlasticAnalysisResult result={plasticAnalysis} isLoading={isLoading} />
        </div>
      )}

      {plasticAnalysis && (
        <div className="mt-4">
          <Button 
            onClick={() => router.push('/scan/chat')} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Continue to Chat
          </Button>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">Why is weight important?</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="text-sm space-y-2">
            <p>
              The weight of your plastic item helps us:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Calculate your environmental impact</li>
              <li>Determine appropriate token rewards</li>
              <li>Track recycling metrics accurately</li>
              <li>Generate precise carbon offset data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 