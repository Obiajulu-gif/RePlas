"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info, Scale, ArrowRight, Loader2, Weight, BarChart2 } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function WeightInputPage() {
  const [weight, setWeight] = useState<string>("")
  const [unit, setUnit] = useState<string>("g")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageSource, setImageSource] = useState<string | null>(null)
  const router = useRouter()

  // Load the image from session storage when component mounts
  useEffect(() => {
    const storedImage = sessionStorage.getItem('plasticImage')
    if (storedImage) {
      setImageSource(storedImage)
    }
  }, [])

  // Function to handle weight input change
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimals
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setWeight(value)
    setError(null)
  }

  // Function to handle unit selection
  const handleUnitChange = (value: string) => {
    setUnit(value)
    setError(null)
  }

  // Function to proceed to AI analysis
  const proceedToAnalysis = () => {
    // Validate inputs
    if (!weight || parseFloat(weight) <= 0) {
      setError("Please enter a valid weight")
      return
    }

    if (!imageSource) {
      setError("No image found. Please go back and scan your plastic item")
      return
    }

    try {
      setIsLoading(true)

      // Store weight data in session storage
      sessionStorage.setItem('plasticWeight', weight)
      sessionStorage.setItem('plasticUnit', unit)
      
      // Navigate to the analysis page
      router.push('/scan/analysis')
    } catch (err) {
      console.error('Error saving data:', err)
      setError('Failed to proceed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-green-950/30 flex flex-col">
      {/* Navigation header */}
      <div className="w-full px-6 py-5 flex items-center justify-between">
        <Link href="/scan" passHref>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 hover:bg-white/50 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800/50 backdrop-blur-sm rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Enter Weight</h1>
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
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">2</div>
            <span className="text-xs mt-2 font-medium text-green-400">Weight</span>
          </div>
          <div className="flex-1 h-1 bg-gray-700 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-medium">3</div>
            <span className="text-xs mt-2 text-gray-400">Analysis</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full max-w-7xl mx-auto">
          {/* Main content card - takes 3 columns on large screens */}
          <div className="lg:col-span-3 bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-800">
            {/* Instructions header */}
            <div className="p-5 border-b border-gray-800">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  <Info className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-white">Why we need this information</h3>
                  <p className="mt-1 text-sm text-gray-300">
                    The weight of your plastic item helps us calculate its environmental impact
                    and recycling potential more accurately.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Image preview with weight indicator */}
              {imageSource && (
                <div className="relative aspect-square w-full mb-6 rounded-xl overflow-hidden bg-gray-800 border border-gray-700 group">
                  <div className="absolute inset-0">
                    <Image
                      src={imageSource}
                      alt="Selected plastic item"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Weight indicator overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2">
                      <Weight className="h-5 w-5 text-white opacity-80" />
                      <span className="text-white text-sm font-medium">
                        Enter the weight below
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Weight input form with improved styling */}
              <div className="space-y-5">
                <div>
                  <Label htmlFor="weight" className="block text-sm font-medium mb-3 text-white">
                    Weight Information
                  </Label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Scale className="h-5 w-5" />
                      </div>
                      <Input
                        id="weight"
                        type="text"
                        inputMode="decimal"
                        value={weight}
                        onChange={handleWeightChange}
                        className="pl-10 bg-gray-800 border-gray-700 focus:ring-green-500 focus:border-green-500 text-white"
                        placeholder="Enter weight"
                      />
                    </div>
                    <div className="w-28">
                      <Select value={unit} onValueChange={handleUnitChange}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 focus:ring-green-500 focus:border-green-500 text-white">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="g">grams (g)</SelectItem>
                          <SelectItem value="kg">kilograms (kg)</SelectItem>
                          <SelectItem value="lb">pounds (lb)</SelectItem>
                          <SelectItem value="oz">ounces (oz)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-800 text-red-400 rounded-lg">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <Button 
                onClick={proceedToAnalysis} 
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium p-6 h-auto"
                disabled={isLoading || !weight}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Analysis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Tips section - takes 2 columns on large screens */}
          <div className="lg:col-span-2 bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-800 h-fit">
            <div className="p-5">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Scale className="h-5 w-5 mr-2 text-green-500" />
                Tips for Accuracy
              </h3>
              <ul className="mt-3 space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-900 text-green-500 text-xs font-bold mt-0.5">1</div>
                  <p className="ml-3 text-sm text-gray-300">
                    <span className="font-medium text-white">Use a kitchen scale</span><br />
                    For more precise measurements of your plastic item
                  </p>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-900 text-green-500 text-xs font-bold mt-0.5">2</div>
                  <p className="ml-3 text-sm text-gray-300">
                    <span className="font-medium text-white">Empty and clean</span><br />
                    Make sure the plastic item is empty and dry before weighing
                  </p>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-900 text-green-500 text-xs font-bold mt-0.5">3</div>
                  <p className="ml-3 text-sm text-gray-300">
                    <span className="font-medium text-white">Best estimate</span><br />
                    If you don't have a scale, provide your best estimate based on similar items
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 