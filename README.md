# 모임 (Moim) — 사내 동호회 운영 앱

동호회의 **예산·법인카드 사용·QR 출결·활동 보고서**를 한 흐름으로 관리하는 웹앱입니다.

- 기술: Next.js (App Router) · TypeScript · Tailwind CSS · Prisma
- 개발 DB: SQLite (파일 하나) → 운영 DB: PostgreSQL 로 전환 가능

---

## 비개발자용 로컬 실행법

> 컴퓨터에 **Node.js(버전 20 이상)** 가 설치되어 있어야 합니다.

### 1. 의존성 설치 (처음 한 번)

```bash
npm install
```

### 2. 환경변수 파일 만들기 (처음 한 번)

예시 파일을 복사해서 `.env.local` 을 만듭니다. (이미 있으면 건너뛰세요)

```bash
cp .env.example .env.local
```

> `.env.local` 안의 값은 비밀입니다. GitHub 에 올라가지 않도록 설정되어 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 <http://localhost:3000> 을 엽니다.

### 로그인

- **실제 로그인**: `/login` 에서 **초대코드 + 닉네임** 입력. (시드 초대코드:
  `RUN-2026-INTERNAL`)
- **개발용 빠른 로그인**: 개발 환경(`FEATURE_DEV_LOGIN=true`)에서는 `/login`
  하단의 역할 버튼으로 즉시 로그인하거나, 상단 바에서 역할을 전환할 수
  있습니다. (운영 환경에서는 자동으로 비활성화)

---

## 자주 쓰는 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 배포용 빌드(오류 없는지 검사) |
| `npm run lint` | 코드 스타일 검사 |
| `npm run typecheck` | 타입(자료형) 오류 검사 |
| `npm run test` | 자동 테스트 실행 |
| `npm run prisma:studio` | DB 내용을 표로 보기 |

---

## 폴더 구조 (요약)

```
app/            화면(페이지)
lib/            업무 로직(예산 계산 등) · 공용 함수
prisma/         데이터베이스 설계(schema.prisma)
tests/          자동 테스트
docs/           제품/DB/API/테스트/로드맵 문서
legacy/         이전에 있던 무관한 앱 보관(수정하지 않음)
```

---

## 문서

- [docs/PRD.md](docs/PRD.md) — 제품 요구사항
- [docs/DATABASE.md](docs/DATABASE.md) — 데이터 구조
- [docs/API.md](docs/API.md) — API/서버 동작
- [docs/TESTING.md](docs/TESTING.md) — 테스트 방법
- [docs/ROADMAP.md](docs/ROADMAP.md) — 구현 단계

---

## 안전 수칙

- `.env.local`, Slack Webhook URL, DB 비밀번호는 **절대 공유/커밋 금지**.
- 파일 삭제, DB 초기화, 강제 push 같은 위험한 작업은 실행 전 반드시 확인합니다.
