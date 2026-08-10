"use server";

import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession, destroySession } from "./session";

export async function loginAction(_: { error: string | null }, formData: FormData): Promise<{ error: string | null }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await compare(password, user.passwordHash))) return { error: "Invalid email or password." };
  await createSession(user.id);
  redirect("/");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

export async function setupAction(_: { error: string | null }, formData: FormData): Promise<{ error: string | null }> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid name and email." };
  if (password.length < 12) return { error: "Use at least 12 characters for the password." };
  if (password !== confirmation) return { error: "Passwords do not match." };
  const user = await db.$transaction(async transaction => {
    await transaction.$executeRaw`SELECT pg_advisory_xact_lock(1397001)`;
    if (await transaction.user.count()) return null;
    return transaction.user.create({ data: { name, email, passwordHash: await hash(password, 12) } });
  });
  if (!user) return { error: "Setup is already complete. Sign in instead." };
  await createSession(user.id);
  redirect("/");
}
