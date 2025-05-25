import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

// Handler for POST requests
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { prompt, weight, unit } = body;

    // Check if prompt is provided
    if (!prompt) {
      console.log('Missing required parameter: prompt');
      return NextResponse.json(
        { error: 'Missing required parameter: prompt' }, 
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyB6j2kGAu88UqOhVNN8KSbUjijlXMfdovY";
    // Debug: log which key is being used
    console.log('Resolved Gemini API key:', apiKey ? apiKey.substring(0, 5) + '...' : 'undefined');
    
    // Check if API key is valid
    if (!apiKey || apiKey === 'your-gemini-api-key-goes-here' || apiKey.includes('your') || apiKey.includes('api-key')) {
      console.error('Invalid Gemini API key');
      return NextResponse.json(
        { error: 'Configuration error: Invalid API key' }, 
        { status: 500 }
      );
    }

    console.log('Initializing Gemini API with API key:', apiKey.substring(0, 5) + '...');
    
    try {
      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Initialize the Gemini model for image analysis
      // Using gemini-2.0-flash as specified in the documentation for image understanding
      console.log('Creating Gemini vision model with model: gemini-2.0-flash');
      const geminiVisionModel = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
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

      console.log('Preparing to call Gemini API with image data');
      console.log('Prompt structure:', JSON.stringify({
        contentLength: prompt.contents ? prompt.contents.length : 0,
        hasImage: prompt.contents && prompt.contents[0]?.parts?.some((part: any) => 
          part.inline_data?.mime_type?.includes('image') || 
          part.inlineData?.mimeType?.includes('image')
        )
      }));
      
      // Call the Gemini API with the prompt
      const result = await geminiVisionModel.generateContent({
        contents: prompt.contents,
      });

      console.log('Received response from Gemini API');
      
      // Get the response text
      const response = await result.response;
      const text = response.text();
      
      console.log('Extracted text from response');
      
      // Extract JSON from response
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                        text.match(/```([\s\S]*?)```/) || 
                        text.match(/{[\s\S]*?}/);
      
      if (jsonMatch) {
        try {
          const jsonText = jsonMatch[1] || jsonMatch[0];
          console.log('Found JSON in response:', jsonText.substring(0, 100) + '...');
          
          const plasticData = JSON.parse(jsonText);
          
          // Validate the required fields are present
          const requiredFields = ['plasticType', 'recyclingCode', 'description', 'recyclable'];
          const missingFields = requiredFields.filter(field => plasticData[field] === undefined);
          
          if (missingFields.length > 0) {
            console.warn(`Missing fields in AI response: ${missingFields.join(', ')}`);
            
            // Add default values for missing fields
            if (!plasticData.plasticType) plasticData.plasticType = "Unknown Plastic";
            if (!plasticData.recyclingCode) plasticData.recyclingCode = 7;
            if (!plasticData.description) plasticData.description = "Unable to identify plastic type accurately.";
            if (plasticData.recyclable === undefined) plasticData.recyclable = false;
            if (!plasticData.confidence) plasticData.confidence = 50;
            if (!plasticData.environmentalImpact) plasticData.environmentalImpact = "Unknown environmental impact.";
            if (!plasticData.usageTips) plasticData.usageTips = ["Check local recycling guidelines"];
          }
          
          console.log('Returning validated plastic data to client');
          // Return the analysis result
          return NextResponse.json(plasticData);
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError, 'Raw text:', text.substring(0, 200));
          // Return fallback response
          return NextResponse.json({
            plasticType: "Unknown Plastic",
            recyclingCode: 7,
            description: "Unable to identify plastic type due to parsing error.",
            recyclable: false,
            confidence: 40,
            environmentalImpact: "Unknown environmental impact.",
            usageTips: [
              "Check for recycling symbols on the item",
              "Consult local recycling guidelines",
              "Consider alternatives to single-use plastics"
            ]
          });
        }
      } else {
        console.error('No JSON found in response. Raw text:', text.substring(0, 200));
        
        // Try to extract information from plain text response
        try {
          // Create a structured response from the text
          const structuredResponse = {
            plasticType: extractPlasticType(text) || "Unknown Plastic",
            recyclingCode: extractRecyclingCode(text) || 7,
            description: text.substring(0, 150) + "...",
            recyclable: text.toLowerCase().includes("recycl") && !text.toLowerCase().includes("not recycl"),
            confidence: 30,
            environmentalImpact: "Environmental impact unclear from analysis.",
            usageTips: [
              "Check for recycling symbols on the item",
              "Consult local recycling guidelines",
              "Consider alternatives to single-use plastics"
            ]
          };
          
          console.log('Created structured response from text');
          return NextResponse.json(structuredResponse);
        } catch (textParseError) {
          console.error('Error parsing text response:', textParseError);
          // Return a generic fallback response
          return NextResponse.json({
            plasticType: "Unknown Plastic",
            recyclingCode: 7,
            description: "The AI response could not be properly parsed.",
            recyclable: false,
            confidence: 20,
            environmentalImpact: "Unknown environmental impact.",
            usageTips: [
              "Check for recycling symbols on the item",
              "Consult local recycling guidelines",
              "Consider alternatives to single-use plastics"
            ]
          });
        }
      }
    } catch (error: any) {
      console.error('Error initializing Gemini API:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Return error response
      return NextResponse.json(
        { 
          error: 'Internal server error',
          message: error.message,
          plasticType: "Unknown Plastic",
          recyclingCode: 7,
          description: "An error occurred during initialization. Please try again.",
          recyclable: false,
          confidence: 10,
          environmentalImpact: "Unknown environmental impact.",
          usageTips: [
            "Check for recycling symbols on the item manually",
            "Consult product packaging for recycling information"
          ]
        }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in API route:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Return error response
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        plasticType: "Unknown Plastic",
        recyclingCode: 7,
        description: "An error occurred during analysis. Please try again.",
        recyclable: false,
        confidence: 10,
        environmentalImpact: "Unknown environmental impact.",
        usageTips: [
          "Check for recycling symbols on the item manually",
          "Consult product packaging for recycling information"
        ]
      }, 
      { status: 500 }
    );
  }
}

