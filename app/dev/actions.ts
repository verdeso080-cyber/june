"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  DEV_ROLE_COOKIE_NAME,
  destroySession,
  devLoginEnabled,
} from "@/lib/auth/session";
import { ROLES } from "@/lib/domain";

/** 개발용: 역할 전환 (production 에서는 비활성화). */
export async function setDevRole(formData: FormData) {
  if (!devLoginEnabled()) return;
  const role = String(formData.get("role") ?? "");
  if (!(ROLES as readonly string[]).includes(role)) return;
  // 실제 세션이 있으면 개발용 폴백이 우선되도록 세션을 비웁니다.
  await destroySession();
  const store = await cookies();
  store.set(DEV_ROLE_COOKIE_NAME, role, { httpOnly: true, path: "/" });
  revalidatePath("/", "layout");
}

/** 개발용: 특정 역할로 바로 로그인 (production 에서는 비활성화). */
export async function devLoginAs(formData: FormData) {
  if (!devLoginEnabled()) return;
  const role = String(formData.get("role") ?? "");
  if (!(ROLES as readonly string[]).includes(role)) return;
  await destroySession();
  const store = await cookies();
  store.set(DEV_ROLE_COOKIE_NAME, role, { httpOnly: true, path: "/" });
  redirect("/dashboard");
}
