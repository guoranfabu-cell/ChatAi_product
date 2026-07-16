// src/App.jsx
import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    setResponse('');

    try {
      // 내 서버의 netlify function 주소로 질문을 보냅니다.
      const res = await fetch('/.netlify/functions/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.text) {
        setResponse(data.text);
      } else {
        setResponse('오류가 발생했습니다: ' + (data.error || '알 수 없는 에러'));
      }
    } catch (err) {
      setResponse('서버 연결 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>🤖 나의 React AI 비서</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="무엇이든 물어보세요..."
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          {loading ? '생각 중...' : '보내기'}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <strong>AI 답변:</strong>
          <p style={{ whiteSpace: 'pre-line', marginTop: '10px' }}>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;