import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model configuration with fallback order
const MODEL_CONFIGS = {
  pro: { name: 'gemini-2.5-pro' },
  flash: { name: 'gemini-2.5-flash' }
};

// Simple system prompt for diet recommendations
const SYSTEM_PROMPT = `You are a helpful diet advisor. Provide personalized diet recommendations based on the user's information.`;

async function tryGenerateResponse(modelConfig, prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: modelConfig.name });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return { success: true, text, model: modelConfig.name };
  } catch (error) {
    return { success: false, error: error.message, model: modelConfig.name };
  }
}

export async function POST(request) {
  try {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { message, userProfile, conversationHistory } = await request.json();

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build simple prompt like Python example
    let prompt = message;
    
    if (userProfile && Object.keys(userProfile).length > 0) {
      const { weight, height, age, activityLevel, dietaryRestrictions } = userProfile;
      if (weight && height) {
        const bmi = (weight / (height * height)).toFixed(2);
        prompt = `My BMI is ${bmi}. I am ${age} years old, ${activityLevel} activity level. ${dietaryRestrictions?.length ? `Dietary restrictions: ${dietaryRestrictions.join(', ')}.` : ''} ${message}`;
      }
    }

    // Try Gemini Pro first, fallback to Flash
    let result = await tryGenerateResponse(MODEL_CONFIGS.pro, prompt);
    
    if (!result.success) {
      console.log(`Gemini Pro failed: ${result.error}, trying Flash model...`);
      result = await tryGenerateResponse(MODEL_CONFIGS.flash, prompt);
    }

    if (!result.success) {
      console.error('Both models failed:', result.error);
      return NextResponse.json(
        { 
          error: 'Unable to generate response from AI models',
          details: result.error 
        },
        { status: 500 }
      );
    }

    // Return successful response
    return NextResponse.json({
      response: result.text,
      model: result.model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'DietAmigo AI Chat API',
    models: Object.keys(MODEL_CONFIGS),
    timestamp: new Date().toISOString()
  });
}