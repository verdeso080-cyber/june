import { prisma } from "@/lib/db";

export function listMeetings(clubId: string) {
  return prisma.meeting.findMany({
    where: { clubId },
    include: {
      attendances: true,
      activity: { select: { id: true } },
    },
    orderBy: { startsAt: "desc" },
  });
}

export function getMeeting(id: string) {
  return prisma.meeting.findUnique({
    where: { id },
    include: {
      attendances: {
        include: { membership: { select: { nickname: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
      checkinSessions: { orderBy: { createdAt: "desc" } },
      activity: { select: { id: true, title: true } },
    },
  });
}

/** 활성·미만료 체크인 세션 1개를 토큰으로 조회. */
export function getSessionByToken(token: string) {
  return prisma.checkinSession.findUnique({
    where: { token },
    include: { meeting: { select: { id: true, title: true, clubId: true } } },
  });
}
