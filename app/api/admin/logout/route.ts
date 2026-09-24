import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
	cookies().delete(ADMIN_SESSION_COOKIE);
	return NextResponse.json({ success: true });
}
