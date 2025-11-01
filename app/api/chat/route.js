import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Rate limiter: 20 requests per minute per IP
const limiter = rateLimit({ maxRequests: 20, windowMs: 60000 });

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
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = limiter(identifier);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          }
        }
      );
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { message, userProfile, conversationHistory } = await request.json();

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Valid message is required' },
        { status: 400 }
      );
    }

    // Sanitize input - remove potential XSS
    const sanitizedMessage = message.trim().slice(0, 2000); // Limit message length
    
    if (!sanitizedMessage) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    // Build simple prompt like Python example
    let prompt = sanitizedMessage;
    
    // Validate and sanitize userProfile data
    if (userProfile && Object.keys(userProfile).length > 0) {
      const { weight, height, age, activityLevel, dietaryRestrictions } = userProfile;
      
      // Validate numeric inputs
      const validWeight = weight && typeof weight === 'number' && weight > 0 && weight < 500;
      const validHeight = height && typeof height === 'number' && height > 0 && height < 3;
      const validAge = age && typeof age === 'number' && age > 0 && age < 150;
      
      if (validWeight && validHeight) {
        const bmi = (weight / (height * height)).toFixed(2);
        const ageStr = validAge ? `${age}` : 'not specified';
        const activityStr = activityLevel && typeof activityLevel === 'string' 
          ? activityLevel.slice(0, 50) 
          : 'not specified';
        const restrictionsStr = Array.isArray(dietaryRestrictions) && dietaryRestrictions.length > 0
          ? dietaryRestrictions.map(r => String(r).slice(0, 50)).join(', ')
          : '';
        
        prompt = `My BMI is ${bmi}. I am ${ageStr} years old, ${activityStr} activity level. ${restrictionsStr ? `Dietary restrictions: ${restrictionsStr}.` : ''} ${sanitizedMessage}`;
      }
    }

    // Try Gemini Pro first, fallback to Flash
    let result = await tryGenerateResponse(MODEL_CONFIGS.pro, prompt);
    
    if (!result.success) {
      // Log error without exposing details in production
      if (process.env.NODE_ENV === 'development') {
        console.log(`Gemini Pro failed: ${result.error}, trying Flash model...`);
      }
      result = await tryGenerateResponse(MODEL_CONFIGS.flash, prompt);
    }

    if (!result.success) {
      // Log error without exposing details in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Both models failed:', result.error);
      }
      return NextResponse.json(
        { 
          error: 'Unable to generate response from AI models',
          ...(process.env.NODE_ENV === 'development' && { details: result.error })
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
    // Log error details only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
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