// Helper functions to extract information from plain text
function extractPlasticType(text: string): string | null {
  // Look for common plastic type names
  const plasticTypes = [
    { name: "Polyethylene Terephthalate", code: 1, abbr: ["PET", "PETE"] },
    { name: "High-Density Polyethylene", code: 2, abbr: ["HDPE"] },
    { name: "Polyvinyl Chloride", code: 3, abbr: ["PVC", "V"] },
    { name: "Low-Density Polyethylene", code: 4, abbr: ["LDPE"] },
    { name: "Polypropylene", code: 5, abbr: ["PP"] },
    { name: "Polystyrene", code: 6, abbr: ["PS"] },
    { name: "Other", code: 7, abbr: ["OTHER"] }
  ];
  
  const lowerText = text.toLowerCase();
  
  for (const type of plasticTypes) {
    if (lowerText.includes(type.name.toLowerCase())) {
      return type.name;
    }
    
    for (const abbr of type.abbr) {
      // Check for abbreviation with word boundaries
      const regex = new RegExp(`\\b${abbr}\\b`, 'i');
      if (regex.test(text)) {
        return type.name;
      }
    }
  }
  
  return null;
}

function extractRecyclingCode(text: string): number | null {
  // Look for recycling codes (1-7)
  const codeMatch = text.match(/type\s*(\d)[^\d]|code\s*(\d)[^\d]|#(\d)[^\d]|number\s*(\d)[^\d]/i);
  
  if (codeMatch) {
    // Find the first non-undefined group
    const code = codeMatch.slice(1).find(match => match !== undefined);
    if (code) {
      const numberCode = parseInt(code, 10);
      if (numberCode >= 1 && numberCode <= 7) {
        return numberCode;
      }
    }
  }
  
  return null;
} 