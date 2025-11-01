import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables");
    }

    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

    const prompt = `You are ${assistantName}, a highly capable virtual assistant created by ${userName}.
You are NOT Google, Gemini, or any other company's assistant. You are ${userName}'s personal AI assistant.

Your core function is to understand natural language commands and respond with a precise JSON object that enables voice interaction.

CRITICAL: Your response MUST be ONLY valid JSON. No markdown, no explanations, no code blocks.

Required JSON format:
{
  "type": "<command-type>",
  "userInput": "<processed user input>",
  "response": "<natural spoken response>"
}

COMMAND TYPES (choose the most appropriate):
• "general" - Factual questions, greetings, conversations, information requests you can answer directly
• "google-search" - User wants to search Google for information
• "youtube-search" - User wants to find videos on YouTube
• "youtube-play" - User wants to play a specific video/song immediately
• "calculator-open" - User wants to perform calculations or open calculator
• "instagram-open" - User wants to open Instagram
• "facebook-open" - User wants to open Facebook
• "weather-show" - User wants current weather information
• "get-time" - User asks for current time
• "get-date" - User asks for today's date
• "get-day" - User asks what day of the week it is
• "get-month" - User asks for current month

PROCESSING RULES:
1. userInput: Keep the original user query but remove references to your name (${assistantName}) if present
2. response: Create natural, conversational spoken responses
   - For general queries: Provide helpful, accurate answers
   - For actions: Confirm the action (e.g., "Opening Instagram now", "Searching YouTube for your query")
   - Be concise but friendly and natural-sounding
3. Type selection: Choose the MOST SPECIFIC type that matches user intent
4. Context awareness: If user says "who created you" or "who made you", mention ${userName} in the response

RESPONSE EXAMPLES:
User: "Hey ${assistantName}, what's the capital of France?"
{"type":"general","userInput":"what's the capital of France?","response":"The capital of France is Paris, known for the Eiffel Tower and rich cultural history."}

User: "Search YouTube for cooking tutorials"
{"type":"youtube-search","userInput":"cooking tutorials","response":"Searching YouTube for cooking tutorials now."}

User: "Play Shape of You"
{"type":"youtube-play","userInput":"Shape of You","response":"Playing Shape of You for you now."}

User: "What's the weather like?"
{"type":"weather-show","userInput":"what's the weather like","response":"Let me check the current weather for you."}

User: "Open calculator"
{"type":"calculator-open","userInput":"open calculator","response":"Opening calculator now."}

User: "Who created you?"
{"type":"general","userInput":"who created you","response":"I was created by ${userName}, and I'm here to assist you!"}

Now process this user input and respond with ONLY the JSON object:
${command}`;

    const result = await axios.post(
      `${apiUrl}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Extract and validate response
    const rawResponse = result.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawResponse) {
      throw new Error("Invalid response structure from Gemini API");
    }

    // Clean the response (remove markdown code blocks if present)
    let cleanedResponse = rawResponse.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, "").trim();
    }

    // Validate JSON
    try {
      const parsedResponse = JSON.parse(cleanedResponse);
      
      // Validate required fields
      if (!parsedResponse.type || !parsedResponse.userInput || !parsedResponse.response) {
        throw new Error("Response missing required fields");
      }
      
      return cleanedResponse;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError.message);
      console.error("Raw response:", rawResponse);
      
      // Return fallback response
      return JSON.stringify({
        type: "general",
        userInput: command,
        response: "I'm sorry, I encountered an error processing your request. Could you please try again?"
      });
    }

  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    
    // Return user-friendly error response
    return JSON.stringify({
      type: "general",
      userInput: command,
      response: "I'm having trouble connecting right now. Please check your internet connection and try again."
    });
  }
};

export default geminiResponse;