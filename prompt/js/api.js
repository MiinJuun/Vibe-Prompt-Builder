/* ════════════════════════════════════════
   js/api.js
   외부 API(OpenAI / Google Gemini)와의
   비동기 fetch 통신을 전담하는 모듈.
════════════════════════════════════════ */

/* ── 공통: AI에게 보낼 기능 추천 프롬프트 문자열 생성 ── */
function buildSuggestPrompt(title, projectType) {
  return `내가 만들 프로젝트는 ${projectType} 형태의 '${title}'이야. 이 서비스에 반드시 필요한 핵심 기능 5가지를 개조식(명사형 종결)으로 아주 짧고 명확하게 작성해 줘.

[작성 규칙]
- 반드시 예시와 같은 단답형 명사로 작성할 것 (예: - 카카오톡 간편 로그인, - 릴스 URL 분석 및 추출, - 맛집 지도 마커 표시)
- 절대 서술형 문장(십니다, 할 수 있다, 하는 기능)으로 설명하지 말 것.
- 부연 설명 없이 답 기능 5가지만 출력할 것.`;
}

/**
 * OpenAI (gpt-4o-mini) API를 호출하여 핵심 기능 5가지를 추천받는다.
 * @param {string} apiKey  - OpenAI API 키 (sk-...)
 * @param {string} title   - 프로젝트 주제
 * @param {string} projectType - 프로젝트 유형
 * @returns {Promise<string>} - AI가 생성한 기능 목록 텍스트
 */
export async function fetchOpenAI(apiKey, title, projectType) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 800,
      messages: [
        { role: 'user', content: buildSuggestPrompt(title, projectType) },
      ],
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('응답이 비어있습니다.');
  return content;
}

/**
 * Google Gemini (gemini-2.5-flash) API를 호출하여 핵심 기능 5가지를 추천받는다.
 * @param {string} apiKey  - Gemini API 키 (AIza... 또는 AQ...)
 * @param {string} title   - 프로젝트 주제
 * @param {string} projectType - 프로젝트 유형
 * @returns {Promise<string>} - AI가 생성한 기능 목록 텍스트
 */
export async function fetchGemini(apiKey, title, projectType) {
  const geminiUrl =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: buildSuggestPrompt(title, projectType) }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!content) throw new Error('응답이 비어있습니다.');
  return content;
}
