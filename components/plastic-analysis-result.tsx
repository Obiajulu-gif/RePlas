import React from 'react'
import { 
  CheckCircle2, 
  XCircle, 
  RecycleIcon, 
  AlertCircle,
  PercentIcon
} from 'lucide-react'
import type { PlasticAnalysis } from '@/lib/ai/gemini-client'

interface PlasticAnalysisResultProps {
  result: PlasticAnalysis
  isLoading?: boolean
}

export function PlasticAnalysisResult({ result, isLoading = false }: PlasticAnalysisResultProps) {
  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
        <p className="text-center text-sm mt-4 text-gray-500 dark:text-gray-400">
          Analyzing plastic type...
        </p>
      </div>
    )
  }

  const confidencePercent = Math.round(result.confidence * 100)
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <RecycleIcon className="h-5 w-5 mr-2 text-emerald-500" />
        Plastic Analysis Results
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="font-medium">Type</div>
          <div className="font-semibold text-right">{result.type || 'Unknown'}</div>
        </div>
        
        <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="font-medium flex items-center">
            <PercentIcon className="h-4 w-4 mr-1" />
            Confidence
          </div>
          <div className="flex items-center">
            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2 dark:bg-gray-700 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2.5 rounded-full" 
                style={{ width: `${confidencePercent}%` }}
              ></div>
            </div>
            <span className="font-semibold">{confidencePercent}%</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="font-medium">Recyclable</div>
          <div className="flex items-center">
            {result.recyclable ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">Yes</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500 mr-1" />
                <span className="text-red-500 font-medium">No</span>
              </>
            )}
          </div>
        </div>
        
        <div className="pt-2">
          <div className="font-medium mb-1">Description</div>
          <div className="text-gray-700 dark:text-gray-300 text-sm">
            {result.description || 'No description available'}
          </div>
        </div>
        
        {(result.type === 'Unknown' || result.confidence < 0.6) && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-amber-800 dark:text-amber-400 text-sm">
                <p className="font-medium mb-1">Low confidence detection</p>
                <p>For better results, try to capture a clearer image of the recycling symbol on your plastic item.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 