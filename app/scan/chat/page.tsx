"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send, Bot, User, Info, BarChart, Leaf, RefreshCw, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GeminiAIClient } from "@/lib/ai/gemini-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from 'react-markdown'

type AnalysisResult = {
  plasticType: string;
  recyclingCode: number;
  description: string;
  recyclable: boolean;
  confidence: number;
  environmentalImpact: string;
  usageTips: string[];
}

type Message = {
  role: "user" | "assistant";
  content: string;
}

type HistoricalPlastic = {
  plasticType: string;
  recyclingCode: number;
  weight: string;
  unit: string;
  recyclable: boolean;
  timestamp: number;
}

type ImpactData = {
  co2Saved: string;
  waterSaved: string;
  energySaved: string;
  treesEquivalent: string;
  additionalInfo: string;
}

export default function ChatPage() {
  // Configuration flags
  const DEMO_MODE = false; // Set to true to use simulated responses instead of real API
  const DEBUG_MODE = true; // Set to true to show debug information
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("chat")
  const [historicalData, setHistoricalData] = useState<HistoricalPlastic[]>([])
  const [impactData, setImpactData] = useState<ImpactData | null>(null)
  const [isLoadingImpact, setIsLoadingImpact] = useState<boolean>(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Initialize the client (at component level)
  const geminiClient = new GeminiAIClient()

  // Load analysis data and historical data from session storage when component mounts
  useEffect(() => {
    try {
      // Load current analysis
      const storedAnalysis = sessionStorage.getItem('plasticAnalysis')
      
      if (storedAnalysis) {
        const parsedAnalysis = JSON.parse(storedAnalysis) as AnalysisResult
        setAnalysis(parsedAnalysis)
        
        if (DEBUG_MODE) {
          console.log('Debug mode enabled');
          console.log('Demo mode:', DEMO_MODE ? 'Enabled' : 'Disabled');
          console.log('Loaded analysis:', parsedAnalysis);
        }
        
        // Load historical data from localStorage
        loadHistoricalData(parsedAnalysis)
        
        // Add initial greeting message
        setMessages([
          {
            role: "assistant",
            content: `I've analyzed your ${parsedAnalysis.plasticType} (Type ${parsedAnalysis.recyclingCode}) item. What would you like to know about it? You can ask about recycling options, environmental impact, or safer alternatives.`
          }
        ])
      } else {
        setError("No plastic analysis found. Please go back and scan a plastic item first.")
      }
    } catch (err) {
      console.error('Error loading analysis:', err)
      setError('Failed to load plastic analysis data.')
    }
  }, [])
  
  // Function to load historical data
  const loadHistoricalData = (currentAnalysis: AnalysisResult) => {
    try {
      // Get historical data from localStorage
      const storedHistory = localStorage.getItem('plasticHistory')
      let history: HistoricalPlastic[] = []
      
      if (storedHistory) {
        history = JSON.parse(storedHistory)
        setHistoricalData(history)
        
        if (DEBUG_MODE) {
          console.log('Loaded historical data:', history);
        }
      } else {
        if (DEBUG_MODE) {
          console.log('No historical data found');
        }
      }
      
      // Add current analysis to history if not already present
      const storedWeight = sessionStorage.getItem('plasticWeight') || "0"
      const storedUnit = sessionStorage.getItem('plasticUnit') || "g"
      
      const newEntry: HistoricalPlastic = {
        plasticType: currentAnalysis.plasticType,
        recyclingCode: currentAnalysis.recyclingCode,
        weight: storedWeight,
        unit: storedUnit,
        recyclable: currentAnalysis.recyclable,
        timestamp: Date.now()
      }
      
      // Check if this is a new entry (not same as last entry)
      let shouldAdd = true
      if (history.length > 0) {
        const lastEntry = history[history.length - 1]
        if (
          lastEntry.plasticType === newEntry.plasticType && 
          lastEntry.recyclingCode === newEntry.recyclingCode &&
          lastEntry.weight === newEntry.weight &&
          lastEntry.unit === newEntry.unit &&
          Date.now() - lastEntry.timestamp < 1000 * 60 * 5 // Within 5 minutes
        ) {
          shouldAdd = false
        }
      }
      
      if (shouldAdd) {
        const updatedHistory = [...history, newEntry]
        localStorage.setItem('plasticHistory', JSON.stringify(updatedHistory))
        setHistoricalData(updatedHistory)
        
        if (DEBUG_MODE) {
          console.log('Added new entry to history');
        }
      }
    } catch (err) {
      console.error('Error handling historical data:', err)
    }
  }
  
  // Function to request environmental impact data from AI
  const getImpactDataFromAI = async () => {
    if (!analysis) return;
    
    try {
      setIsLoadingImpact(true);
      
      const prompt = {
        contents: [
          {
            role: "user",
            parts: [
              { 
                text: `I have a ${analysis.plasticType} (Type ${analysis.recyclingCode}) item that weighs ${sessionStorage.getItem('plasticWeight') || "0"}${sessionStorage.getItem('plasticUnit') || "g"}. 
                
                Please provide me with specific environmental impact metrics of recycling this plastic item including:
                1. CO2 emissions saved (with specific numbers)
                2. Water saved from recycling (with specific numbers)
                3. Energy saved (with specific numbers)
                4. Equivalent to how many trees (with specific numbers)
                5. One additional interesting fact about this plastic type's environmental impact
                
                Format the response so I can easily parse these 5 data points into separate variables.`
              }
            ]
          }
        ]
      };
      
      const response = await callGeminiAPI(prompt, historicalData);
      
      // Simple parsing of AI response into impact data structure
      const aiResponse = response.text;
      
      // Extract impact data from AI response
      // This is a simple implementation - in production you'd want more robust parsing
      const lines = aiResponse.split('\n').map((raw: string) => raw.replace(/[*`]/g, '').trim());
      const impactInfo: ImpactData = {
        co2Saved: "0 kg",
        waterSaved: "0 L",
        energySaved: "0 kWh",
        treesEquivalent: "0",
        additionalInfo: ""
      };
      
      for (const line of lines) {
        if (/co2_emissions_saved_kg:/i.test(line) || line.toLowerCase().includes('co2 emissions saved')) {
          const parts = line.split(':'); impactInfo.co2Saved = parts[1]?.trim() || impactInfo.co2Saved;
        } else if (/water_saved|water saved/i.test(line)) {
          const parts = line.split(':'); impactInfo.waterSaved = parts[1]?.trim() || impactInfo.waterSaved;
        } else if (/energy_saved|energy saved/i.test(line)) {
          const parts = line.split(':'); impactInfo.energySaved = parts[1]?.trim() || impactInfo.energySaved;
        } else if (/equivalent_trees|equivalent to trees/i.test(line)) {
          const parts = line.split(':'); impactInfo.treesEquivalent = parts[1]?.trim() || impactInfo.treesEquivalent;
        } else if (/additional_fact|additional info|fact:/i.test(line) || line.toLowerCase().startsWith('additional_fact')) {
          const parts = line.split(':'); impactInfo.additionalInfo = parts[1]?.trim() || impactInfo.additionalInfo;
        }
      }
      
      // Fallback parsing for free-form sentences
      if (impactInfo.co2Saved === "0 kg") {
        const co2Match = aiResponse.match(/([\d\.]+)\s*kg\s*of\s*CO2/i);
        if (co2Match) impactInfo.co2Saved = `${co2Match[1]} kg`;
      }
      if (impactInfo.waterSaved === "0 L") {
        const waterMatch = aiResponse.match(/([\d\.]+)\s*liters?/i);
        if (waterMatch) impactInfo.waterSaved = `${waterMatch[1]} L`;
      }
      if (impactInfo.energySaved === "0 kWh") {
        const energyMatch = aiResponse.match(/([\d\.]+)\s*(MJ|kWh)/i);
        if (energyMatch) impactInfo.energySaved = `${energyMatch[1]} ${energyMatch[2]}`;
      }
      if (impactInfo.treesEquivalent === "0") {
        const treesMatch = aiResponse.match(/([\d\.]+)\s*trees?/i);
        if (treesMatch) impactInfo.treesEquivalent = treesMatch[1];
      }
      // Fallback for additional info: take the summary line about recycling
      if (!impactInfo.additionalInfo) {
        // Split original response into lines, remove empty and code fence lines
        const rawLines = aiResponse.split(/\r?\n/)
          .map((l: string) => l.trim())
          .filter((l: string) => l && !l.startsWith('```'));
        // Find a summary line that mentions recycling
        const summaryLine = rawLines.find((l: string) => /recycling/i.test(l) && l.length > 20);
        if (summaryLine) {
          impactInfo.additionalInfo = summaryLine.replace(/[*`]/g, '');
        } else {
          // Fallback: use last non-empty line
          impactInfo.additionalInfo = rawLines[rawLines.length - 1] || impactInfo.additionalInfo;
        }
      }
      
      setImpactData(impactInfo);
      setIsLoadingImpact(false);
      
    } catch (error) {
      console.error('Error getting impact data from AI:', error);
      setIsLoadingImpact(false);
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])
  
  // Load impact data when user switches to impact tab
  useEffect(() => {
    if (activeTab === 'impact' && !impactData && !isLoadingImpact) {
      getImpactDataFromAI();
    }
  }, [activeTab, impactData, isLoadingImpact]);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return
    
    try {
      setIsLoading(true)
      
      // Add user message to chat
      const userMessage = { role: "user" as const, content: inputMessage }
      setMessages(prevMessages => [...prevMessages, userMessage])
      setInputMessage("")
      
      // Check if using demo mode
      const useDemoMode = DEMO_MODE;
      
      if (DEBUG_MODE) {
        console.log(`Using ${useDemoMode ? 'DEMO' : 'REAL API'} mode for chat`);
      }
      
      if (useDemoMode) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock response based on user query
        let responseText = ""
        const query = inputMessage.toLowerCase()
        
        if (analysis) {
          if (query.includes("recycle") || query.includes("disposal")) {
            responseText = analysis.recyclable 
              ? `Yes, ${analysis.plasticType} (Type ${analysis.recyclingCode}) is recyclable in most areas. Make sure it's clean and dry before recycling. Check with your local recycling center for specific guidelines.`
              : `Unfortunately, ${analysis.plasticType} (Type ${analysis.recyclingCode}) is generally not accepted by curbside recycling programs. Consider reusing it if possible, or look for specialized recycling drop-off locations.`
          }
          else if (query.includes("environment") || query.includes("impact")) {
            responseText = `${analysis.environmentalImpact} Plastics like this one can take hundreds of years to break down in the environment. Reducing consumption of single-use plastics has the biggest positive impact.`
          }
          else if (query.includes("alternative") || query.includes("instead")) {
            responseText = `For alternatives to ${analysis.plasticType}, consider: \n- Glass containers (highly reusable and recyclable)\n- Stainless steel containers (durable and long-lasting)\n- Silicone products (flexible and heat-resistant)\n- Paper or cardboard packaging (if appropriate for your needs)`
          }
          else if (query.includes("carbon") || query.includes("co2") || query.includes("emission")) {
            responseText = `Recycling ${analysis.plasticType} can help reduce carbon emissions. Each kilogram of this plastic type recycled saves approximately 1.8kg of CO2 emissions compared to producing new plastic.`
          }
          else {
            responseText = `That's a good question about ${analysis.plasticType}. This plastic is commonly used for ${analysis.description.toLowerCase()} To make more sustainable choices, remember to reduce, reuse, and recycle when possible.`
          }
        }
        
        // Add assistant response to chat
        const assistantMessage = { role: "assistant" as const, content: responseText }
        setMessages(prevMessages => [...prevMessages, assistantMessage])
        setIsLoading(false)
        
        return;
      }
      
      // REAL API MODE
      if (analysis) {
        if (DEBUG_MODE) {
          console.log('Preparing prompt with analysis context');
        }
        
        // Create a prompt that includes the plastic analysis context and historical data
        const prompt = {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `I'm asking about this plastic item I scanned:
                  
                  Plastic Type: ${analysis.plasticType}
                  Recycling Code: ${analysis.recyclingCode}
                  Description: ${analysis.description}
                  Recyclable: ${analysis.recyclable ? "Yes" : "No"}
                  Environmental Impact: ${analysis.environmentalImpact}
                  
                  My question is: ${inputMessage}`
                }
              ]
            }
          ]
        };
        
        try {
          // Call the LLM API with historical data if available
          if (DEBUG_MODE) console.log('Calling chat API');
          
          const response = await callGeminiAPI(prompt, historicalData);
          
          if (DEBUG_MODE) console.log('Received chat API response');
          
          // Add response to chat
          const assistantMessage = { role: "assistant" as const, content: response.text }
          setMessages(prevMessages => [...prevMessages, assistantMessage])
        } catch (apiError) {
          console.error('Error in chat API call:', apiError);
          // Add error message to chat
          const errorMessage = { 
            role: "assistant" as const, 
            content: "I'm sorry, I encountered an error processing your request. Please try again." 
          };
          setMessages(prevMessages => [...prevMessages, errorMessage]);
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error sending message:', err)
      setError('Failed to send message. Please try again.')
      setIsLoading(false)
    }
  }

  // Update the callGeminiAPI function to include history
  const callGeminiAPI = async (prompt: any, history: HistoricalPlastic[] = []) => {
    try {
      console.log('Chat component: Calling chat API with:', {
        promptContentsLength: prompt.contents?.length,
        hasHistory: history.length > 0,
        historyCount: history.length
      });
      
      // Call the API endpoint with history data
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...prompt,
          history: history
        }),
      });
      
      if (!response.ok) {
        console.error('Chat component: API request failed with status', response.status);
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('Chat component: Received API response:', {
        responseLength: data.text?.length,
        hasError: !!data.error,
        responsePreview: data.text?.substring(0, 100) + (data.text?.length > 100 ? '...' : '')
      });
      
      return { text: data.text };
    } catch (error) {
      console.error('Chat component: Error calling chat API:', error);
      return { 
        text: "I'm sorry, I couldn't process your request at the moment. Please try again later."
      };
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 py-8 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between mb-4">
        <Link href="/scan/analysis" passHref>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Plastic Assistant</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {analysis && (
        <div className="mb-4">
          <Card className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-6">Type {analysis.recyclingCode}</Badge>
              <span className="text-sm font-medium truncate">{analysis.plasticType}</span>
            </div>
            <Badge 
              variant={analysis.recyclable ? "default" : "destructive"}
              className="text-xs"
            >
              {analysis.recyclable ? "Recyclable" : "Not Recyclable"}
            </Badge>
          </Card>
        </div>
      )}

      <Tabs 
        defaultValue="chat" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="chat" className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center gap-1">
            <Leaf className="h-3.5 w-3.5" />
            <span>Impact</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ScrollArea className="flex-1 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === 'assistant' ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      <span className="text-xs font-medium">
                        {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                      </span>
                    </div>
                    <div className="prose text-sm whitespace-pre-wrap">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-3 rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Sticky input and info at bottom */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-2">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question about this plastic..."
                disabled={isLoading || !!error}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isLoading || !!error}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p className="flex items-center">
                <Info className="h-3 w-3 mr-1" />
                Ask about recycling options, environmental impact, or alternatives
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="impact" className="flex-1 flex flex-col">
          <div className="border rounded-lg p-4 flex-1 bg-gray-50 dark:bg-gray-900">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Leaf className="h-5 w-5 mr-2 text-green-500" />
              Environmental Impact
            </h2>
            
            {isLoadingImpact && (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="animate-spin h-10 w-10 mb-4">
                  <Leaf className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Calculating impact...</h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs mt-2">
                  Our AI is analyzing the environmental impact of this plastic item.
                </p>
              </div>
            )}
            
            {!isLoadingImpact && impactData ? (
              <div className="space-y-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  By recycling this {analysis?.plasticType} item, you're making a positive impact on the environment:
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  <Card className="p-4 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30">
                    <div className="flex items-center mb-2">
                      <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                        <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-green-800 dark:text-green-300">CO₂ Emissions Saved</h3>
                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                          {impactData.co2Saved}
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30">
                      <h3 className="text-sm font-medium mb-1 text-blue-800 dark:text-blue-300">Water Saved</h3>
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                        {impactData.waterSaved}
                      </p>
                    </Card>
                    
                    <Card className="p-4 border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/30">
                      <h3 className="text-sm font-medium mb-1 text-orange-800 dark:text-orange-300">Trees Equivalent</h3>
                      <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
                        {impactData.treesEquivalent}
                      </p>
                    </Card>
                  </div>

                  <Card className="p-4 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30">
                    <h3 className="text-sm font-medium mb-1 text-purple-800 dark:text-purple-300">Energy Saved</h3>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                      {impactData.energySaved}
                    </p>
                  </Card>
                  
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Did you know?</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {impactData.additionalInfo}
                    </p>
                  </div>
                </div>
              </div>
            ) : !isLoadingImpact && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Leaf className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No impact data yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs mt-2">
                  Click the button below to calculate the environmental impact of recycling this plastic item.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={getImpactDataFromAI}
                >
                  <Leaf className="h-4 w-4 mr-2" />
                  Calculate Impact
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 