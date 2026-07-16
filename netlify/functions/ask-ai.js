// netlify/functions/ask-ai.js
import { GoogleGenAI } from '@google/genai';

export const handler = async (event) => {
  // CORS 처리 및 POST 요청만 허용
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: '허용되지 않는 요청 방식입니다.' }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: '질문을 입력해 주세요.' }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200, // 502로 죽지 않도록 200을 주고 메시지를 프론트에 넘깁니다.
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: '🚨 환경 변수설정에 GEMINI_API_KEY가 존재하지 않습니다.' }),
      };
    }

    // 최신 SDK 초기화
    const ai = new GoogleGenAI({ apiKey });

    // API 호출
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // 안전하게 답변 문자열 추출
    const replyText = response.text || '답변을 받아왔으나 비어있습니다.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: replyText }),
    };

  } catch (error) {
    // 에러 발생 시 서버가 죽어 502를 내지 않도록, 에러 원인을 JSON에 담아 정상(200) 응답으로 보냅니다.
    console.error('서버 에러 디버깅:', error);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        reply: `🚨 AI 호출 실패! 원인: ${error.message || '알 수 없는 서버 에러'}` 
      }),
    };
  }
};
