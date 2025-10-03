'use client';

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { 
  MessageCircle, 
  Send, 
  User, 
  Bot,
  Activity,
  Apple,
  Calculator
} from "lucide-react";

export default function DietRecommenderChatbot() {
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "🍎 Welcome to DietAmigo's AI Diet Recommender! I can help you create personalized diet plans based on your BMI, dietary preferences, health goals, and more.", 
      timestamp: new Date()
    },
    {
      sender: "bot",
      text: "Let's start with your basic information:\n• Weight (kg)\n• Height (m)\n• Age\n• Activity level (sedentary/moderate/active)\n• Any dietary restrictions or preferences",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('ready'); // 'ready', 'connecting', 'fallback', 'offline'
  const [userProfile, setUserProfile] = useState({
    weight: null,
    height: null,
    age: null,
    activityLevel: null,
    dietaryRestrictions: [],
    goals: []
  });
  const [conversationStage, setConversationStage] = useState("initial");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // BMI calculation
  const calculateBmi = (weight, height) => {
    return (weight / (height * height)).toFixed(2);
  };

  // BMR calculation (Basal Metabolic Rate)
  const calculateBMR = (weight, height, age, gender = "unknown") => {
    // Using Mifflin-St Jeor Equation (assuming average)
    return Math.round(10 * weight + 6.25 * (height * 100) + 5 * age + 5);
  };

  // Parse user input for profile information
  const parseUserInput = (input) => {
    const text = input.toLowerCase();
    const numbers = input.match(/\d+\.?\d*/g) || [];
    
    let updates = {};
    
    // Extract weight
    if (text.includes('weight') || text.includes('kg')) {
      const weightMatch = numbers.find(n => parseFloat(n) > 30 && parseFloat(n) < 300);
      if (weightMatch) updates.weight = parseFloat(weightMatch);
    }
    
    // Extract height
    if (text.includes('height') || text.includes('m') || text.includes('meter')) {
      const heightMatch = numbers.find(n => parseFloat(n) > 1 && parseFloat(n) < 3);
      if (heightMatch) updates.height = parseFloat(heightMatch);
    }
    
    // Extract age
    if (text.includes('age') || text.includes('years') || text.includes('old')) {
      const ageMatch = numbers.find(n => parseFloat(n) > 10 && parseFloat(n) < 100);
      if (ageMatch) updates.age = parseInt(ageMatch);
    }
    
    // Extract activity level
    if (text.includes('sedentary') || text.includes('inactive')) {
      updates.activityLevel = 'sedentary';
    } else if (text.includes('moderate') || text.includes('normal')) {
      updates.activityLevel = 'moderate';
    } else if (text.includes('active') || text.includes('very active') || text.includes('athlete')) {
      updates.activityLevel = 'active';
    }
    
    // Extract dietary restrictions
    const restrictions = [];
    if (text.includes('vegetarian')) restrictions.push('vegetarian');
    if (text.includes('vegan')) restrictions.push('vegan');
    if (text.includes('gluten')) restrictions.push('gluten-free');
    if (text.includes('dairy') || text.includes('lactose')) restrictions.push('dairy-free');
    if (text.includes('keto')) restrictions.push('ketogenic');
    if (text.includes('paleo')) restrictions.push('paleo');
    if (text.includes('diabetic') || text.includes('diabetes')) restrictions.push('diabetic');
    if (restrictions.length > 0) updates.dietaryRestrictions = restrictions;
    
    return updates;
  };

  // Generate diet recommendation using Gemini AI (simplified like Python example)
  const generateDietRecommendation = async (profile) => {
    setLoading(true);
    setApiStatus('connecting');
    
    try {
      const bmi = calculateBmi(profile.weight, profile.height);
      const prompt = `My BMI is ${bmi}. I am ${profile.age} years old, ${profile.activityLevel} activity level. ${profile.dietaryRestrictions?.length ? `Dietary restrictions: ${profile.dietaryRestrictions.join(', ')}.` : ''} Suggest a healthy daily diet plan based on this information.`;
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          userProfile: profile
        })
      });

      if (!response.ok) throw new Error(`API request failed`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setApiStatus('ready');
      return data.response;
    } catch (error) {
      setApiStatus('fallback');
      const bmi = calculateBmi(profile.weight, profile.height);
      return `⚠️ AI Service Unavailable\n\nBMI: ${bmi}\nBasic Guidelines:\n• Eat balanced meals\n• Include proteins, vegetables, and whole grains\n• Stay hydrated\n• Consult a nutritionist for detailed advice`;
    } finally {
      setLoading(false);
    }
  };

  // Handle follow-up questions using Gemini AI (simplified)
  const handleFollowUpQuestion = async (question) => {
    setLoading(true);
    setApiStatus('connecting');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: question,
          userProfile: userProfile 
        })
      });

      if (!response.ok) throw new Error(`API request failed`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setApiStatus('ready');
      return data.response;
    } catch (error) {
      setApiStatus('fallback');
      return `I'm having trouble connecting to our AI service right now. Please try again in a moment.`;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message
    const userMessage = { sender: "user", text: userInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);

    // Parse user input for profile information
    const updates = parseUserInput(userInput);
    const updatedProfile = { ...userProfile, ...updates };
    setUserProfile(updatedProfile);

    // Check if we have enough information for a recommendation
    const hasBasicInfo = updatedProfile.weight && updatedProfile.height && updatedProfile.age && updatedProfile.activityLevel;

    if (hasBasicInfo && conversationStage === "initial") {
      setConversationStage("generating");
      setUserInput("");
      
      // Generate diet recommendation
      const recommendation = await generateDietRecommendation(updatedProfile);
      setMessages(prev => [...prev, { sender: "bot", text: recommendation, timestamp: new Date() }]);
      
      // Ask for follow-up
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: "bot", 
          text: "Would you like me to modify this plan based on any specific preferences, or do you have questions about nutrition?",
          timestamp: new Date()
        }]);
        setConversationStage("followup");
      }, 1000);
      
    } else if (conversationStage === "initial") {
      // Ask for missing information
      let missingInfo = [];
      if (!updatedProfile.weight) missingInfo.push("weight");
      if (!updatedProfile.height) missingInfo.push("height");
      if (!updatedProfile.age) missingInfo.push("age");
      if (!updatedProfile.activityLevel) missingInfo.push("activity level");
      
      const response = `I've noted your information! I still need your ${missingInfo.join(", ")}. Could you please provide these details?`;
      setMessages(prev => [...prev, { sender: "bot", text: response, timestamp: new Date() }]);
      
    } else if (conversationStage === "followup") {
      // Handle follow-up questions using Gemini AI
      const response = await handleFollowUpQuestion(userInput);
      setMessages(prev => [...prev, { sender: "bot", text: response, timestamp: new Date() }]);
    }

    setUserInput("");
    setLoading(false);
  };

  const handleQuickReply = (reply) => {
    setUserInput(reply);
  };

  const quickReplies = conversationStage === "initial" 
    ? [
        "I'm 70kg, 1.75m, 25 years old, moderately active",
        "I'm vegetarian",
        "I want to lose weight",
        "I have diabetes"
      ]
    : [
        "Can you suggest some recipes?",
        "What about exercise?",
        "How much water should I drink?",
        "Can I have cheat meals?"
      ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      {/* <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center justify-between text-xl">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Apple className="w-5 h-5" />
              </div>
              AI Diet Recommender
            </div> */}
            {/* API Status Indicator */}
            {/* <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                apiStatus === 'ready' ? 'bg-green-500' :
                apiStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                apiStatus === 'fallback' ? 'bg-orange-500' : 'bg-red-500'
              }`}></div>
              <span className="text-xs text-muted-foreground">
                {apiStatus === 'ready' ? 'AI Online' :
                 apiStatus === 'connecting' ? 'Connecting...' :
                 apiStatus === 'fallback' ? 'Fallback Mode' : 'Offline'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card> */}

      <Separator />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <div className="bg-primary text-primary-foreground p-2 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            
            <div
              className={`max-w-[70%] p-3 rounded-lg whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground border shadow-sm"
              }`}
            >
              {msg.text}
              <div className={`text-xs mt-2 opacity-70 ${
                msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {msg.sender === "user" && (
              <div className="bg-muted text-muted-foreground p-2 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="bg-primary text-primary-foreground p-2 rounded-full w-8 h-8 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-card text-card-foreground border shadow-sm p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-muted-foreground">Analyzing and generating your personalized diet plan...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <Separator />

      {/* Quick Replies */}
      {!loading && (
        <div className="p-4 bg-card">
          <div className="mb-3">
            <span className="text-sm text-muted-foreground">Quick replies:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                className="text-xs"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Input Area */}
      <Card className="rounded-none border-x-0 border-b-0">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full p-3 pr-12 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                disabled={loading}
              />
              <MessageCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <Button
              type="submit"
              disabled={loading || !userInput.trim()}
              className="px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}