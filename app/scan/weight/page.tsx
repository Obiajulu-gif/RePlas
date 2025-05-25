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
    <div className="container max-w-md mx-auto px-4 py-8">
      {/* Header with progress indicators */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <Link href="/scan" passHref>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Enter Weight</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
        
        {/* Progress steps */}
        <div className="flex items-center justify-between px-2 mt-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-400 font-medium">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">Scan</span>
          </div>
          <div className="flex-1 h-0.5 bg-green-500 dark:bg-green-600 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">2</div>
            <span className="text-xs mt-1 font-medium text-green-600 dark:text-green-400">Weight</span>
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
        <AlertTitle className="text-gray-900 dark:text-gray-100">Why we need this information</AlertTitle>
        <AlertDescription className="text-gray-600 dark:text-gray-300">
          The weight of your plastic item helps us calculate its environmental impact
          and recycling potential more accurately.
        </AlertDescription>
      </Alert>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="p-5">
          {/* Image preview with weight indicator */}
          {imageSource && (
            <div className="relative aspect-[4/3] w-full mb-6 rounded-lg overflow-hidden group">
              <div className="absolute inset-0">
                <Image
                  src={imageSource}
                  alt="Selected plastic item"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-colors"></div>
              
              {/* Weight indicator overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-2">
                  <Weight className="h-5 w-5 text-white opacity-80" />
                  <div className="text-white text-sm font-medium">
                    Enter the weight below
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weight input form with improved styling */}
          <div className="space-y-5">
            <div>
              <Label htmlFor="weight" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                Weight Information
              </Label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <Scale className="h-5 w-5" />
                  </div>
                  <Input
                    id="weight"
                    type="text"
                    inputMode="decimal"
                    value={weight}
                    onChange={handleWeightChange}
                    className="pl-10 bg-gray-50 border-gray-200 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-green-500 dark:focus:border-green-500 text-base"
                    placeholder="Enter weight"
                  />
                </div>
                <div className="w-28">
                  <Select value={unit} onValueChange={handleUnitChange}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-green-500 dark:focus:border-green-500">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
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
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button 
            onClick={proceedToAnalysis} 
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium"
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

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">Tips for Accuracy</h2>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-800">
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">1</div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">Use a kitchen scale</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">For more precise measurements of your plastic item</p>
              </div>
            </li>
            
            <li className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">2</div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">Empty and clean</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Make sure the plastic item is empty and dry before weighing</p>
              </div>
            </li>
            
            <li className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">3</div>
              <div>
                <span className="font-medium text-gray-900 dark:text-gray-100">Best estimate</span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">If you don't have a scale, provide your best estimate based on similar items</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
} 