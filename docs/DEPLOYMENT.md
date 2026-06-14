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

## 2. SQLite → PostgreSQL 전환

1. `prisma/schema.prisma` 의 `datasource db` 에서
   `provider = "sqlite"` 를 `provider = "postgresql"` 로 변경.
2. `DATABASE_URL` 을 PostgreSQL 주소로 설정.
3. 마이그레이션 적용:
   ```bash
   npx prisma migrate deploy
   ```
   (SQLite 전용 기능을 쓰지 않으므로 스키마는 그대로 호환됩니다.)

> 주의: 개발용 SQLite 의 `prisma/migrations` 는 SQLite 기준으로 생성된
> 파일입니다. PostgreSQL 로 처음 전환할 때 마이그레이션 충돌이 나면,
> 새 DB 에 한해 `prisma migrate reset` 후 `migrate dev` 로 재생성할 수
> 있습니다. (운영 데이터가 있는 DB 에서는 절대 reset 하지 마세요.)

## 3. 시드(선택, 데모용)

```bash
npm run db:seed
```

운영 첫 동호회는 시드 대신 직접 만들고, 초대코드를 발급해 배포하는 것을
권장합니다.

## 4. Vercel 배포

1. Vercel 에서 GitHub 저장소를 import.
2. Environment Variables 에 위 1번 값들을 입력 (`FEATURE_DEV_LOGIN=false`).
3. Build Command 는 기본값(`next build`), Install 시 `prisma generate` 가
   `postinstall` 로 자동 실행됩니다.
4. 첫 배포 후 한 번 `prisma migrate deploy` 를 실행 (Vercel 의 배포 훅 또는
   로컬에서 운영 `DATABASE_URL` 로 실행).

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
