# 테스트 방법

## 자동 검증 4종 (매 단계 필수)

```bash
npm run lint       # 코드 스타일 검사
npm run typecheck  # 타입(자료형) 검사
npm run test       # 자동 테스트 (Vitest)
npm run build      # 배포용 빌드 검사
```

## 테스트 위치

- 단위 테스트: `tests/**/*.test.ts`, `lib/**/*.test.ts`
- 도구: [Vitest](https://vitest.dev)

## 우선 보호 대상 (가장 중요한 테스트)

예산 계산은 돈과 직결되므로 반드시 테스트로 보호한다.

- 반기 구분(1~6월 / 7~12월)
- 활동 회원 수 × 50,000원
- inactive/left 회원 제외
- 반기 누적 지원금 / 사용금액 / 잔여 / 소멸 예정액

## 비개발자 수동 테스트

브라우저에서 직접 눌러 확인하는 시나리오는 작업 패키지의
`06_MANUAL_TEST_SCRIPT.md` 를 따른다. (기능 구현 후 이 문서에 반영 예정)
