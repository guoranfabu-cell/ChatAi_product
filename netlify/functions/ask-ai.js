// netlify/functions/ask-ai.js
import { GoogleGenAI } from '@google/genai';

export async function handler(event, context) {
  // CORS 처리 및 POST 요청 체크
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    
    // Netlify 환경변수에 숨겨둔 API 키를 가져옵니다. (코드에 직접 하드코딩하지 않습니다!)
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });

    // Gemini 모델 호출
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: response.text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}