/* ════════════════════════════════════════
   js/data.js
   앱 전체에서 사용하는 상수 & 정적 데이터 모음.
   generatePrompt(), rollRandomIdea() 등이 import하여 사용.
════════════════════════════════════════ */

/* ── 타겟 AI별 시스템 페르소나 문자열 ── */
export const AI_PERSONA = {
  antigravity: '너는 20년 차 시니어 풀스택 개발자이자 UI/UX 디자이너야. Antigravity AI를 활용한 바이브코딩 방식으로 아래 기획안을 구현해줘.',
  claude:      '너는 Claude야. 친절하고 정확하게 설명하는 시니어 개발자 역할을 맡아줘. 아래 기획안을 바탕으로 완성도 높은 코드를 작성해줘.',
  chatgpt:     '너는 ChatGPT야. 최고의 풀스택 개발자이자 UI/UX 전문가 역할을 해줘. 아래 기획안을 완벽하게 구현해줘.',
  gemini:      '너는 Gemini야. Google의 최신 AI로서 뛰어난 개발 실력을 발휘해줘. 아래 기획안을 바탕으로 최고의 코드를 작성해줘.',
  cursor:      '// Cursor AI에게 보내는 프롬프트\n// 아래 지시에 따라 완성도 높은 코드를 작성해줘.',
  universal:   '너는 최고의 시니어 풀스택 개발자이자 UI/UX 디자이너야. 아래 기획안을 바탕으로 완벽한 웹 서비스를 구현해줘.',
};

/* ── 디자인 컨셉 설명 텍스트 ── */
export const DESIGN_DESC = {
  modern:        '모던 & 미니멀 (화이트/소프트 그레이 기반, 깔끔한 카드 레이아웃, 세련된 타이포그래피)',
  dark:          '다크 모드 (#0f172a · #1e293b 배경, 형광 포인트 컬러, 눈이 편안한 대비)',
  glassmorphism: '글라스모피즘 (frosted glass 효과, backdrop-filter blur, 반투명 배경)',
  colorful:      '컬러풀 & 생동감 (선명한 그라디언트, 다양한 색상 팔레트, 활기찬 애니메이션)',
  corporate:     '비즈니스 & 전문적 (Navy/White 컬러, 명확한 정보 위계, 신뢰감 있는 레이아웃)',
  playful:       '귀엽고 유쾌함 (파스텔 컬러, 동글동글한 모서리, 이모지 & 일러스트 적극 활용)',
  retro:         '레트로 & 빈티지 (세피아/베이지 톤, 고전적 서체, 노이즈 텍스처, 복고풍 버튼)',
};

/* ── 디자인 컨셉별 기술 구현 지침 ── */
export const DESIGN_TECH = {
  modern:        'Tailwind의 white/slate 팔레트 활용. 모든 카드에 shadow-lg와 rounded-2xl 적용. Google Fonts에서 Inter 또는 Outfit import.',
  dark:          'Tailwind의 slate-900/slate-800 다크 배경에 blue-400/violet-400 포인트 적용. dark: prefix 클래스 활용.',
  glassmorphism: 'backdrop-filter: blur(20px)와 rgba 반투명 배경으로 glass 효과 구현. 그라디언트 배경 위에 glass 카드 배치.',
  colorful:      '선명한 linear-gradient를 버튼·헤더에 적극 활용. hover 시 색상 전환 애니메이션 추가.',
  corporate:     'IBM Plex Sans 폰트 사용. 주 색상 #003087 네이비. 버튼은 pill 형태로 제작.',
  playful:       'Nunito 폰트 사용. border-radius를 최대로. 🎉 이모지와 귀여운 아이콘을 UI 전면에 활용.',
  retro:         'Playfair Display 폰트 사용. CSS filter: sepia() 활용. 버튼에 3D 눌림 효과(box-shadow inset) 적용.',
};

/* ── 출력 모드별 [4. 구현 및 출력 지침] 텍스트 ── */
export const OUTPUT_GUIDE = {
  beginner:
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[4. 구현 및 출력 지침 — 🌱 초보자 모드]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
npm install이나 복잡한 빌드 환경(Node.js, Webpack 등)은 절대 사용하지 마.
Tailwind CSS 및 필요한 라이브러리는 모두 CDN으로 불러오고,
HTML/CSS/JS가 모두 포함된 브라우저 실행용 단일 파일(Single HTML)로만 코드를 작성해 줘.
✅ 단일 HTML 파일 하나로만 구성 (외부 파일 없음)
✅ Tailwind CSS는 CDN으로 불러오기
✅ 모든 JS 로직은 <script> 태그 안에 포함
✅ 복사 후 브라우저에서 즉시 실행 가능한 완성 코드
✅ 한국어 UI와 주석 사용
✅ 입력 유효성 검사(빈 칸 경고) 포함
✅ 성공/오류 피드백(Toast 알림) 제공
✅ 시각적으로 아름답고 프리미엄한 디자인 필수`,

  expert:
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[4. 구현 및 출력 지침 — 💻 전공자 모드]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
React 또는 Next.js 환경을 가정하고 코드를 작성해 줘.
코드를 단일 파일에 몰아넣지 말고, 재사용성을 고려해 컴포넌트를 모듈화
(예: /components, /utils)하여 실무 표준 폴더 구조로 분리해 줘.
상태 관리와 에러 핸들링을 포함한 클린 코드를 작성할 것.
✅ React 또는 Next.js 기반으로 구현
✅ /components, /utils 등 실무 폴더 구조로 모듈 분리
✅ 상태 관리(useState / useReducer 등) 적극 활용
✅ 에러 핸들링 및 로딩 상태 처리 포함
✅ 클린 코드 원칙 준수 (단일 책임, 명확한 네이밍)
✅ 한국어 주석 포함
✅ 시각적으로 아름답고 프리미엄한 디자인 필수`,
};

/* ── 랜덤 아이디어 룰렛 단어 배열 ── */
export const RANDOM_MODIFIERS = [
  '킹받는', '사이버펑크 스타일의', '고양이가 알려주는', '우주 최강',
  '결정장애를 위한', '잔소리해주는', '극강의 효율을 자랑하는', '레트로 감성의',
  '세상에서 제일 귀여운', 'AI가 대신 해주는', '나를 위한 맞춤형', '직장인 공감 100%',
  '오늘 하루를 구해줄', '지구 멸망 전에 써야 할',
];

export const RANDOM_TOPICS = [
  '다이어트 식단', '퇴근 시간', '오늘 점심 메뉴', '숨은 맛집',
  '로또 번호', '팩폭 명언', '나만의 일기장', '냉장고 파먹기',
  '여행 버킷리스트', '독서 기록', '수면 패턴', '가계부',
  '운동 루틴', '주식 포트폴리오', '영화 추천',
];

export const RANDOM_FORMATS = [
  '카운트다운 시계', '랜덤 룰렛 앱', '알림 서비스', '미니 커뮤니티',
  '원클릭 지도', '아카이브 웹사이트', '번역기', '분석 대시보드',
  '챌린지 트래커', '공유 캘린더', '인터랙티브 퀴즈', '랭킹 보드',
  '스트릭 관리 앱', '뉴스레터 생성기',
];
