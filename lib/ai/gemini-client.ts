// This is a mock implementation of the Gemini AI client
// In a real implementation, we would use the Gemini API

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

export interface GeminiClient {
  chat: (messages: ChatMessage[]) => Promise<string>
  analyzePlasticImage: (imageBase64: string, weight?: number, unit?: string) => Promise<PlasticAnalysis>
  generateEnvironmentalImpact: (submissions: PlasticSubmission[]) => Promise<EnvironmentalImpact>
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface PlasticAnalysis {
  type: string
  confidence: number
  recyclable: boolean
  description: string
  estimatedWeight?: number
  tokenReward?: number
}

export interface PlasticSubmission {
  type: string
  weight: number
  timestamp: number
}

export interface EnvironmentalImpact {
  co2Offset: number
  waterSaved: number
  treesEquivalent: number
  summary: string
}

export class GeminiAIClient implements GeminiClient {
  private model: any;
  private geminiVisionModel: any;
  
  constructor() {
    // Get API key from environment variable
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    // Check if API key is valid (not undefined and not a placeholder)
    const isValidApiKey = apiKey && 
      apiKey !== 'your-gemini-api-key-goes-here' && 
      !apiKey.includes('your') &&
      !apiKey.includes('api-key');
    
    if (!isValidApiKey) {
      console.warn('Valid NEXT_PUBLIC_GEMINI_API_KEY is not defined - using mock data instead');
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey as string);
      // Initialize the Gemini 1.5 Pro model for text chat
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      
      // Initialize the Gemini model for image analysis (1.5 Pro has multimodal capabilities)
      this.geminiVisionModel = genAI.getGenerativeModel({
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
      
      console.log('Successfully initialized Gemini client with models: gemini-1.5-pro (text), gemini-2.0-flash (vision)');
    } catch (error) {
      console.error('Failed to initialize Gemini client:', error);
    }
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      if (!this.model) {
        throw new Error('Gemini client not initialized');
      }

      const chat = this.model.startChat();
      
      // Process each message and add it to the conversation
      for (const message of messages) {
        if (message.role === 'user') {
          await chat.sendMessage(message.content);
        }
      }
      
      // Get the last user message to send
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      
      if (!lastUserMessage) {
        throw new Error('No user message found');
      }
      
      const result = await chat.sendMessage(lastUserMessage.content);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in Gemini chat:', error);
      throw error;
    }
  }

  async analyzePlasticImage(imageBase64: string, weight?: number, unit?: string): Promise<PlasticAnalysis> {
    try {
      if (!this.geminiVisionModel) {
        console.warn('Gemini vision model not initialized, using mock data');
        return this.getDefaultPlasticAnalysis();
      }
      
      console.log('Starting plastic image analysis with Gemini');
      
      // Remove data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      
      console.log(`Base64 data length: ${base64Data.length} characters`);
      
      // Create prompt for plastic identification
      let prompt = `Analyze this image of a plastic item and identify the plastic type (1-7).
      Focus on any recycling symbol or number visible. If no recycling symbol is visible, 
      try to identify based on the plastic appearance and common use.
      
      For each plastic type, provide:
      1. The plastic type (e.g., "PET (Type 1)", "HDPE (Type 2)")
      2. A confidence score between 0.0 and 1.0
      3. Whether it's generally recyclable (true/false)
      4. A brief description of the plastic type and common uses`;
      
      if (weight && unit) {
        prompt += `\nThis plastic item weighs ${weight} ${unit}.`;
      }
      
      prompt += `\n\nRespond in the following JSON format only:
      {
        "type": "The plastic type (e.g., PET (Type 1))",
        "confidence": 0.XX,
        "recyclable": true|false,
        "description": "Brief description of the plastic and common uses"
      }`;
      
      console.log('Sending prompt to Gemini with image data');
      
      // Prepare the content for the API call
      const content = {
        contents: [{ 
          role: "user", 
          parts: [
            { text: prompt },
            { 
              inlineData: {
                mimeType: "image/jpeg", 
                data: base64Data 
              }
            }
          ] 
        }],
      };
      
      try {
        const result = await this.geminiVisionModel.generateContent(content);
        console.log('Received response from Gemini');
        
        const response = await result.response;
        const text = response.text();
        
        console.log('Processing Gemini response text');
        
        // Extract JSON from response
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                          text.match(/```([\s\S]*?)```/) || 
                          text.match(/{[\s\S]*?}/);
                          
        if (jsonMatch) {
          try {
            const jsonText = jsonMatch[1] || jsonMatch[0];
            console.log('Found JSON in response:', jsonText.substring(0, 100) + '...');
            
            const plasticData = JSON.parse(jsonText);
            return {
              type: plasticData.type || "Unknown",
              confidence: plasticData.confidence || 0.5,
              recyclable: plasticData.recyclable !== undefined ? plasticData.recyclable : false,
              description: plasticData.description || "No description provided",
            };
          } catch (jsonError) {
            console.error('Error parsing JSON response:', jsonError, 'Text:', text.substring(0, 200));
            // Fallback to default values
            return this.getDefaultPlasticAnalysis();
          }
        } else {
          console.error('No JSON found in response. Raw text:', text.substring(0, 200));
          
          // Try to extract information from the text
          const analysis = this.extractPlasticInfoFromText(text);
          if (analysis) {
            return analysis;
          }
          
          return this.getDefaultPlasticAnalysis();
        }
      } catch (apiError) {
        console.error('Error calling Gemini API:', apiError);
        return this.getDefaultPlasticAnalysis();
      }
    } catch (error) {
      console.error('Error in Gemini plastic analysis:', error);
      return this.getDefaultPlasticAnalysis();
    }
  }
  
