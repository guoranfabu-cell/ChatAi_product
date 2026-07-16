import { useState } from 'react';

const suggestedPrompts = [
  '오늘 기분을 환기할 작은 계획을 알려줘',
  '오늘의 날씨는?',
  '집에서 만들 수 있는 시원한 음료는?',
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const question = prompt.trim();
    if (!question || loading) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/.netlify/functions/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question }),
      });
      const data = await res.json();
      setResponse(data.reply || data.text || data.error || '답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.');
    } catch {
      setResponse('서버에 연결하지 못했어요. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const choosePrompt = (text) => setPrompt(text);

  return (
    <main className="ocean-page">
      <div className="sun-glow" aria-hidden="true" />
      <div className="sea-shape sea-shape-one" aria-hidden="true" />
      <div className="sea-shape sea-shape-two" aria-hidden="true" />

      <section className="app-shell" aria-labelledby="page-title">
        <header className="topbar">
          <a className="brand" href="/" aria-label="푸른쉼 AI 홈">
            <span className="brand-mark" aria-hidden="true">⌇</span>
            <span>푸른쉼 <em>AI</em></span>
          </a>
          <span className="status"><i /> 바다처럼 차분한 대화</span>
        </header>

        <div className="hero">
          <p className="eyebrow">A GENTLE TIDE OF IDEAS</p>
          <h1 id="page-title">당신의 생각에<br /><span>푸른 숨</span>을 더해요.</h1>
          <p className="intro">궁금한 것, 막막한 것, 오늘의 작은 고민까지.<br />시원하고 다정한 AI와 편안하게 이야기해 보세요.</p>
        </div>

        <section className="chat-card" aria-label="AI에게 질문하기">
          <div className="card-heading">
            <div className="avatar" aria-hidden="true">✦</div>
            <div>
              <p>푸른쉼 어시스턴트</p>
              <span>무엇이든 함께 생각해 볼게요</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="prompt-form">
            <label className="sr-only" htmlFor="prompt">AI에게 질문하기</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="오늘은 어떤 이야기를 나눠 볼까요?"
              rows="3"
            />
            <button type="submit" disabled={loading || !prompt.trim()}>
              <span>{loading ? '생각하는 중' : '보내기'}</span>
              <b aria-hidden="true">{loading ? '···' : '↑'}</b>
            </button>
          </form>

          {response && (
            <article className="answer" aria-live="polite">
              <span className="answer-icon" aria-hidden="true">✦</span>
              <p>{response}</p>
            </article>
          )}

          <div className="suggestions" aria-label="추천 질문">
            <span>이런 이야기는 어때요?</span>
            <div>
              {suggestedPrompts.map((item) => (
                <button type="button" onClick={() => choosePrompt(item)} key={item}>{item}</button>
              ))}
            </div>
          </div>
        </section>

        <footer>천천히, 당신의 속도에 맞춰 함께합니다 <span>~</span></footer>
      </section>
    </main>
  );
}

export default App;
