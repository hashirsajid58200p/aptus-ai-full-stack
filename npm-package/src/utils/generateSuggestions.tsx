import axios from "axios";

const generateSugesstions = async (
  bussinessDetails: string,
  apiUrl: string
): Promise<string[]> => {
  try {
    const prompt = `Based on this business info: "${bussinessDetails}"

Generate exactly 4 short customer questions (each under 40 characters). Return only the questions, one per line:`;

    const res = await axios.post(`${apiUrl}/chatbot/generate`, { prompt });

    if (res.data.success && res.data.data) {
      const suggestions = res.data.data
        .split('\n')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 5 && s.length < 50)
        .map((s: string) => s.replace(/^\d+[\.\)\-\s]*/, ''))
        .filter((s: string) => s.includes('?') || s.toLowerCase().includes('what') || s.toLowerCase().includes('how'))
        .slice(0, 4);

      if (suggestions.length >= 2) {
        return suggestions;
      }
    }
  } catch (error) {
    console.error("Error generating suggestions via backend:", error);
  }

  // Fallback suggestions based on business content
  const businessLower = bussinessDetails.toLowerCase();
  const suggestions: string[] = [];
  if (businessLower.includes('service') || businessLower.includes('development') || businessLower.includes('consulting')) {
    suggestions.push('What services do you offer?');
  }
  if (businessLower.includes('price') || businessLower.includes('cost') || businessLower.includes('$') || businessLower.includes('rate')) {
    suggestions.push('What are your prices?');
  }
  if (businessLower.includes('support') || businessLower.includes('help') || businessLower.includes('24/7') || businessLower.includes('assistance')) {
    suggestions.push('How can I get support?');
  }
  if (businessLower.includes('contact') || businessLower.includes('email') || businessLower.includes('reach')) {
    suggestions.push('How do I contact you?');
  }
  if (suggestions.length < 4) suggestions.push('What services do you offer?');
  if (suggestions.length < 4) suggestions.push('What are your hours?');
  if (suggestions.length < 4) suggestions.push('How do I contact you?');
  if (suggestions.length < 4) suggestions.push('Tell me about your company');
  return suggestions.slice(0, 4);
};

export default generateSugesstions;