  /**
   * Attempts to extract plastic information from plain text
   */
  private extractPlasticInfoFromText(text: string): PlasticAnalysis | null {
    try {
      const lowerText = text.toLowerCase();
      
      // Try to identify plastic type
      const typeMatches = [
        { type: "PET (Type 1)", keywords: ["pet", "pete", "polyethylene terephthalate", "type 1", "type one"] },
        { type: "HDPE (Type 2)", keywords: ["hdpe", "high-density polyethylene", "type 2", "type two"] },
        { type: "PVC (Type 3)", keywords: ["pvc", "polyvinyl chloride", "type 3", "type three"] },
        { type: "LDPE (Type 4)", keywords: ["ldpe", "low-density polyethylene", "type 4", "type four"] },
        { type: "PP (Type 5)", keywords: ["pp", "polypropylene", "type 5", "type five"] },
        { type: "PS (Type 6)", keywords: ["ps", "polystyrene", "type 6", "type six"] },
        { type: "Other (Type 7)", keywords: ["other plastic", "type 7", "type seven"] }
      ];
      
      let identifiedType = "Unknown";
      for (const match of typeMatches) {
        if (match.keywords.some(keyword => lowerText.includes(keyword))) {
          identifiedType = match.type;
          break;
        }
      }
      
      // Try to identify recyclability
      const recyclable = 
        lowerText.includes("recyclable") && 
        !lowerText.includes("not recyclable") && 
        !lowerText.includes("non-recyclable") &&
        !lowerText.includes("non recyclable");
      
      // Try to extract confidence
      const confidenceMatch = text.match(/confidence[:\s]*([\d.]+)/i) || 
                             text.match(/certainty[:\s]*([\d.]+)/i) ||
                             text.match(/confidence[:\s]*(low|medium|high)/i);
      
      let confidence = 0.5;
      if (confidenceMatch) {
        if (confidenceMatch[1] === "low") confidence = 0.3;
        else if (confidenceMatch[1] === "medium") confidence = 0.5;
        else if (confidenceMatch[1] === "high") confidence = 0.8;
        else confidence = parseFloat(confidenceMatch[1]);
      }
      
      // Use the text itself as the description (truncated)
      const description = text.substring(0, 150) + "...";
      
      return {
        type: identifiedType,
        confidence,
        recyclable,
        description
      };
    } catch (error) {
      console.error('Error extracting plastic info from text:', error);
      return null;
    }
  }

  private getDefaultPlasticAnalysis(): PlasticAnalysis {
    return {
      type: "Unknown",
      confidence: 0.5,
      recyclable: false,
      description: "Unable to identify the plastic type. Please ensure the recycling symbol is clearly visible in the image.",
    };
  }

  async generateEnvironmentalImpact(submissions: PlasticSubmission[]): Promise<EnvironmentalImpact> {
    // Calculate total weight
    const totalWeight = submissions.reduce((sum, sub) => sum + sub.weight, 0);

    // In a real implementation, we would use more accurate conversion factors
    // These are simplified estimates
    const co2Offset = totalWeight * 2; // 2kg CO2 per 1kg plastic
    const waterSaved = totalWeight * 8.7; // 8.7L water per 1kg plastic
    const treesEquivalent = co2Offset / 240; // 240kg CO2 per tree per year

    return {
      co2Offset,
      waterSaved,
      treesEquivalent,
      summary: `By recycling ${totalWeight.toFixed(1)}kg of plastic, you've offset approximately ${co2Offset.toFixed(1)}kg of CO2 emissions, saved ${waterSaved.toFixed(1)}L of water, and had an impact equivalent to planting ${treesEquivalent.toFixed(2)} trees.`,
    };
  }
}
