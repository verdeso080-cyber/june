import { mkdir, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";

/**
 * MVP 파일 저장: 로컬 public/uploads 에 저장하고 공개 URL 을 반환.
 *
 * ⚠️ 서버리스(예: Vercel) 환경에서는 영구 저장되지 않습니다.
 *    운영 단계에서 외부 스토리지 어댑터로 교체합니다(배포 문서 참고).
 */
export async function saveUpload(file: File): Promise<string> {
  if (file.size === 0) throw new Error("빈 파일입니다.");
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = (file.name.split(".").pop() || "bin")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8);
  const name = `${randomBytes(8).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buf);
  return `/uploads/${name}`;
}
