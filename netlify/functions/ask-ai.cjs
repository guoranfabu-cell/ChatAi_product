// netlify/functions/ask-ai.cjs
const { GoogleGenAI } = require('@google/genai');

exports.handler = async (event) => {
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
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: '🚨 환경 변수설정에 GEMINI_API_KEY가 존재하지 않습니다.' }),
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const replyText = response.text || '답변을 받아왔으나 비어있습니다.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: replyText }),
    };

  } catch (error) {
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
