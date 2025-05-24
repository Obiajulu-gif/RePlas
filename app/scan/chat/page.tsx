"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send, Bot, User, Info } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

type Message = {
  role: "user" | "assistant";
  content: string;
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
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Initialize the client (at component level)
  const geminiClient = new GeminiAIClient()

  // Load analysis data from session storage when component mounts
  useEffect(() => {
    try {
      const storedAnalysis = sessionStorage.getItem('plasticAnalysis')
      
      if (storedAnalysis) {
        const parsedAnalysis = JSON.parse(storedAnalysis) as AnalysisResult
        setAnalysis(parsedAnalysis)
        
        if (DEBUG_MODE) {
          console.log('Debug mode enabled');
          console.log('Demo mode:', DEMO_MODE ? 'Enabled' : 'Disabled');
          console.log('Loaded analysis:', parsedAnalysis);
        }
        
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

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
        
        // Create a prompt that includes the plastic analysis context
        const prompt = {
          contents: [
            {
              role: "system",
              parts: [
                {
                  text: `You are a helpful assistant specializing in plastic recycling and sustainability.
                  You have analyzed a plastic item with the following properties:
                  
                  Plastic Type: ${analysis.plasticType}
                  Recycling Code: ${analysis.recyclingCode}
                  Description: ${analysis.description}
                  Recyclable: ${analysis.recyclable ? "Yes" : "No"}
                  Environmental Impact: ${analysis.environmentalImpact}
                  
                  The user is asking questions about this specific plastic item.
                  Be informative but concise. Focus on providing practical advice and accurate information.`
                }
              ]
            },
            {
              role: "user",
              parts: [{ text: inputMessage }]
            }
          ]
        };
        
        try {
          // Call the LLM API
          if (DEBUG_MODE) console.log('Calling chat API');
          
          const response = await callGeminiAPI(prompt);
          
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
  
  // Replace the mock callGeminiAPI function with a real implementation
  const callGeminiAPI = async (prompt: any) => {
    try {
      // Call the API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prompt),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return { text: data.text };
    } catch (error) {
      console.error('Error calling chat API:', error);
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

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ScrollArea className="flex-1 p-3 border rounded-lg mb-4 bg-gray-50 dark:bg-gray-900" ref={scrollAreaRef}>
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
                <div className="text-sm whitespace-pre-line">
                  {message.content}
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
  )
} 