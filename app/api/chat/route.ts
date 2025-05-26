import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

// Define interface for content part
interface ContentPart {
  text: string;
}

interface ContentItem {
  role: string;
  parts: ContentPart[];
}

interface HistoricalItem {
  plasticType: string;
  recyclingCode: number;
  weight: string;
  unit: string;
  recyclable: boolean;
  timestamp: number;
}

// Helper function for detailed logging
function logWithTimestamp(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}] RePlas AI:`;
  
  if (data) {
    console.log(`${logPrefix} ${message}`);
    console.log(JSON.stringify(data, null, 2));
    console.log('-'.repeat(80)); // Separator line for clarity
  } else {
    console.log(`${logPrefix} ${message}`);
  }
}

// Handler for POST requests
export async function POST(request: NextRequest) {
  try {
    logWithTimestamp('Received chat request');
    
    // Parse request body
    const body = await request.json();
    const { contents, history } = body;
    
    logWithTimestamp('Request body parsed', { 
      contentsLength: contents?.length,
      hasHistory: !!history,
      historyLength: history?.length
    });

    // Check if prompt is provided
    if (!contents) {
      logWithTimestamp('Error: Missing required parameter: contents');
      return NextResponse.json(
        { error: 'Missing required parameter: contents' }, 
        { status: 400 }
      );
    }

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyB6j2kGAu88UqOhVNN8KSbUjijlXMfdovY";
    
    // Check if API key is valid
    if (!apiKey || apiKey === 'your-gemini-api-key-goes-here' || apiKey.includes('your') || apiKey.includes('api-key')) {
      logWithTimestamp('Error: Invalid Gemini API key');
      return NextResponse.json(
        { error: 'Configuration error: Invalid API key' }, 
        { status: 500 }
      );
    }

    logWithTimestamp('Initializing Gemini API with model: gemini-2.0-flash');
    
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Initialize the Gemini 2.0 Flash model for chat - faster responses with good quality
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    // Extract the user's analysis details from the body
    const userQuery = contents.find((c: ContentItem) => c.role === "user")?.parts[0]?.text || "";
    logWithTimestamp('User query', { query: userQuery });

    // Create a chat session
    const chat = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      }
    });

    // Prepare context information about plastic recycling and carbon emissions
    let contextPrompt = `I'm a helpful assistant specializing in plastic recycling and sustainability.

CARBON EMISSION INSIGHTS:
- Plastic recycling significantly reduces carbon emissions compared to creating virgin plastic
- PET (Type 1) recycling saves approximately 1.5 kg CO2 per kg of plastic
- HDPE (Type 2) recycling saves approximately 1.8 kg CO2 per kg of plastic
- PVC (Type 3) recycling saves approximately 2.0 kg CO2 per kg of plastic
- LDPE (Type 4) recycling saves approximately 1.7 kg CO2 per kg of plastic
- PP (Type 5) recycling saves approximately 1.9 kg CO2 per kg of plastic
- PS (Type 6) recycling saves approximately 2.1 kg CO2 per kg of plastic
- OTHER (Type 7) recycling saves approximately 1.6 kg CO2 per kg of plastic
- In addition to CO2 savings, recycling reduces energy consumption by 40-90% compared to virgin plastic production
- Plastic in landfills can take 400-1000 years to decompose while releasing methane and other greenhouse gases
- Plastic Recycling & Environmental Impact: Use these insights only when the user asks about plastic recycling or its environmental effects.
- General Knowledge: For other topics, respond appropriately using well-informed explanations rather than one-liners.
- Response Format: Ensure responses provide valuable information, including estimated and actual data, to help users better understand plastic recycling and related questions.
- Responses should be single plain-text sentences containing relevant estimated and actual data to enhance understanding of plastic recycling and broader general knowledge topics.

Water usage should be calculated in liters (L), energy saved in kilowatt-hours (kWh), CO₂ emissions saved in kilograms (kg), and tree savings should be estimated. These metrics should only be generated when specifically requested.
Use these insights only when the user asks about plastic recycling or its environmental impact. For any other topic, respond appropriately based on general knowledge and address the user's query. Ensure responses are helpful, providing valuable information about plastic recycling and related topics, so users can better understand plastic and its impact.
When providing environmental impact metrics or other data, always offer reasonable estimates based on typical industry values, and avoid stating uncertainty or lack of knowledge; instead, supply approximate figures and note they are estimates.`;

    // Add historical data context if provided
    if (history && Array.isArray(history) && history.length > 0) {
      logWithTimestamp('Processing historical data', {
        historyCount: history.length
      });
      
      contextPrompt += `

HISTORICAL PLASTIC SUBMISSIONS:
The user has previously scanned and analyzed the following plastic items:
${history.map((item: HistoricalItem, index: number) => `
Item ${index + 1}: 
- Type: ${item.plasticType} (Code ${item.recyclingCode})
- Weight: ${item.weight}
- Recyclable: ${item.recyclable ? "Yes" : "No"}
- Date: ${new Date(item.timestamp).toLocaleDateString()}
`).join('')}

When the user asks about "previous plastics" or "my history" or "past items", refer to this data and provide insights, comparisons, or trends.`;
    }

    // Respond to the user's query with context
    logWithTimestamp('Sending prompt to Gemini Chat API', {
      contextLength: contextPrompt.length,
      userQuery
    });

    // First send context as an initial message
    await chat.sendMessage(contextPrompt);
    
    // Then send the actual user query to get a response
    const result = await chat.sendMessage(userQuery);
    const text = result.response.text();

    // Log the raw response from the AI
    logWithTimestamp('Received raw response from Gemini API', {
      responseLength: text.length,
      responsePreview: text.substring(0, 200) + (text.length > 200 ? '...' : '')
    });
    
    // Log full response in a clean format for easy reading
    logWithTimestamp('Full response text:');
    console.log('-'.repeat(80));
    console.log(text);
    console.log('-'.repeat(80));
    
    // Return the chat response
    return NextResponse.json({ text });
  } catch (error: any) {
    logWithTimestamp('Error in chat API route', {
      errorMessage: error.message,
      errorStack: error.stack
    });
    
    // Return error response with more details
    return NextResponse.json(
      { 
        text: "I'm sorry, I couldn't process your request at the moment. Please try again later.",
        error: error.message || "Unknown error" 
      }, 
      { status: 500 }
    );
  }
} 