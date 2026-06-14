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

## 2. 데이터베이스 스키마 생성 (Supabase)

이 프로젝트는 PostgreSQL 을 사용하며, 스키마는 `prisma db push` 로 적용합니다
(마이그레이션 파일 관리가 필요 없어 비개발자에게 간단).

1. Supabase 에서 프로젝트를 만들고 **연결 문자열(Connection string)** 을 복사.
   (Project Settings → Database → Connection string → URI)
2. 로컬에서 `.env.local` 의 `DATABASE_URL` 을 그 값으로 설정.
3. 스키마 생성:
   ```bash
   npx prisma db push
   ```
4. (선택) 데모 데이터: `npm run db:seed`

> 운영 첫 동호회는 시드 대신 직접 만들고 초대코드를 발급하는 것을 권장합니다.

## 3. Vercel 배포

1. Vercel 에서 GitHub 저장소를 import (브랜치 선택).
2. Environment Variables 에 1번 표의 값들을 입력:
   - `DATABASE_URL` (Supabase 연결 문자열)
   - `AUTH_SECRET` (무작위 긴 문자열)
   - `NEXT_PUBLIC_APP_URL` (배포 도메인)
   - `FEATURE_DEV_LOGIN=false`
   - (선택) `SLACK_WEBHOOK_URL`
3. Build Command 는 기본값(`next build`). 설치 시 `prisma generate` 가
   `postinstall` 로 자동 실행됩니다.
4. 스키마는 2번에서 `prisma db push` 로 이미 Supabase 에 생성되어 있으므로
   배포만 하면 됩니다. (스키마를 바꾸면 다시 `prisma db push` 실행)

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
