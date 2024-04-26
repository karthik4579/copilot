import Groq from "groq-sdk";

const client = new Groq({
  dangerouslyAllowBrowser:true,
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export default client;