"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, Camera } from "lucide-react"

export default function AIChatWidget() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your RePlas assistant. Ask me anything about plastic recycling or how to earn more tokens!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "PET (polyethylene terephthalate) is commonly used for water bottles and is highly recyclable. Make sure to rinse it before recycling!",
        "You can earn more RePlas tokens by consistently recycling high-value plastics like PET and HDPE. The cleaner the plastic, the more tokens you'll receive.",
        "Plastic type 5 (PP or polypropylene) is used for yogurt containers and bottle caps. It's becoming more widely accepted for recycling.",
        "The RePlas platform uses Celo blockchain to ensure transparent tracking of all recycled materials and token rewards.",
        "You've recycled 142.5kg of plastic so far, which has prevented approximately 284kg of CO₂ emissions!",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [...prev, { role: "assistant", content: randomResponse }])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="flex flex-col h-[400px] border-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-green-500" />
          Recycling Assistant
        </CardTitle>
        <CardDescription>Powered by Gemini 2.5 Pro</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[280px] px-4">
          <div className="space-y-4 pt-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[80%] gap-2 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className="h-8 w-8">
                    {message.role === "user" ? (
                      <AvatarImage src="/placeholder.svg?key=j5sn1" alt="User" />
                    ) : (
                      <AvatarImage src="/placeholder.svg?key=83itc" alt="Assistant" />
                    )}
                    <AvatarFallback>{message.role === "user" ? "U" : "AI"}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      message.role === "user" ? "bg-emerald-600 text-emerald-600-foreground" : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?key=g5aj3" alt="Assistant" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-muted px-3 py-2 text-sm">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.2s]"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-0">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex w-full items-center gap-2"
        >
          <Button type="button" size="icon" variant="outline" className="shrink-0">
            <Camera className="h-4 w-4" />
            <span className="sr-only">Attach image</span>
          </Button>
          <Input
            placeholder="Ask about plastic recycling..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
