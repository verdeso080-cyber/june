import { PrismaClient } from "@prisma/client";
import { getHalfYearRange } from "../lib/budget/period";
import { calcMonthlyGrant } from "../lib/budget/grants";
import { maskApprovalNo } from "../lib/budget/mask";

const prisma = new PrismaClient();

const utc = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d));

async function reset() {
  // 개발용 seed: 기존 데이터를 비우고 다시 채웁니다.
  await prisma.auditLog.deleteMany();
  await prisma.transactionReceipt.deleteMany();
  await prisma.budgetTransaction.deleteMany();
  await prisma.activityPhoto.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.budgetGrant.deleteMany();
  await prisma.budgetPeriod.deleteMany();
  await prisma.memberSnapshot.deleteMany();
  await prisma.corporateCard.deleteMany();
  await prisma.slackIntegration.deleteMany();
  await prisma.inviteCode.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.club.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  // 안전장치: 이미 데이터가 있으면 건너뜁니다. (배포 시 덮어쓰기 방지)
  // 강제로 다시 시드하려면 SEED_FORCE=true 로 실행하세요.
  const existing = await prisma.club.count();
  if (existing > 0 && process.env.SEED_FORCE !== "true") {
    console.log("기존 데이터가 있어 시드를 건너뜁니다. (SEED_FORCE=true 로 강제 가능)");
    return;
  }
  await reset();

  // 동호회
  const club = await prisma.club.create({
    data: { name: "러닝 동호회", code: "RUNNING-2026" },
  });

  await prisma.inviteCode.create({
    data: { clubId: club.id, code: "RUN-2026-INTERNAL", role: "MEMBER" },
  });

  await prisma.slackIntegration.create({
    data: { clubId: club.id, configured: false },
  });

  // 사용자 + 멤버십 (운영자/회장/총무 + 회원 21명 = 총 24명)
  async function addMember(nickname: string, role: string) {
    const user = await prisma.user.create({
      data: { name: nickname, email: `${nickname}@example.com` },
    });
    return prisma.membership.create({
      data: {
        userId: user.id,
        clubId: club.id,
        nickname,
        role,
        status: "ACTIVE",
      },
    });
  }

  await addMember("alex", "OWNER");
  await addMember("celia", "PRESIDENT");
  const min = await addMember("min", "TREASURER");
  for (let i = 1; i <= 21; i++) {
    await addMember(`member${String(i).padStart(2, "0")}`, "MEMBER");
  }

  // 2026 상반기 월별 활동 회원 수 스냅샷 + 지원금
  const range = getHalfYearRange(utc(2026, 3, 1)); // FIRST_HALF 2026
  const period = await prisma.budgetPeriod.create({
    data: {
      clubId: club.id,
      year: range.year,
      half: range.half,
      startDate: range.start,
      endDate: range.end,
    },
  });

  const counts: Record<number, number> = {
    1: 20,
    2: 22,
    3: 21,
    4: 21,
    5: 23,
    6: 24,
  };
  for (const month of [1, 2, 3, 4, 5, 6]) {
    const count = counts[month];
    const snapshot = await prisma.memberSnapshot.create({
      data: {
        clubId: club.id,
        snapshotDate: utc(2026, month, 15),
        year: 2026,
        month,
        half: range.half,
        activeMemberCount: count,
      },
    });
    await prisma.budgetGrant.create({
      data: {
        clubId: club.id,
        periodId: period.id,
        snapshotId: snapshot.id,
        year: 2026,
        month,
        memberCount: count,
        amount: calcMonthlyGrant(count),
      },
    });
  }

  // 법인카드 (기명)
  const cardCelia = await prisma.corporateCard.create({
    data: {
      clubId: club.id,
      label: "회장 카드",
      holderName: "celia",
      last4: "1234",
    },
  });
  const cardMin = await prisma.corporateCard.create({
    data: {
      clubId: club.id,
      label: "총무 카드",
      holderName: "min",
      last4: "5678",
    },
  });

  // 모임 1개 + 출석(체크인) 12명
  const meeting = await prisma.meeting.create({
    data: {
      clubId: club.id,
      title: "6월 정기 러닝 모임",
      location: "한강공원",
      startsAt: utc(2026, 6, 10),
      description: "한강 5km 러닝 후 저녁 회식",
    },
  });
  const memberMemberships = await prisma.membership.findMany({
    where: { clubId: club.id, role: "MEMBER" },
    take: 12,
  });
  for (const mem of memberMemberships) {
    await prisma.attendance.create({
      data: {
        meetingId: meeting.id,
        membershipId: mem.id,
        response: "GOING",
        checkedInAt: utc(2026, 6, 10),
        method: "QR",
      },
    });
  }

  // 활동 이야기 1개 (모임 + 거래 연결용)
  const activity = await prisma.activity.create({
    data: {
      clubId: club.id,
      meetingId: meeting.id,
      title: "6월 정기 러닝 모임",
      activityDate: utc(2026, 6, 10),
      location: "한강공원",
      content: "6월 정기 모임 겸 회식. 함께 달리고 저녁 식사를 했습니다.",
    },
  });

  // 6월 카드 사용 내역 (seed 스펙 기준: 총 892,000원 / 영수증 누락 2 / 활동 미연결 1)
  type Tx = {
    date: Date;
    card: { id: string };
    merchant: string;
    amount: number;
    category: string;
    activityId: string | null;
    receipt: boolean;
    approvalNo?: string;
  };
  const txs: Tx[] = [
    {
      date: utc(2026, 6, 3),
      card: cardCelia,
      merchant: "OO식당",
      amount: 180000,
      category: "식비",
      activityId: activity.id,
      receipt: true,
      approvalNo: "30012345",
    },
    {
      date: utc(2026, 6, 10),
      card: cardMin,
      merchant: "OO체육관",
      amount: 320000,
      category: "대관",
      activityId: activity.id,
      receipt: true,
      approvalNo: "30067890",
    },
    {
      date: utc(2026, 6, 14),
      card: cardCelia,
      merchant: "OO마트",
      amount: 74000,
      category: "간식",
      activityId: activity.id,
      receipt: false,
      approvalNo: "30011111",
    },
    {
      date: utc(2026, 6, 17),
      card: cardMin,
      merchant: "OO스포츠",
      amount: 250000,
      category: "장비",
      activityId: null, // 활동 미연결
      receipt: true,
      approvalNo: "30022222",
    },
    {
      date: utc(2026, 6, 21),
      card: cardCelia,
      merchant: "OO카페",
      amount: 68000,
      category: "간식",
      activityId: activity.id,
      receipt: false,
      approvalNo: "30033333",
    },
  ];

  for (const t of txs) {
    const tx = await prisma.budgetTransaction.create({
      data: {
        clubId: club.id,
        cardId: t.card.id,
        periodId: period.id,
        activityId: t.activityId,
        enteredById: min.userId,
        transactionDate: t.date,
        amount: t.amount,
        merchantName: t.merchant,
        category: t.category,
        approvalNoMasked: maskApprovalNo(t.approvalNo),
      },
    });
    if (t.receipt) {
      await prisma.transactionReceipt.create({
        data: {
          transactionId: tx.id,
          fileUrl: "/uploads/sample-receipt.png",
          uploadedById: min.userId,
        },
      });
    }
  }

  console.log("Seed 완료: 동호회 1, 회원 24, 상반기 지원금 6,550,000원, 6월 사용 892,000원");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
