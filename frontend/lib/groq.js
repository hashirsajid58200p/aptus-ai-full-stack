import baseurl from '../store/baseurl';

/**
 * Generate chatbot response via backend
 */
export async function generateContent(prompt, options = {}) {
  try {
    const isChatbotSession = options.session_id && options.chatbot_id;
    const endpoint = isChatbotSession ? 'getResponse' : 'generate';

    const response = await fetch(`${baseurl}/chatbot/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
      body: JSON.stringify({
        message: options.message || prompt,
        prompt: prompt,
        messages: options.messages || [],
        session_id: options.session_id,
        chatbot_id: options.chatbot_id,
        _t: Date.now(),
      }),
    });

    const data = await response.json();
    if (data.success) return data.data;
    throw new Error(data.message || 'Backend error');
  } catch (error) {
    console.error('API Error:', error);
    return "Sorry, I'm unable to respond right now. Please try again later.";
  }
}


/**
 * Generate JSON content
 */
export async function generateJSONContent(prompt, options = {}) {
  try {
    const response = await generateContent(prompt, options);
    const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } 
      catch (e) { return response; }
    }
    return response;
  } catch (error) {
    console.error('JSON Generation Error:', error);
    throw error;
  }
}

