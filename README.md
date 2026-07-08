#  Vibe Prompt Builder (AI 프롬프트 자동 조립기)

> **키워드만 넣으면 전문가급 프롬프트가 완성되는 매직 툴**

바이브코딩(Vibe Coding) 시대, 코딩 지식이 없는 기획자부터 보일러플레이트 세팅을 자동화하고 싶은 전공자까지 모두가 완벽한 코드를 얻어낼 수 있도록 돕는 **'서버리스 웹 서비스'**입니다. 

단 한 줄의 아이디어만 입력하면, AI가 핵심 기능을 기획하고 20년 차 시니어 개발자 페르소나의 완벽한 프롬프트로 즉시 조립해 줍니다.

---

##  주요 기능 (Key Features)

* **AI 핵심 기능 자동 기획:** 프로젝트 주제를 입력하면 Gemini API(`gemini-2.5-flash`)가 필수 핵심 기능 5가지를 명사형 개조식으로 자동 추천합니다.
* **🎲 단어 조합형 랜덤 룰렛:** 어떤 프로젝트를 만들지 고민될 때, 주사위 버튼을 누르면 기상천외한 아이디어가 무작위로 생성됩니다.
* **🎛️ 맞춤형 출력 모드 지원:** 사용자의 숙련도에 따라 `🌱 초보자 모드(단일 HTML 완성형)`와 `💻 전공자 모드(React 등 컴포넌트 모듈화)`를 선택해 최적화된 프롬프트를 뽑아낼 수 있습니다.
* **스마트 API 라우팅:** 사용자가 입력한 API 키(`sk-...` 또는 `AIza...`/`AQ.`)를 자동 인식하여 OpenAI 또는 Gemini API로 알아서 연결합니다.
* **완벽한 보안 & 접근성:** 사용자의 API 키는 브라우저 로컬 스토리지(`localStorage`)에만 안전하게 보관되며, 외부 서버로 절대 유출되지 않습니다.

---

##  기술 스택 (Tech Stack)

실무 표준에 맞추어 기능별로 안전하게 파일 구조를 분리한 **모듈형(ES Modules) 프론트엔드 아키텍처**를 적용했습니다.

* **Frontend:** HTML5, Vanilla JavaScript (ES2022+, ES Modules)
* **Styling:** Tailwind CSS (CDN), Custom Vanilla CSS (Glassmorphism UI)
* **External API:** Google Gemini API (`gemini-2.5-flash`), OpenAI API (`gpt-4o-mini`)
* **Storage:** Web Storage API (`localStorage`)

---

##  실행 방법 (Getting Started)

본 프로젝트는 자바스크립트 모듈(`type="module"`)을 사용하므로 브라우저 보안 정책(CORS)에 따라 **반드시 로컬 웹 서버 환경에서 실행**해야 합니다.

### 방법 1. Python 로컬 서버로 실행하기
1. 저장소를 클론(`git clone`)하거나 다운로드하여 압축을 풉니다.
2. 해당 프로젝트 폴더에서 터미널을 열고 아래 명령어를 입력합니다.
   ```bash
   python -m http.server 8000
   # (또는 Mac 환경의 경우: python3 -m http.server 8000)

 ---

## 개발자 정보

| 항목 | 내용 |
| :--- | :--- |
| **이름** | 박민준 |
| **전공** | 컴퓨터공학전공 |
| **학번** | 22211988 |
| **이메일** | akio7689@naver.com |
