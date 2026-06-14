import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { ROLES } from "@/lib/domain";
import type { Role } from "@/lib/domain";

/**
 * MVP 개발용 세션.
 *
 * ⚠️ 임시 구현입니다. 실제 인증(초대코드+닉네임)은 7단계에서 붙입니다.
 * 지금은 권한별 화면을 확인할 수 있도록, 쿠키에 저장된 "역할"로
 * 현재 사용자를 흉내 냅니다. (production 에서는 7단계에서 비활성화)
 */

const DEV_ROLE_COOKIE = "moim_dev_role";
const DEFAULT_ROLE: Role = "TREASURER";

function isRole(v: string | undefined): v is Role {
  return !!v && (ROLES as readonly string[]).includes(v);
}

export async function getDevRole(): Promise<Role> {
  const store = await cookies();
  const v = store.get(DEV_ROLE_COOKIE)?.value;
  return isRole(v) ? v : DEFAULT_ROLE;
}

export interface CurrentContext {
  club: Awaited<ReturnType<typeof prisma.club.findFirst>>;
  role: Role;
  membership: Awaited<ReturnType<typeof prisma.membership.findFirst>>;
}

/** 현재 동호회 + 역할 + (역할을 대표하는) 멤버십을 반환합니다. */
export async function getCurrentContext(): Promise<CurrentContext> {
  const club = await prisma.club.findFirst({ orderBy: { createdAt: "asc" } });
  const role = await getDevRole();

  let membership: CurrentContext["membership"] = null;
  if (club) {
    membership =
      (await prisma.membership.findFirst({
        where: { clubId: club.id, role },
      })) ??
      (await prisma.membership.findFirst({ where: { clubId: club.id } }));
  }

  return { club, role, membership };
}

export const DEV_ROLE_COOKIE_NAME = DEV_ROLE_COOKIE;
