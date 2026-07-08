/* ════════════════════════════════════════
   js/main.js
   앱의 메인 컨트롤러.
   data.js와 api.js를 import하여
   DOM 이벤트 바인딩 · 비즈니스 로직 · UI 업데이트를 담당.
════════════════════════════════════════ */

import {
  AI_PERSONA,
  DESIGN_DESC,
  DESIGN_TECH,
  OUTPUT_GUIDE,
  RANDOM_MODIFIERS,
  RANDOM_TOPICS,
  RANDOM_FORMATS,
} from './data.js';

import { fetchOpenAI, fetchGemini } from './api.js';

/* ════════════════════════════════════════
   DOM 캐싱 — 자주 쓰는 요소를 한 번만 조회
════════════════════════════════════════ */
const $ = (id) => document.getElementById(id);

const elProjectTitle  = $('projectTitle');
const elProjectType   = $('projectType');
const elCoreFeatures  = $('coreFeatures');
const elDesignConcept = $('designConcept');
const elTargetAI      = $('targetAI');
const elOutputMode    = $('outputMode');
const elExtraContext  = $('extraContext');
const elApiKey        = $('apiKey');
const elKeySavedBadge = $('keySavedBadge');
const elGenerateBtn   = $('generateBtn');
const elSuggestBtn    = $('suggestBtn');
const elDiceBtn       = $('diceBtn');
const elResultBox     = $('resultBox');
const elResultBoxWrap = $('resultBoxWrap');
const elPlaceholder   = $('placeholder');
const elCharCount     = $('charCount');
const elCopyBtn       = $('copyBtn');
const elCopyIcon      = $('copyIcon');
const elCopyText      = $('copyText');
const elDownloadBtn   = $('downloadBtn');
const elTipsBox       = $('tipsBox');
const elToast         = $('toast');
const elToastMsg      = $('toastMsg');

/* ════════════════════════════════════════
   TOAST 알림
════════════════════════════════════════ */
let toastTimer;

function showToast(msg, type = 'success') {
  const colors = {
    success: 'linear-gradient(135deg,#16a34a,#22c55e)',
    warning: 'linear-gradient(135deg,#d97706,#f59e0b)',
    info:    'linear-gradient(135deg,#2563eb,#60a5fa)',
  };
  elToast.style.background = colors[type] || colors.success;
  elToastMsg.textContent = msg;
  elToast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elToast.classList.remove('show'), 2800);
}

/* ════════════════════════════════════════
   유효성 검사 UI — 에러 필드 흔들기
════════════════════════════════════════ */
function markError(el) {
  el.classList.add('error');
  el.style.animation = 'none';
  requestAnimationFrame(() => {
    el.style.animation = 'shake 0.4s ease';
  });
  el.addEventListener('input', () => {
    el.classList.remove('error');
    el.style.animation = '';
  }, { once: true });
}

/* ════════════════════════════════════════
   로컬스토리지 — API 키 저장 / 불러오기
════════════════════════════════════════ */
function saveApiKey() {
  const key = elApiKey.value.trim();
  if (key) {
    localStorage.setItem('vibe_openai_key', key);
    elKeySavedBadge.classList.add('show');
    setTimeout(() => elKeySavedBadge.classList.remove('show'), 2000);
  } else {
    localStorage.removeItem('vibe_openai_key');
  }
}

function loadApiKey() {
  const saved = localStorage.getItem('vibe_openai_key');
  if (saved) {
    elApiKey.value = saved;
    elKeySavedBadge.classList.add('show');
    setTimeout(() => elKeySavedBadge.classList.remove('show'), 1800);
  }
}

