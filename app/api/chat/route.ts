import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Handler for POST requests
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { contents } = body;

    // Check if prompt is provided
    if (!contents) {
      return NextResponse.json(
        { error: 'Missing required parameter: contents' }, 
        { status: 400 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    // Check if API key is valid
    if (!apiKey || apiKey === 'your-gemini-api-key-goes-here' || apiKey.includes('your') || apiKey.includes('api-key')) {
      console.error('Invalid Gemini API key');
      return NextResponse.json(
        { error: 'Configuration error: Invalid API key' }, 
        { status: 500 }
      );
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Initialize the Gemini 1.5 Pro model for chat
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
    });

    // Call the Gemini API
    const result = await model.generateContent({
      contents,
    });

    // Get the response text
    const response = await result.response;
    const text = response.text();
    
    // Return the chat response
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error in chat API route:', error);
    
    // Return error response
    return NextResponse.json(
      { text: "I'm sorry, I couldn't process your request at the moment. Please try again later." }, 
      { status: 500 }
    );
  }
} 