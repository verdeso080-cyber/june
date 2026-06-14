# 데이터 구조 (DATABASE)

> 현재(1단계)는 토대 검증용 `AppMeta` 모델만 존재합니다.
> 아래는 2단계에서 추가할 **계획된 엔티티** 목록입니다.

## 계획된 엔티티

| 엔티티 | 설명 |
| --- | --- |
| User | 사용자(로그인 주체) |
| Club | 동호회 |
| Membership | 사용자-동호회 연결 + 역할/상태 |
| MemberSnapshot | 매월 15일 활동 회원 수 스냅샷 |
| BudgetPeriod | 반기 예산함(상반기/하반기) |
| BudgetGrant | 월별 지원금(회원수 × 50,000) |
| CorporateCard | 기명 법인카드 |
| BudgetTransaction | 카드 사용 내역 |
| TransactionReceipt | 영수증 첨부 |
| Meeting | 모임 |
| Attendance | 출석(QR 체크인) |
| Activity | 활동 이야기 |
| ActivityPhoto | 활동 사진 |
| Report | 생성된 보고서 기록 |
| SlackIntegration | Slack webhook 설정 |
| AuditLog | 중요 변경 감사 로그 |

## 역할(Role) / 상태(Status) enum 계획

- Role: `OWNER`, `PRESIDENT`, `TREASURER`, `MEMBER`
- MembershipStatus: `ACTIVE`, `INACTIVE`, `REVIEW_NEEDED`, `LEFT`
- HalfYear: `FIRST_HALF`(1~6월), `SECOND_HALF`(7~12월)

## SQLite → PostgreSQL 전환

SQLite 전용 기능을 쓰지 않으므로, `schema.prisma` 의 `provider` 를
`postgresql` 로 바꾸고 `DATABASE_URL` 만 교체하면 됩니다. (자세한 절차는
`docs/DEPLOYMENT.md` — 배포 단계에서 작성 예정)
