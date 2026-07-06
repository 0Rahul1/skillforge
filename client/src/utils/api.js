import axios from 'axios';

const API_BASE = '/api';

// Axios instance for non-streaming requests
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

/**
 * Stream chat completion using Server-Sent Events via fetch
 * @param {Array} messages - Array of { role, content } objects
 * @param {string} model - OpenAI model name
 * @param {function} onChunk - Callback for each streamed content chunk
 * @param {function} onDone - Callback when streaming is complete
 * @param {function} onError - Callback for errors
 * @param {AbortSignal} signal - AbortController signal for cancellation
 */
export const streamChat = async (messages, model, onChunk, onDone, onError, signal) => {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Server error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        try {
          const data = JSON.parse(trimmed.slice(6));

          if (data.error) {
            onError(new Error(data.error));
            return;
          }

          if (data.done) {
            onDone();
            return;
          }

          if (data.content) {
            onChunk(data.content);
          }
        } catch {
          // Skip malformed JSON lines
        }
      }
    }

    onDone();
  } catch (error) {
    if (error.name === 'AbortError') {
      onDone();
      return;
    }
    onError(error);
  }
};

/**
 * Generate a chat title from messages
 */
export const generateTitle = async (messages) => {
  try {
    const response = await api.post('/chat/title', { messages });
    return response.data.title;
  } catch {
    const firstMessage = messages.find((m) => m.role === 'user')?.content || 'New Chat';
    return firstMessage.substring(0, 50);
  }
};

export default api;
