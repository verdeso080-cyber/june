# 배포 가이드 (DEPLOYMENT)

비개발자도 따라 할 수 있도록 단계별로 정리했습니다. (운영 DB 는 PostgreSQL,
호스팅은 Vercel 기준 예시)

## 0. 준비물

- GitHub 저장소 (이미 있음)
- PostgreSQL DB (예: Supabase, Neon, RDS 등)
- Slack Incoming Webhook URL (선택)
- Vercel 계정 (또는 Node 서버)

## 1. 환경변수

`.env.example` 를 참고해 운영 환경에 아래 값을 설정합니다.
(실제 값은 절대 Git 에 올리지 않습니다.)

| 변수 | 설명 |
| --- | --- |
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `NEXT_PUBLIC_APP_URL` | 배포 도메인 (예: https://moim.example.com) |
| `AUTH_SECRET` | 세션 서명용 무작위 긴 문자열 (필수 변경) |
| `FEATURE_DEV_LOGIN` | 운영에서는 `false` (개발용 로그인 차단) |
| `SLACK_WEBHOOK_URL` | Slack 알림용 (선택, 비밀) |
| `STORAGE_PROVIDER` | `local` (기본) — 운영은 외부 스토리지 권장 |

> `AUTH_SECRET` 무작위 값 만들기: 터미널에서
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## 2. 데이터베이스 스키마 생성 (Supabase SQL Editor)

가장 확실한 방법은 Supabase 의 **SQL Editor** 에서 `supabase-init.sql` 을 한 번
실행하는 것입니다. (스키마 + 데모 데이터가 한 번에 생성됩니다. Vercel 빌드
중 `prisma db push` 가 풀러와 충돌해 멈추는 문제를 피합니다.)

1. Supabase → 좌측 **SQL Editor** → **New query**
2. 저장소의 `supabase-init.sql` 내용을 전체 복사해 붙여넣기
3. **Run** → 테이블 20개 + 데모 데이터 생성 완료

> 데모 데이터 없이 시작하려면 `supabase-init.sql` 대신 스키마만 적용하세요:
> 로컬에서 `DATABASE_URL` 을 Supabase 로 설정 후 `npx prisma db push`.
> 스키마를 바꾸면 다시 `prisma db push`(로컬) 또는 SQL Editor 로 반영합니다.

### 연결 문자열 (DATABASE_URL) — 중요
Vercel 에서는 **Session pooler** 주소를 쓰세요 (호스트에 `pooler.supabase.com`
포함, 포트 `5432`). `db.xxxx.supabase.co` (Direct) 주소는 Vercel 에서 연결이
안 됩니다(IPv6). 비밀번호에 특수문자가 있으면 오류가 날 수 있으니 영문+숫자
권장.

## 3. Vercel 배포

1. Vercel 에서 GitHub 저장소를 import (브랜치 선택).
2. Environment Variables 에 1번 표의 값들을 입력:
   - `DATABASE_URL` (Supabase 연결 문자열)
   - `AUTH_SECRET` (무작위 긴 문자열)
   - `NEXT_PUBLIC_APP_URL` (배포 도메인)
   - `FEATURE_DEV_LOGIN=false`
   - (선택) `SLACK_WEBHOOK_URL`
3. 배포 시 `vercel-build` 스크립트가 자동으로 `prisma db push` 를 실행해
   Supabase 에 스키마를 생성/동기화합니다. (별도 명령 불필요)
4. 첫 배포가 끝나면 도메인으로 접속 → `/login` 에서 초대코드로 입장.

> 참고: 2번의 로컬 `prisma db push` 는 건너뛰어도 됩니다. Vercel 배포 시
> 자동 적용되기 때문입니다. (로컬에서 미리 테스트하고 싶을 때만 실행)

## 5. 업로드 파일(사진) 주의

현재 사진은 로컬 `public/uploads` 에 저장됩니다. Vercel 같은 서버리스
환경에서는 재배포 시 사라집니다. 운영에서는 `lib/storage.ts` 의
`saveUpload` 를 외부 스토리지(S3, Supabase Storage 등)로 교체하세요.
함수 한 곳만 바꾸면 되도록 분리되어 있습니다.

## 6. 배포 전 체크리스트

- [ ] `FEATURE_DEV_LOGIN=false` (운영)
- [ ] `AUTH_SECRET` 무작위 값으로 변경
- [ ] `.env` / `.env.local` 이 Git 에 없음 (`.env.example` 만 추적)
- [ ] `SLACK_WEBHOOK_URL` 은 환경변수로만 설정 (코드/화면 노출 없음)
- [ ] `npm run lint && npm run typecheck && npm run test && npm run build` 통과
