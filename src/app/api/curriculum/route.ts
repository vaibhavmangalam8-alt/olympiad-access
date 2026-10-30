import { NextRequest, NextResponse } from "next/server";
import { getCourseWorkspace } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("course");
  if (!code) {
    return NextResponse.json({ error: "Missing course code." }, { status: 400 });
  }
  try {
    const workspace = await getCourseWorkspace(code.toUpperCase());
    if (!workspace) {
      return NextResponse.json({ error: "Unknown course." }, { status: 404 });
    }
    return NextResponse.json(workspace);
  } catch (err) {
    console.error("Failed to load workspace", err);
    return NextResponse.json({ error: "Failed to load curriculum." }, { status: 500 });
  }
}
