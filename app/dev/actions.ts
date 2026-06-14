"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { DEV_ROLE_COOKIE_NAME } from "@/lib/auth/session";
import { ROLES } from "@/lib/domain";

/** 개발용: 현재 역할(권한)을 전환합니다. production 에서는 7단계에서 비활성화. */
export async function setDevRole(formData: FormData) {
  const role = String(formData.get("role") ?? "");
  if (!(ROLES as readonly string[]).includes(role)) return;
  const store = await cookies();
  store.set(DEV_ROLE_COOKIE_NAME, role, { httpOnly: true, path: "/" });
  revalidatePath("/", "layout");
}
