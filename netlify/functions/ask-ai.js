// netlify/functions/ask-ai.js
import { GoogleGenAI } from '@google/genai';

export const handler = async (event) => {
  // POST 요청이 아니면 차단합니다.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // 1. 프론트엔드에서 보낸 질문 받기
    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '질문을 입력해 주세요.' }),
      };
    }

    // 2. Netlify 환경변수에 등록한 API 키 가져오기
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: '서버에 API 키가 설정되지 않았습니다.' }),
      };
    }

    // 3. 최신 구글 GenAI 인스턴스 초기화
    const ai = new GoogleGenAI({ apiKey });

    // 4. Gemini 2.5 Flash 모델에 질문 던지기
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // 5. 답변 반환하기
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: response.text }),
    };

  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'AI 답변을 생성하는 중 에러가 발생했습니다.', details: error.message }),
    };
  }
};
