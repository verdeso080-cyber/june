# Moim Club Ops — Claude Code Instructions

## Product context

This project is a production-oriented MVP for "모임", an internal company club
operations web app.

Target users:

- Internal company club presidents
- Club treasurers
- Club members
- Company admins who need activity/budget evidence

Core product value:

- Make corporate-card spending easy to track.
- Connect spending to actual club activities.
- Generate budget and activity reports.
- Keep attendance simple via QR check-in.

## Business rules

Budget:

- Monthly support is calculated on the 15th of each month.
- Monthly support = active member count on the 15th x 50,000 KRW.
- "Active member count" means members whose membership status is currently
  `ACTIVE` (not inactive / review_needed / left).
- Unused budget rolls over only within the current half-year.
- Half-year periods are Jan-Jun (`FIRST_HALF`) and Jul-Dec (`SECOND_HALF`).
- Remaining budget expires at the end of the half-year.
- Corporate card usage is the source of spending records.
- Budget records are visible to all members, but sensitive card details must
  be masked.

Attendance:

- QR check-in is enough.
- Do not implement late/early-leave tracking unless explicitly requested.
- Operators may manually correct attendance.

Activity stories:

- All members can upload photos.
- Operators choose which photos are included in reports.
- Activity records should connect attendance, photos, text, and linked spending.

Auth:

- MVP supports a compact internal flow: invite code + nickname + minimal auth.
- Do not build a fully open public signup.
- Protect club data by club membership and role.

## Engineering principles

- Use TypeScript strictly.
- Prefer simple, maintainable code over clever abstractions.
- Keep business logic in server-side services, not only React components.
- Budget calculations must be tested.
- Never expose secrets in client code.
- Never commit `.env` or webhook URLs.
- Add audit logs for important mutations (role/status changes, snapshot
  create/update, grant recalculation, transaction CRUD, report generation,
  Slack integration changes).

## Reports export

- Numeric / budget reports → Excel (xlsx) and CSV.
- Activity-story reports → PDF (print-friendly).

## Required commands

Before claiming a task is complete, run:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

If a command does not exist yet, create it in package.json.

## Safety rules

Do not run destructive commands without clearly explaining why and asking for
approval (in plain Korean, because the product owner is a non-developer):

- `rm -rf`
- `git reset --hard`
- `git push --force`
- `prisma migrate reset`
- `drop database`
- deleting migrations
- deleting uploaded files

## UI principles

- Korean-first UI.
- The budget dashboard is the most important screen.
- Always show: current half-year period, total granted, total used, remaining,
  expiring amount, days until expiration, missing receipts, unlinked
  transactions.
- Member-facing budget page should be transparent but mask sensitive card data.

## Acceptance standard

A feature is not done unless:

- It works in the UI.
- It persists to the database.
- It respects role permissions (enforced on the server, not only the UI).
- It has at least one happy-path / service-level test where applicable.
- The build passes.
- The README explains how to run it.

## Repo notes

- The previous unrelated app ("은영스쿨", a Vite/React tool) was moved to
  `legacy/aistudio-app/`. Do not modify it; it is kept only for reference.
