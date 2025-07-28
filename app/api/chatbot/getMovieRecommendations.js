import { mapLocaleToLanguage } from "./languageHelperFunction";

export async function getMovieRecommendations(query, locale) {
  if (!query.trim()) {
    throw new Error("Please enter a movie title, actor, or genre.");
  }
  const targetLanguage = mapLocaleToLanguage(locale);
  const prompt = `Based on "${query}", briefly recommend a few similar movies. Respond in ${targetLanguage} only the titles.`;
  let chatHistory = [];
  chatHistory.push({ role: "user", parts: [{ text: prompt }] });

  const payload = { contents: chatHistory };
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `API error: ${response.status} ${response.statusText} - ${
          errorBody.error?.message || "Unknown error"
        }`
      );
    }

    const result = await response.json();

    if (
      result &&
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0] &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      const text = result.candidates[0].content.parts[0].text;
      return text
        .split("*")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    } else {
      throw new Error(
        "No recommendations found or unexpected API response structure. The model might not have generated content as expected."
      );
    }
  } catch (error) {
    console.error("Error fetching movie recommendations:", error);
    throw new Error(`Failed to get recommendations: ${error.message}`);
  }
}
