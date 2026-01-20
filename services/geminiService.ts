import { AnalysisResult } from "../types";

// 🔴 PASTE YOUR HUGGING FACE TOKEN HERE
const HF_TOKEN = "hf_xxxxxxxxxxxxxxxxxxxxxx";

// ---------------------------------------------------------
// 1. LOCAL FALLBACK (This runs if the AI fails, preventing the crash)
// ---------------------------------------------------------
const performLocalAnalysis = (subject: string, body: string): AnalysisResult => {
  console.log("⚠️ Using Local Fallback Analysis");
  
  const text = (subject + " " + body).toLowerCase();
  
  // Simple keyword detection
  const redFlags = ["urgent", "verify", "password", "suspended", "click here", "winner", "account access"];
  const foundIndicators = redFlags.filter(flag => text.includes(flag));
  
  // Calculate a basic score
  let score = 10;
  if (foundIndicators.length > 0) score += 40;
  if (text.includes("http")) score += 20;

  const isSafe = score < 50;

  return {
    isSafe: isSafe,
    riskScore: score,
    riskLevel: score > 75 ? "HIGH" : (score > 40 ? "MEDIUM" : "LOW"),
    summary: isSafe 
      ? "Analyzed locally. No immediate keywords found, but be cautious with links." 
      : "Suspicious patterns detected (Urgency/Links).",
    // 🟢 CRITICAL: We ensure these are always arrays to stop the white screen
    indicators: foundIndicators.length > 0 ? foundIndicators : ["Potential social engineering tone"],
    recommendations: ["Verify sender identity", "Do not click suspicious links", "Check URL spelling"]
  };
};

// ---------------------------------------------------------
// 2. MAIN SERVICE (Hugging Face)
// ---------------------------------------------------------
export const analyzeEmail = async (subject: string, body: string): Promise<AnalysisResult> => {
  
  // Safety Check: If no token, use local immediately
  if (!HF_TOKEN || HF_TOKEN.includes("PASTE_YOUR")) {
    console.warn("Token missing. Using local analysis.");
    return performLocalAnalysis(subject, body);
  }

  const prompt = `[INST] Act as a cybersecurity expert. Analyze this email.
  
  Subject: "${subject}"
  Body: "${body}"

  Return ONLY a valid JSON object with this structure:
  {
    "isSafe": boolean,
    "riskScore": number,
    "riskLevel": "LOW" | "MEDIUM" | "HIGH",
    "summary": "string",
    "indicators": ["string"],
    "recommendations": ["string"]
  }
  [/INST]`;

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        inputs: prompt,
        parameters: { max_new_tokens: 600, return_full_text: false, temperature: 0.1 } 
      }),
    });

    if (!response.ok) {
        throw new Error(`HF API Error: ${response.status}`);
    }

    const data = await response.json();
    let text = data[0]?.generated_text;

    if (!text) throw new Error("Empty response");

    // Extract JSON using Regex (Fixes issues where AI adds extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
    }
    
    // Parse JSON safely
    const result = JSON.parse(jsonMatch[0]);

    // 🟢 CRITICAL: Validate the result to prevent White Screen
    // We force the arrays to exist even if the AI forgot them
    return {
      isSafe: Boolean(result.isSafe),
      riskScore: Number(result.riskScore) || 50,
      riskLevel: result.riskLevel || "MEDIUM",
      summary: result.summary || "Analysis completed.",
      indicators: Array.isArray(result.indicators) ? result.indicators : ["Potential risk detected"],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : ["Exercise caution"]
    };

  } catch (error) {
    console.error("AI Analysis Failed, switching to fallback:", error);
    // If ANYTHING goes wrong, we return the local analysis
    // This ensures the user NEVER sees a white screen.
    return performLocalAnalysis(subject, body);
  }
};