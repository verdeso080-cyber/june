import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { ROLES } from "@/lib/domain";
import type { Role } from "@/lib/domain";

/**
 * 인증/세션.
 *
 * - 실제 로그인: 초대코드 + 닉네임 (app/login).
 * - 세션은 HMAC 으로 서명된 쿠키(멤버십 ID)로 유지합니다.
 * - 개발용 로그인(역할 전환)은 FEATURE_DEV_LOGIN=true 이고 production 이
 *   아닐 때만 동작합니다. (나중에 Supabase 등으로 교체하기 쉬운 구조)
 */

const SESSION_COOKIE = "moim_session";
const DEV_ROLE_COOKIE = "moim_dev_role";
const DEFAULT_ROLE: Role = "TREASURER";

function secret(): string {
  return process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

function makeToken(membershipId: string): string {
  const b = Buffer.from(membershipId).toString("base64url");
  return `${b}.${sign(b)}`;
}

function parseToken(token: string): string | null {
  const [b, sig] = token.split(".");
  if (!b || !sig) return null;
  if (sign(b) !== sig) return null;
  try {
    return Buffer.from(b, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

export function devLoginEnabled(): boolean {
  return (
    process.env.FEATURE_DEV_LOGIN === "true" &&
    process.env.NODE_ENV !== "production"
  );
}

function isRole(v: string | undefined): v is Role {
  return !!v && (ROLES as readonly string[]).includes(v);
}

export async function createSession(membershipId: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, makeToken(membershipId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionMembershipId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token ? parseToken(token) : null;
}

export async function getDevRole(): Promise<Role> {
  const store = await cookies();
  const v = store.get(DEV_ROLE_COOKIE)?.value;
  return isRole(v) ? v : DEFAULT_ROLE;
}

/** 현재 로그인 사용자 컨텍스트(미로그인 시 membership=null). */
export async function getCurrentContext() {
  const id = await getSessionMembershipId();
  if (id) {
    const membership = await prisma.membership.findUnique({
      where: { id },
      include: { club: true },
    });
    if (membership) {
      return {
        club: membership.club,
        role: membership.role as Role,
        membership,
      };
    }
  }

  // 개발용 폴백: 세션이 없을 때 역할 쿠키로 대표 멤버십을 사용
  if (devLoginEnabled()) {
    const club = await prisma.club.findFirst({ orderBy: { createdAt: "asc" } });
    const role = await getDevRole();
    let membership = null;
    if (club) {
      membership =
        (await prisma.membership.findFirst({
          where: { clubId: club.id, role },
          include: { club: true },
        })) ??
        (await prisma.membership.findFirst({
          where: { clubId: club.id },
          include: { club: true },
        }));
    }
    return {
      club: membership?.club ?? club,
      role: (membership?.role as Role) ?? role,
      membership,
    };
  }

  return { club: null, role: "MEMBER" as Role, membership: null };
}

/** 로그인 필수 페이지에서 사용. 미로그인 시 /login 으로 보냅니다. */
export async function requireContext() {
  const ctx = await getCurrentContext();
  if (!ctx.membership || !ctx.club) {
    redirect("/login");
  }
  return { club: ctx.club, role: ctx.role, membership: ctx.membership };
}

export const DEV_ROLE_COOKIE_NAME = DEV_ROLE_COOKIE;