/* ════════════════════════════════════════
   프롬프트 생성
════════════════════════════════════════ */
function generatePrompt() {
  const title       = elProjectTitle.value.trim();
  const projectType = elProjectType.value;
  const feats       = elCoreFeatures.value.trim();
  const design      = elDesignConcept.value;
  const ai          = elTargetAI.value;
  const outputMode  = elOutputMode.value;
  const extra       = elExtraContext.value.trim();

  /* 필수값 검사 */
  let hasError = false;
  if (!title) { markError(elProjectTitle); hasError = true; }
  if (!feats)  { markError(elCoreFeatures);  hasError = true; }
  if (hasError) {
    showToast('⚠️ 필수 항목을 입력해 주세요!', 'warning');
    return;
  }

  /* 기능 목록 포맷팅 */
  const featureList = feats
    .split(/[\n,]+/)
    .map(f => f.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)
    .map(f => `  - ${f}`)
    .join('\n');

  const extraSection = extra
    ? `\n[5. 추가 요청 사항]\n${extra}\n`
    : '';

  /* 출력 모드에 따른 지침 선택 (data.js의 OUTPUT_GUIDE 사용) */
  const outputGuide = OUTPUT_GUIDE[outputMode] ?? OUTPUT_GUIDE.beginner;

  /* 프롬프트 조립 */
  const prompt =
`${AI_PERSONA[ai]}

아래 기획안을 바탕으로 웹 서비스를 완벽하게 구현해 줘.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[1. 프로젝트 개요]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
주제: ${title}
프로젝트 유형: ${projectType}
목표: 코딩 지식 없는 사용자도 즉시 쓸 수 있도록 직관적이고 완성도 높게 구현한다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[2. 핵심 기능 목록 (모두 구현 필수)]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${featureList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[3. 디자인 & UI 지침]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
컨셉: ${DESIGN_DESC[design]}
기술 구현: ${DESIGN_TECH[design]}
레이아웃:
  - PC(768px 이상): 좌우 2분할 또는 카드 그리드 구조
  - 모바일: 세로 스택 반응형 완벽 지원
공통 규칙:
  - Google Fonts에서 어울리는 폰트 import
  - CSS transitions·hover 효과로 생동감 부여
  - 부드러운 둥근 모서리(border-radius) 적용
  - 빈 상태(empty state) UI도 예쁘게 처리${extraSection}
${outputGuide}`;

  /* 결과 렌더링 */
  elResultBox.value = prompt;
  elResultBoxWrap.style.display = 'block';
  elResultBoxWrap.style.height  = '100%';
  elPlaceholder.style.display   = 'none';

  elCharCount.textContent      = `${prompt.length.toLocaleString()} 자`;
  elCopyBtn.disabled           = false;
  elDownloadBtn.disabled       = false;
  elTipsBox.classList.remove('hidden');

  /* 애니메이션 */
  elResultBox.classList.add('animate-fade-in');
  setTimeout(() => elResultBox.classList.remove('animate-fade-in'), 500);

  elGenerateBtn.classList.add('animate-pulse-once');
  setTimeout(() => elGenerateBtn.classList.remove('animate-pulse-once'), 600);

  showToast('✅ 프롬프트가 완성되었습니다!', 'success');

  /* 모바일: 결과 패널로 스크롤 */
  if (window.innerWidth < 1024) {
    $('resultArea').closest('section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ════════════════════════════════════════
   클립보드 복사
════════════════════════════════════════ */
function copyToClipboard() {
  const text = elResultBox.value;
  if (!text) return;

  const fallback = () => {
    elResultBox.select();
    document.execCommand('copy');
    setCopied();
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(setCopied).catch(fallback);
  } else {
    fallback();
  }
}

function setCopied() {
  elCopyBtn.classList.add('copied');
  elCopyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>';
  elCopyText.textContent = '복사 완료! 🎉';
  showToast('📋 클립보드에 복사되었습니다!', 'success');

  setTimeout(() => {
    elCopyBtn.classList.remove('copied');
    elCopyIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>';
    elCopyText.textContent = '클립보드 복사';
  }, 2500);
}

/* ════════════════════════════════════════
   텍스트 파일 다운로드
════════════════════════════════════════ */
function downloadPrompt() {
  const text = elResultBox.value;
  if (!text) return;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'vibe_prompt.txt' });
  a.click();
  URL.revokeObjectURL(url);
  showToast('💾 파일이 저장되었습니다!', 'success');
}

/* ════════════════════════════════════════
   전체 초기화
════════════════════════════════════════ */
function resetAll() {
  [elProjectTitle, elCoreFeatures, elExtraContext].forEach(el => {
    el.value = '';
    el.classList.remove('error');
    el.style.animation = '';
  });
  elProjectType.selectedIndex   = 0;
  elDesignConcept.selectedIndex = 0;
  elTargetAI.selectedIndex      = 0;
  elOutputMode.selectedIndex    = 0;

  elResultBox.value            = '';
  elResultBoxWrap.style.display = 'none';
  elPlaceholder.style.display  = '';
  elCopyBtn.disabled           = true;
  elDownloadBtn.disabled       = true;
  elCharCount.textContent      = '';
  elTipsBox.classList.add('hidden');
  showToast('🔄 초기화되었습니다.', 'info');
}

/* ════════════════════════════════════════
   🎲 랜덤 아이디어 룰렛
════════════════════════════════════════ */
function rollRandomIdea() {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const idea = `${pick(RANDOM_MODIFIERS)} ${pick(RANDOM_TOPICS)} ${pick(RANDOM_FORMATS)}`;

  elProjectTitle.value = idea;
  elProjectTitle.classList.remove('error');

  /* 주사위 버튼 롤링 애니메이션 */
  elDiceBtn.classList.remove('rolling');
  void elDiceBtn.offsetWidth; /* reflow — 애니메이션 재트리거 */
  elDiceBtn.classList.add('rolling');
  elDiceBtn.addEventListener('animationend', () => elDiceBtn.classList.remove('rolling'), { once: true });

  /* 포커스 후 커서를 끝으로 */
  elProjectTitle.focus();
  elProjectTitle.setSelectionRange(idea.length, idea.length);

  showToast('🎲 랜덤 아이디어가 추천되었습니다!', 'info');
}

/* ════════════════════════════════════════
   ✨ AI 기능 추천 (OpenAI / Gemini 자동 감지)
════════════════════════════════════════ */
async function suggestFeatures() {
  const apiKey     = (elApiKey.value.trim() || localStorage.getItem('vibe_openai_key') || '').trim();
  const title      = elProjectTitle.value.trim();
  const projectType = elProjectType.value;

  /* 가드: API 키 없음 */
  if (!apiKey) {
    markError(elApiKey);
    showToast('🔑 API Key를 먼저 입력해 주세요!', 'warning');
    elApiKey.focus();
    return;
  }

  /* 가드: 주제 없음 */
  if (!title) {
    markError(elProjectTitle);
    showToast('⚠️ 프로젝트 주제를 먼저 입력해 주세요!', 'warning');
    elProjectTitle.focus();
    return;
  }

  /* API 키 타입 감지 */
  const isOpenAI = apiKey.startsWith('sk-');
  const isGemini = apiKey.startsWith('AIza') || apiKey.startsWith('AQ.');

  if (!isOpenAI && !isGemini) {
    markError(elApiKey);
    showToast('⚠️ 올바른 OpenAI(sk-...) 또는 Gemini(AIza... 또는 AQ...) API 키를 입력해 주세요!', 'warning');
    elApiKey.focus();
    return;
  }

  /* 로딩 상태 */
  const provider = isOpenAI ? 'OpenAI' : 'Gemini';
  elSuggestBtn.disabled  = true;
  elSuggestBtn.innerHTML = `<span class="spinner"></span><span>${provider} AI가 기능을 기획하고 있습니다...</span>`;

  try {
    /* api.js의 함수를 분기하여 호출 */
    const content = isOpenAI
      ? await fetchOpenAI(apiKey, title, projectType)
      : await fetchGemini(apiKey, title, projectType);

    /* 결과를 textarea에 채우기 */
    elCoreFeatures.value = content.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    elCoreFeatures.classList.add('animate-fade-in');
    setTimeout(() => elCoreFeatures.classList.remove('animate-fade-in'), 500);

    showToast(`🎉 ${provider} AI가 핵심 기능을 추천해 드렸습니다!`, 'success');

  } catch (err) {
    console.error('[AI Suggest]', err);
    const msg = err.message;
    const friendly =
      msg.includes('401') || msg.includes('API_KEY_INVALID')
        ? '❌ API Key가 올바르지 않습니다.'
        : msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')
          ? '⚡ 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.'
          : `❌ 오류: ${msg}`;
    showToast(friendly, 'warning');

  } finally {
    elSuggestBtn.disabled  = false;
    elSuggestBtn.innerHTML = '<span class="sparkle-icon text-base">✨</span><span id="suggestBtnText">AI에게 핵심 기능 추천받기</span>';
  }
}

/* ════════════════════════════════════════
   이벤트 리스너 바인딩
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* 로컬스토리지에서 API 키 복원 */
  loadApiKey();

  /* API 키 입력 시 자동 저장 */
  elApiKey.addEventListener('input', saveApiKey);

  /* 프로젝트 주제 Enter → 핵심 기능으로 포커스 이동 */
  elProjectTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      elCoreFeatures.focus();
    }
  });

  /* 프롬프트 생성 버튼 */
  elGenerateBtn.addEventListener('click', generatePrompt);

  /* AI 기능 추천 버튼 */
  elSuggestBtn.addEventListener('click', suggestFeatures);

  /* 주사위 버튼 */
  elDiceBtn.addEventListener('click', rollRandomIdea);

  /* 클립보드 복사 버튼 */
  elCopyBtn.addEventListener('click', copyToClipboard);

  /* 파일 저장 버튼 */
  elDownloadBtn.addEventListener('click', downloadPrompt);

  /* 초기화 버튼 — HTML의 onclick 속성 대신 JS에서 바인딩 */
  document.querySelector('[data-action="reset"]').addEventListener('click', resetAll);
});
