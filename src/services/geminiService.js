class GeminiService {
  constructor() {
    this.lastRequestTime = 0;
    this.minInterval = 500;
    this.retryAttempts = 3;
    this.backendUrl = '/api';
  }

  async generateContent(prompt, retryCount = 0) {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();

    try {
      const response = await fetch(`${this.backendUrl}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error || `API error: ${response.status}`;

        if (response.status === 429 && retryCount < this.retryAttempts) {
          const delay = Math.pow(2, retryCount) * 2000;
          console.warn(`Rate limited. Retrying in ${delay}ms (attempt ${retryCount + 1}/${this.retryAttempts})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.generateContent(prompt, retryCount + 1);
        }

        if (response.status === 503) {
          throw new Error('AI service is not configured yet. Please set the Gemini API key on the server.');
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to the Paltoo server. Make sure the backend is running (npm run server).');
      }
      throw error;
    }
  }

  async generateJSON(prompt) {
    const text = await this.generateContent(prompt);

    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    } else {
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonStr = text.slice(firstBrace, lastBrace + 1);
      }
    }

    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const keys = Object.keys(parsed);
        if (keys.length === 1 && parsed[keys[0]] && typeof parsed[keys[0]] === 'object' && !Array.isArray(parsed[keys[0]])) {
          return parsed[keys[0]];
        }
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse JSON response:', jsonStr);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  }

  async chat(prompt) {
    return this.generateContent(prompt);
  }

  async checkHealth() {
    try {
      const res = await fetch(`${this.backendUrl}/health`);
      return await res.json();
    } catch {
      return { status: 'error', hasKey: false };
    }
  }
}

export const geminiService = new GeminiService();
